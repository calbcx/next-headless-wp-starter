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

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      console.warn(`WordPress GraphQL request failed: ${response.status}`);
      return null;
    }

    const payload = await response.json();

    if (Array.isArray(payload.errors) && payload.errors.length > 0) {
      console.warn("WordPress GraphQL returned errors.", payload.errors);
      return null;
    }

    return payload.data ?? null;
  } catch (error) {
    console.warn("WordPress GraphQL request could not be completed.", error);
    return null;
  }
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
