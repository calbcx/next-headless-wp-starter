const profileLinks = [
  ["CV", "cvUrl"],
  ["GitHub", "githubUrl"],
  ["LinkedIn", "linkedinUrl"],
  ["Website", "websiteUrl"]
];

function ProfileFooterLink({ href, label }) {
  return (
    <a href={href} rel="noopener noreferrer" target="_blank">
      <span>{label}</span>
    </a>
  );
}

export default function Footer({ settings = {} }) {
  const links = profileLinks
    .map(([label, key]) => ({ label, href: settings[key] }))
    .filter((link) => link.href);

  return (
    <footer className="portfolio-footer">
      <div className="container portfolio-footer__profile-bar">
        <p>
          WordPress manages content. Next.js renders the public frontend through
          WPGraphQL.
        </p>
        {links.length > 0 ? (
          <nav className="portfolio-footer__links" aria-label="Profile links">
            {links.map((link) => (
              <ProfileFooterLink
                key={link.label}
                href={link.href}
                label={link.label}
              />
            ))}
          </nav>
        ) : null}
      </div>
    </footer>
  );
}
