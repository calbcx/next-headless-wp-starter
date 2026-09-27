import PageHeader from "@/components/PageHeader";

export const metadata = {
  title: "Writing",
  description:
    "Technical writing route reserved for future WordPress-managed writeups.",
  openGraph: {
    title: "Writing | Next Headless WP Starter",
    description:
      "Technical writing route reserved for future WordPress-managed writeups."
  }
};

export default function WritingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Technical notes"
        title="Writing"
        description="A route reserved for implementation notes, technical writeups, and future WordPress-managed writing entries."
      />

      <section className="container page-section page-section--tight">
        <div className="content-panel">
          <h2>Planned content model</h2>
          <p>
            Writing entries will be added after the core Project content flow is
            complete. Keeping this route in place now validates navigation and
            page structure without mixing future CMS work into the frontend
            foundation.
          </p>
        </div>
      </section>
    </>
  );
}
