const PROJECT_FIELDS = `
  id
  title
  slug
  excerpt
  content
  date
  technologies {
    nodes {
      id
      name
      slug
    }
  }
`;

function redactEndpointForError(endpoint) {
  if (typeof endpoint !== "string" || !endpoint.trim()) {
    return "configured WordPress endpoint";
  }

  try {
    const url = new URL(endpoint);

    if (url.username) {
      url.username = "redacted";
    }

    if (url.password) {
      url.password = "redacted";
    }

    url.search = "";
    url.hash = "";

    return url.toString();
  } catch {
    return "configured WordPress endpoint";
  }
}

function redactMessageForError(message, endpoint) {
  if (typeof message !== "string" || !message.trim()) {
    return "Network request failed.";
  }

  const safeMessage =
    typeof endpoint === "string" && endpoint.trim()
      ? message.replaceAll(endpoint, redactEndpointForError(endpoint))
      : message;

  // Upstream errors may normalize the URL or omit its fragment.
  return safeMessage.replace(/https?:\/\/[^\s"'<>]+/gi, redactEndpointForError);
}

export class WordPressFetchError extends Error {
  /**
   * Create an error for configured WordPress requests that cannot be trusted.
   *
   * @param {object} options Error details.
   * @param {string} options.endpoint Configured GraphQL endpoint.
   * @param {number|null} [options.status] HTTP status, when available.
   * @param {string} options.message Failure detail.
   * @param {string} [options.graphQLError] First GraphQL error message.
   */
  constructor({ endpoint, status = null, message, graphQLError = "" }) {
    const safeEndpoint = redactEndpointForError(endpoint);
    const safeMessage = redactMessageForError(message, endpoint);
    const safeGraphQLError = graphQLError
      ? redactMessageForError(graphQLError, endpoint)
      : "";
    const statusLabel = status ?? "unavailable";
    const graphQLDetail = safeGraphQLError
      ? ` First GraphQL error: ${safeGraphQLError}`
      : "";
    const errorMessage = `WordPress GraphQL request failed for ${safeEndpoint} (status: ${statusLabel}): ${safeMessage}${graphQLDetail}`;

    super(errorMessage);

    this.name = "WordPressFetchError";
    this.endpoint = safeEndpoint;
    this.status = status;
    this.graphQLError = safeGraphQLError;
  }
}

function getFirstGraphQLError(payload) {
  if (!Array.isArray(payload?.errors) || payload.errors.length === 0) {
    return "";
  }

  const firstError = payload.errors[0];

  if (typeof firstError?.message === "string" && firstError.message.trim()) {
    return firstError.message.trim();
  }

  if (typeof firstError === "string" && firstError.trim()) {
    return firstError.trim();
  }

  return "Unknown GraphQL error";
}

async function readGraphQLPayload(response, endpoint) {
  const responseText = await response.text();

  if (!responseText) {
    return {};
  }

  try {
    return JSON.parse(responseText);
  } catch {
    if (!response.ok) {
      return {};
    }

    throw new WordPressFetchError({
      endpoint,
      status: response.status,
      // JSON parser errors can contain raw response body excerpts.
      message: "Invalid JSON response."
    });
  }
}

/**
 * Run a GraphQL request against the configured WordPress endpoint.
 *
 * @param {string} query GraphQL query document.
 * @param {Record<string, unknown>} [variables] GraphQL variables.
 * @returns {Promise<Record<string, unknown>|null>} GraphQL data object.
 */
async function fetchGraphQL(query, variables = {}) {
  const endpoint = process.env.WORDPRESS_GRAPHQL_URL;

  if (!endpoint) {
    console.warn("WORDPRESS_GRAPHQL_URL is not configured.");
    return null;
  }

  let response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 }
    });
  } catch (error) {
    throw new WordPressFetchError({
      endpoint,
      message:
        error instanceof Error
          ? error.message
          : "Network request failed."
    });
  }

  const payload = await readGraphQLPayload(response, endpoint);
  const graphQLError = getFirstGraphQLError(payload);

  if (!response.ok) {
    throw new WordPressFetchError({
      endpoint,
      status: response.status,
      message: `HTTP ${response.status} ${response.statusText || "response"}.`,
      graphQLError
    });
  }

  if (graphQLError) {
    throw new WordPressFetchError({
      endpoint,
      status: response.status,
      message: "GraphQL response contained errors.",
      graphQLError
    });
  }

  if (
    !payload ||
    typeof payload !== "object" ||
    !Object.hasOwn(payload, "data") ||
    !payload.data ||
    typeof payload.data !== "object"
  ) {
    throw new WordPressFetchError({
      endpoint,
      status: response.status,
      message: "GraphQL response did not include a data object."
    });
  }

  return payload.data;
}

function normalizeText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeTechnology(node) {
  return {
    id: node?.id ?? "",
    name: node?.name ?? "",
    slug: node?.slug ?? ""
  };
}

function normalizeProject(node) {
  const technologies = Array.isArray(node?.technologies?.nodes)
    ? node.technologies.nodes.map(normalizeTechnology).filter((item) => item.slug)
    : [];

  return {
    id: node?.id ?? "",
    title: normalizeText(node?.title) || "Untitled project",
    slug: node?.slug ?? "",
    excerpt: normalizeText(node?.excerpt),
    content: normalizeText(node?.content),
    date: node?.date ?? "",
    technologies
  };
}

function normalizeUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }

  try {
    const url = new URL(value);

    if (!["http:", "https:"].includes(url.protocol)) {
      return "";
    }

    return url.toString();
  } catch {
    return "";
  }
}

function normalizeProjectContentSettings(settings) {
  return {
    cvUrl: normalizeUrl(settings?.cvUrl),
    githubUrl: normalizeUrl(settings?.githubUrl),
    linkedinUrl: normalizeUrl(settings?.linkedinUrl),
    websiteUrl: normalizeUrl(settings?.websiteUrl)
  };
}

export async function getProjects() {
  const data = await fetchGraphQL(`
    query GetProjects {
      projects(first: 100) {
        nodes {
          ${PROJECT_FIELDS}
        }
      }
    }
  `);

  const nodes = data?.projects?.nodes;

  if (!Array.isArray(nodes)) {
    return [];
  }

  return nodes.map(normalizeProject).filter((project) => project.slug);
}

export async function getProjectBySlug(slug) {
  if (!slug) {
    return null;
  }

  const data = await fetchGraphQL(
    `
      query GetProjectBySlug($id: ID!) {
        project(id: $id, idType: SLUG) {
          ${PROJECT_FIELDS}
        }
      }
    `,
    { id: slug }
  );

  if (!data?.project) {
    return null;
  }

  return normalizeProject(data.project);
}

export async function getTechnologies() {
  const data = await fetchGraphQL(`
    query GetTechnologies {
      technologies(first: 100) {
        nodes {
          id
          name
          slug
          description
          count
        }
      }
    }
  `);

  const nodes = data?.technologies?.nodes;

  if (!Array.isArray(nodes)) {
    return [];
  }

  return nodes
    .map((node) => ({
      ...normalizeTechnology(node),
      description: normalizeText(node?.description),
      count: Number.isFinite(node?.count) ? node.count : 0
    }))
    .filter((technology) => technology.slug);
}

export async function getProjectContentSettings() {
  const data = await fetchGraphQL(`
    query GetProjectContentSettings {
      projectContentSettings {
        cvUrl
        githubUrl
        linkedinUrl
        websiteUrl
      }
    }
  `);

  return normalizeProjectContentSettings(data?.projectContentSettings);
}
