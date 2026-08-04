"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container page-section">
      <div className="empty-state" role="alert">
        <h2>Content could not be loaded.</h2>
        <p>
          The WordPress content request failed. Check the GraphQL endpoint and
          try again.
        </p>
        <button className="button" type="button" onClick={reset}>
          Try again
        </button>
      </div>
    </section>
  );
}
