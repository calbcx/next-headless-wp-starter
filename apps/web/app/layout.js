import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "./globals.css";

export const metadata = {
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <Header />
          <main className="site-main">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
