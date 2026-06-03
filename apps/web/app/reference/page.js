import PageHeader from "@/components/PageHeader";

export const metadata = {
  title: "Reference",
  description:
    "Implementation reference notes for the headless WordPress and Next.js architecture.",
  openGraph: {
    title: "Reference | Headless WordPress Reference",
    description:
      "Implementation reference notes for the headless WordPress and Next.js architecture."
  }
};

export default function ReferencePage() {
  return (
    <>
      <PageHeader
        eyebrow="Architecture"
        title="Reference"
        description="Concise notes about the architecture boundaries between WordPress, WPGraphQL, and the Next.js frontend."
      />

      <section className="container page-section page-section--tight">
        <div className="grid">
          <ReferenceCard
            title="WordPress"
            description="Owns content management, editing workflows, media, and the custom Project content model."
          />
          <ReferenceCard
            title="WPGraphQL"
            description="Provides the API contract between WordPress content and the frontend fetching layer."
          />
          <ReferenceCard
            title="Next.js"
            description="Owns public rendering, routing, metadata, and normalized presentation components."
          />
        </div>
      </section>
    </>
  );
}

function ReferenceCard({ title, description }) {
  return (
    <article className="project-card">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </article>
  );
}
