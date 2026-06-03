import Link from "next/link";
import TechnologyBadge from "@/components/TechnologyBadge";

export default function ProjectCard({ project }) {
  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : [];

  return (
    <article className="project-card">
      <div>
        <h2>
          <Link href={`/projects/${project.slug}`}>{project.title}</Link>
        </h2>
        {project.excerpt ? <p>{project.excerpt}</p> : null}
      </div>
      {technologies.length > 0 ? (
        <div className="badge-list" aria-label="Technologies">
          {technologies.map((technology) => (
            <TechnologyBadge key={technology.slug} name={technology.name} />
          ))}
        </div>
      ) : null}
    </article>
  );
}
