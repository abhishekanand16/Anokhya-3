import type { EventTerms } from "@/data/terms";

export function EventTermsBody({ terms }: { terms: EventTerms }) {
  return (
    <article className="terms-doc">
      <p className="terms-preamble">{terms.preamble}</p>
      {terms.sections.map((section) => (
        <section key={section.heading} className="terms-section">
          <h3>{section.heading}</h3>
          {section.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
      <p className="terms-closing">{terms.closing}</p>
    </article>
  );
}
