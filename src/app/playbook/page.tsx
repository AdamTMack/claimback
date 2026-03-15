import Link from "next/link";

const guides = [
  {
    slug: "itemized-bills-101",
    title: "Always Request an Itemized Bill",
    description:
      "The single most important first step when fighting any medical bill. Learn why itemized bills matter and what to look for.",
    category: "Getting Started",
    readingTime: "5 min",
  },
  {
    slug: "charity-care",
    title: "Charity Care: The Hospital Discount Nobody Tells You About",
    description:
      "Nonprofit hospitals are legally required to offer financial assistance. Here's how to find out if you qualify and how to apply.",
    category: "Dispute Strategies",
    readingTime: "8 min",
  },
  {
    slug: "no-surprises-act",
    title: "The No Surprises Act: Your Rights When Bills Exceed Estimates",
    description:
      "If your bill is much higher than the estimate you were given, federal law gives you the right to dispute the difference.",
    category: "Dispute Strategies",
    readingTime: "6 min",
  },
  {
    slug: "dealing-with-collectors",
    title: "Dealing with Debt Collectors",
    description:
      "Your rights under the FDCPA, how to demand debt validation, and what happens when the statute of limitations expires.",
    category: "Dispute Strategies",
    readingTime: "7 min",
  },
  {
    slug: "insurance-appeals",
    title: "How to Appeal an Insurance Denial",
    description:
      "Less than 1% of denied claims are appealed, but 44-83% of appeals succeed. Here's how to be one of the people who fights back.",
    category: "Advanced",
    readingTime: "10 min",
  },
  {
    slug: "when-to-get-a-lawyer",
    title: "When to Get a Lawyer",
    description:
      "Not every situation can be handled with a letter. Here's how to know when you need professional legal help and how to find free resources.",
    category: "Advanced",
    readingTime: "5 min",
  },
];

export default function PlaybookPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-normal font-[family-name:var(--font-fraunces)] text-[#1f2a24] mb-4">The Playbook</h1>
        <p className="text-lg font-light text-[#5c6b62]">
          Step-by-step guides that teach you how the medical billing system
          works and how to use your legal rights to fight back.
        </p>
      </div>

      <div className="space-y-4">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/playbook/${guide.slug}/`}
            className="block bg-white border border-[#e2ddd3] rounded-[14px] shadow-[0_1px_4px_rgba(31,42,36,0.04)] p-6 hover:border-[#3868a8] hover:shadow-[0_2px_8px_rgba(31,42,36,0.08)] transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-[#3868a8] bg-[#eef3fa] rounded-md px-2 py-0.5">
                    {guide.category}
                  </span>
                  <span className="text-xs text-[#5c6b62]">
                    {guide.readingTime} read
                  </span>
                </div>
                <h2 className="text-lg font-normal font-[family-name:var(--font-fraunces)] text-[#1f2a24] mb-1">
                  {guide.title}
                </h2>
                <p className="text-sm font-light text-[#5c6b62]">{guide.description}</p>
              </div>
              <span className="text-[#d0cbc2] text-xl shrink-0" aria-hidden="true">&rarr;</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
