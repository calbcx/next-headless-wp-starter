import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import ProjectCard from "@/components/ProjectCard";
import TechnologyBadge from "@/components/TechnologyBadge";
import { getProjects, getTechnologies } from "@/lib/wordpress";

export const metadata = {
  title: "Home",
  description:
    "A developer-focused headless WordPress reference frontend built with Next.js, JavaScript, and WPGraphQL.",
  openGraph: {
    title: "Headless WordPress Reference",
    description:
      "A developer-focused headless WordPress reference frontend built with Next.js, JavaScript, and WPGraphQL."
  }
};

export default async function HomePage() {
  const [projects, technologies] = await Promise.all([
    getProjects(),
    getTechnologies()
  ]);
  const featuredProjects = projects.slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow="Reference implementation"
        title="Headless WordPress with a Next.js frontend"
        description="A practical project structure for custom WordPress content modeling, WPGraphQL data access, and a JavaScript App Router frontend."
      >
        <div className="hero-actions">
          <Link className="button" href="/projects">
            View projects
          </Link>
          <Link className="button button--secondary" href="/reference">
            Read reference notes
          </Link>
        </div>
      </PageHeader>

      <section className="container page-section page-section--tight">
        <div className="meta-list">
          <div className="meta-item">
            <strong>CMS</strong>
            <span>WordPress with a custom content plugin</span>
          </div>
          <div className="meta-item">
            <strong>API</strong>
            <span>WPGraphQL with normalized frontend responses</span>
          </div>
          <div className="meta-item">
            <strong>Frontend</strong>
            <span>Next.js App Router using JavaScript</span>
          </div>
        </div>
      </section>

      <section className="container page-section">
        <PageSectionHeading
          title="Recent projects"
          description="Published WordPress projects render through the isolated GraphQL helper."
        />
        {featuredProjects.length > 0 ? (
          <div className="grid">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState message="No published projects are available yet. Add a Project in WordPress to populate this section." />
        )}
      </section>

      <section className="container page-section">
        <PageSectionHeading
          title="Technologies"
          description="Technology terms come from the custom WordPress taxonomy."
        />
        {technologies.length > 0 ? (
          <div className="badge-list">
            {technologies.map((technology) => (
              <TechnologyBadge key={technology.id} name={technology.name} />
            ))}
          </div>
        ) : (
          <EmptyState message="No technology terms are available yet." />
        )}
      </section>
    </>
  );
}

function PageSectionHeading({ title, description }) {
  return (
    <div className="content-panel">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function EmptyState({ message }) {
  return <div className="empty-state">{message}</div>;
}
