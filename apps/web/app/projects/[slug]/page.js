import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import TechnologyBadge from "@/components/TechnologyBadge";
import { getProjectBySlug, getProjects } from "@/lib/wordpress";

export async function generateStaticParams() {
  const projects = await getProjects();

  return projects.map((project) => ({
    slug: project.slug
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project not found"
    };
  }

  const description =
    project.excerpt || "Project detail from the WordPress content model.";

  return {
    title: project.title,
    description,
    openGraph: {
      title: `${project.title} | Headless WordPress Reference`,
      description
    }
  };
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <PageHeader
        eyebrow="Project"
        title={project.title}
        description={project.excerpt || "Published WordPress project entry."}
      >
        {project.technologies.length > 0 ? (
          <div className="badge-list">
            {project.technologies.map((technology) => (
              <TechnologyBadge key={technology.slug} name={technology.name} />
            ))}
          </div>
        ) : null}
      </PageHeader>

      <section className="container page-section page-section--tight">
        <article className="detail-content">
          {project.content ? (
            <p>{project.content}</p>
          ) : (
            <div className="empty-state">
              This project does not have body content yet.
            </div>
          )}
        </article>
      </section>
    </>
  );
}
