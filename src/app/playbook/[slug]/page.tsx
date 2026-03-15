import Link from "next/link";
import { guides } from "@/data/playbook/guides";

// For static export, we need to define all possible slugs
export function generateStaticParams() {
  return Object.keys(guides).map((slug) => ({ slug }));
}

const calloutStyles = {
  tip: {
    bg: "bg-[#eef5f0]",
    border: "border-[#c2dcc9]",
    text: "text-[#3d6b4e]",
    icon: "\u2705",
    label: "Tip",
  },
  warning: {
    bg: "bg-[#faf3e8]",
    border: "border-[#e2ddd3]",
    text: "text-[#7a5c28]",
    icon: "\u26A0\uFE0F",
    label: "Warning",
  },
  deadline: {
    bg: "bg-[#fdf0ee]",
    border: "border-[#e8ccc7]",
    text: "text-[#8b3d33]",
    icon: "\u23F0",
    label: "Deadline",
  },
  "legal-right": {
    bg: "bg-[#eef3fa]",
    border: "border-[#c8d8ec]",
    text: "text-[#2d5590]",
    icon: "\u2696\uFE0F",
    label: "Your Legal Right",
  },
};

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = guides[slug];

  if (!guide) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/playbook/"
          className="text-[#3868a8] hover:text-[#2d5590] text-sm font-medium mb-8 block"
        >
          &larr; Back to Playbook
        </Link>
        <div className="bg-[#faf3e8] border border-[#e2ddd3] rounded-[14px] p-6 text-center">
          <h1 className="text-2xl font-normal font-[family-name:var(--font-fraunces)] text-[#7a5c28] mb-2">
            Guide not found
          </h1>
          <p className="font-light text-[#876025]">
            This guide doesn&apos;t exist yet.{" "}
            <Link href="/playbook/" className="underline font-medium">
              Browse all guides
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link
        href="/playbook/"
        className="text-[#3868a8] hover:text-[#2d5590] text-sm font-medium mb-8 block"
      >
        &larr; Back to Playbook
      </Link>

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium text-[#3868a8] bg-[#eef3fa] rounded-md px-2 py-0.5">
            {guide.category}
          </span>
          <span className="text-xs text-[#5c6b62]">{guide.readingTime} read</span>
        </div>
        <h1 className="text-3xl font-normal font-[family-name:var(--font-fraunces)] text-[#1f2a24] mb-3">{guide.title}</h1>
        <p className="text-lg font-light text-[#5c6b62]">{guide.subtitle}</p>
      </header>

      {/* Key Takeaways */}
      <div className="bg-[#eee9df] border border-[#e2ddd3] rounded-[14px] p-6 mb-10">
        <h2 className="text-sm font-medium text-[#5c6b62] uppercase tracking-wide mb-3">
          Key Takeaways
        </h2>
        <ul className="space-y-2">
          {guide.keyTakeaways.map((takeaway, i) => (
            <li key={i} className="flex items-start gap-2 font-light text-[#5c6b62]">
              <span className="text-[#5b8a6e] shrink-0 mt-0.5">&bull;</span>
              <span>{takeaway}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Sections */}
      <div className="space-y-10">
        {guide.sections.map((section, i) => (
          <section key={i}>
            <h2 className="text-xl font-normal font-[family-name:var(--font-fraunces)] text-[#1f2a24] mb-4">
              {section.heading}
            </h2>
            <div className="font-light text-[#5c6b62] leading-[1.7] whitespace-pre-line">
              {section.content}
            </div>
            {section.callout && (
              <div
                className={`mt-4 p-4 rounded-[14px] border ${calloutStyles[section.callout.type].bg} ${calloutStyles[section.callout.type].border}`}
              >
                <p
                  className={`text-sm font-medium ${calloutStyles[section.callout.type].text}`}
                >
                  <span className="mr-1" aria-hidden="true">
                    {calloutStyles[section.callout.type].icon}
                  </span>
                  <span className="font-bold">
                    {calloutStyles[section.callout.type].label}:
                  </span>{" "}
                  {section.callout.text}
                </p>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Related workflow CTA */}
      {guide.relatedWorkflow && (
        <div className="mt-12 bg-[#eef3fa] border border-[#c8d8ec] rounded-[14px] p-6">
          <h3 className="text-lg font-normal font-[family-name:var(--font-fraunces)] text-[#2d5590] mb-2">
            Ready to take action?
          </h3>
          <p className="font-light text-[#3868a8] mb-4">
            Use our Bill Fighter tool to generate the letter you need.
          </p>
          <Link
            href={`/bill-fighter/${guide.relatedWorkflow}/`}
            className="inline-block px-6 py-3 bg-[#3868a8] text-white rounded-[10px] font-medium hover:bg-[#2d5590] transition-colors"
          >
            Generate Your Letter <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-10 pt-6 border-t border-[#e2ddd3]">
        <p className="text-xs text-[#5c6b62]">
          This guide provides general information for educational purposes only.
          It does not constitute legal advice. For advice about your specific
          situation, consult a licensed attorney.
        </p>
      </div>
    </div>
  );
}
