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
    default: "Headless WordPress Reference",
    template: "%s | Headless WordPress Reference"
  },
  description:
    "A developer-focused headless WordPress reference project using Next.js, JavaScript, and WPGraphQL.",
  openGraph: {
    title: "Headless WordPress Reference",
    description:
      "A developer-focused headless WordPress reference project using Next.js, JavaScript, and WPGraphQL.",
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
