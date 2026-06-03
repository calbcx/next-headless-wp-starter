export default function TechnologyBadge({ name }) {
  if (!name) {
    return null;
  }

  return <span className="technology-badge">{name}</span>;
}
