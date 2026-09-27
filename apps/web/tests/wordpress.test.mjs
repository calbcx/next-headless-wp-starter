import assert from "node:assert/strict";
import { inspect } from "node:util";
import test from "node:test";
import { getProjects, WordPressFetchError } from "../lib/wordpress.js";

const endpoint =
  "https://cms-user:cms-password@example.test/graphql?token=PRIVATE_TOKEN#PRIVATE_FRAGMENT";

function mockWordPress(t, fetchResponse) {
  const previousEndpoint = process.env.WORDPRESS_GRAPHQL_URL;
  process.env.WORDPRESS_GRAPHQL_URL = endpoint;
  t.after(() => {
    if (previousEndpoint === undefined) {
      delete process.env.WORDPRESS_GRAPHQL_URL;
    } else {
      process.env.WORDPRESS_GRAPHQL_URL = previousEndpoint;
    }
  });
  t.mock.method(globalThis, "fetch", fetchResponse);
}

function assertRedacted(error) {
  assert.ok(error instanceof WordPressFetchError);
  for (const output of [error.message, error.stack, JSON.stringify(error), inspect(error)]) {
    for (const secret of ["cms-user", "cms-password", "PRIVATE_TOKEN", "PRIVATE_FRAGMENT"]) {
      assert.ok(!output.includes(secret), `Error output exposed ${secret}`);
    }
  }
}

for (const status of [200, 400]) {
  test(`redacts reflected endpoint secrets in GraphQL errors with HTTP ${status}`, async (t) => {
    mockWordPress(t, async () =>
      Response.json({ errors: [{ message: `Request rejected at ${endpoint}` }] }, { status })
    );

    await assert.rejects(getProjects(), (error) => {
      assertRedacted(error);
      assert.equal(error.status, status);
      assert.equal(
        error.graphQLError,
        "Request rejected at https://redacted:redacted@example.test/graphql"
      );
      return true;
    });
  });
}

test("redacts URLs in network errors even when the URL fragment is omitted", async (t) => {
  mockWordPress(t, async () => {
    throw new Error(`Request failed for ${endpoint.split("#")[0]}`);
  });

  await assert.rejects(getProjects(), (error) => {
    assertRedacted(error);
    assert.equal(error.status, null);
    return true;
  });
});

test("does not retain response body excerpts from JSON parsing errors", async (t) => {
  mockWordPress(t, async () => new Response("<LEAKME>"));

  await assert.rejects(getProjects(), (error) => {
    assertRedacted(error);
    assert.match(error.message, /Invalid JSON response/);
    assert.equal(error.cause, undefined);
    assert.ok(!inspect(error).includes("LEAKME"));
    return true;
  });
});

test("preserves useful GraphQL diagnostics without secrets", async (t) => {
  const message = 'Cannot query field "projects" on type "RootQuery".';
  mockWordPress(t, async () => Response.json({ errors: [{ message }] }));

  await assert.rejects(getProjects(), (error) => {
    assertRedacted(error);
    assert.equal(error.graphQLError, message);
    assert.ok(error.message.includes(message));
    return true;
  });
});

test("continues to normalize successful project responses", async (t) => {
  mockWordPress(t, async () =>
    Response.json({ data: { projects: { nodes: [{ slug: "example", title: "Example" }] } } })
  );

  const projects = await getProjects();
  assert.equal(projects.length, 1);
  assert.equal(projects[0].slug, "example");
  assert.equal(projects[0].title, "Example");
});
