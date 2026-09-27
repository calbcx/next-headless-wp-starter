import Link from "next/link";

const navigationItems = [
  { href: "/projects", label: "Projects" },
  { href: "/technologies", label: "Technologies" },
  { href: "/writing", label: "Writing" },
  { href: "/reference", label: "Reference" }
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link className="site-header__brand" href="/">
          Next Headless WP Starter
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          {navigationItems.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
