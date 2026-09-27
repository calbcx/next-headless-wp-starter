import PageHeader from "@/components/PageHeader";
import TechnologyBadge from "@/components/TechnologyBadge";
import { getTechnologies } from "@/lib/wordpress";

export const metadata = {
  title: "Technologies",
  description:
    "Technology terms managed in WordPress and exposed through WPGraphQL.",
  openGraph: {
    title: "Technologies | Next Headless WP Starter",
    description:
      "Technology terms managed in WordPress and exposed through WPGraphQL."
  }
};

export default async function TechnologiesPage() {
  const technologies = await getTechnologies();

  return (
    <>
      <PageHeader
        eyebrow="Taxonomy"
        title="Technologies"
        description="Structured technology terms from WordPress, used to group projects by implementation stack."
      />

      <section className="container page-section page-section--tight">
        {technologies.length > 0 ? (
          <div className="grid">
            {technologies.map((technology) => (
              <article className="project-card" key={technology.id}>
                <div>
                  <h2>{technology.name}</h2>
                  {technology.description ? (
                    <p>{technology.description}</p>
                  ) : (
                    <p>No description has been added in WordPress yet.</p>
                  )}
                </div>
                <TechnologyBadge name={`${technology.count} project entries`} />
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            No technology terms are available yet.
          </div>
        )}
      </section>
    </>
  );
}
