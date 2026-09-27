import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getProjectContentSettings } from "@/lib/wordpress";
import "./globals.css";

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Next Headless WP Starter",
    template: "%s | Next Headless WP Starter"
  },
  description:
    "A developer-focused headless WordPress starter using Next.js, JavaScript, and WPGraphQL.",
  openGraph: {
    title: "Next Headless WP Starter",
    description:
      "A developer-focused headless WordPress starter using Next.js, JavaScript, and WPGraphQL.",
    type: "website"
  }
};

export default async function RootLayout({ children }) {
  const projectContentSettings = await getProjectContentSettings();

  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <Header />
          <main className="site-main">{children}</main>
          <Footer settings={projectContentSettings} />
        </div>
      </body>
    </html>
  );
}
