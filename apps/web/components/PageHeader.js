export default function PageHeader({ eyebrow, title, description, children }) {
  return (
    <section className="container page-header">
      {eyebrow ? <p className="page-header__eyebrow">{eyebrow}</p> : null}
      <h1>{title}</h1>
      {description ? <p>{description}</p> : null}
      {children}
    </section>
  );
}
