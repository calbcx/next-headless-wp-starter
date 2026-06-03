import PageHeader from "@/components/PageHeader";
import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/lib/wordpress";

export const metadata = {
  title: "Projects",
  description:
    "Project entries managed in WordPress and rendered by the Next.js frontend.",
  openGraph: {
    title: "Projects | Headless WordPress Reference",
    description:
      "Project entries managed in WordPress and rendered by the Next.js frontend."
  }
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHeader
        eyebrow="WordPress content"
        title="Projects"
        description="Implementation examples and case-study style entries fetched from the custom WordPress Project content type."
      />

      <section className="container page-section page-section--tight">
        {projects.length > 0 ? (
          <div className="grid">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            No published projects are available yet. Create and publish a
            Project in WordPress to populate this route.
          </div>
        )}
      </section>
    </>
  );
}
