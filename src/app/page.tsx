import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      {/* Hero */}
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-normal font-[family-name:var(--font-fraunces)] text-[#1f2a24] mb-6 leading-[1.25]">
          Fight your medical bill.
          <br />
          <span className="text-[#3868a8]">Know your rights.</span>
        </h1>
        <p className="text-xl font-light text-[#5c6b62] max-w-2xl mx-auto mb-8 leading-[1.7]">
          A free tool that generates dispute letters and teaches you the legal
          rights that hospitals and insurers don&apos;t want you to know about.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/bill-fighter/"
            className="px-9 py-4 bg-[#3868a8] text-white rounded-[10px] text-lg font-medium hover:bg-[#2d5590] shadow-[0_2px_6px_rgba(56,104,168,0.2)] transition-all"
          >
            Fight My Bill
          </Link>
          <Link
            href="/playbook/"
            className="px-9 py-4 bg-white text-[#1f2a24] rounded-[10px] text-lg font-medium border border-[#d0cbc2] hover:border-[#3868a8] hover:bg-[#f8f6f1] transition-all"
          >
            Learn My Rights
          </Link>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-20">
        <div className="bg-white border border-[#e2ddd3] rounded-[14px] p-7 text-center shadow-[0_1px_4px_rgba(31,42,36,0.04)]">
          <div className="text-3xl font-normal font-[family-name:var(--font-fraunces)] text-[#3868a8] mb-2">80%</div>
          <p className="font-light text-[#5c6b62]">
            of medical bills contain errors that you can only find on an
            itemized statement
          </p>
        </div>
        <div className="bg-white border border-[#e2ddd3] rounded-[14px] p-7 text-center shadow-[0_1px_4px_rgba(31,42,36,0.04)]">
          <div className="text-3xl font-normal font-[family-name:var(--font-fraunces)] text-[#5b8a6e] mb-2">44-83%</div>
          <p className="font-light text-[#5c6b62]">
            of denied insurance claims are overturned on appeal, but less
            than 1% of people ever appeal
          </p>
        </div>
        <div className="bg-white border border-[#e2ddd3] rounded-[14px] p-7 text-center shadow-[0_1px_4px_rgba(31,42,36,0.04)]">
          <div className="text-3xl font-normal font-[family-name:var(--font-fraunces)] text-[#876025] mb-2">$0</div>
          <p className="font-light text-[#5c6b62]">
            what many people owe after applying for financial assistance they
            didn&apos;t know existed
          </p>
        </div>
      </div>

      {/* What this tool does */}
      <div className="mb-20">
        <h2 className="text-2xl font-normal font-[family-name:var(--font-fraunces)] text-[#1f2a24] mb-8 text-center">
          What ClaimBack does
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          <div className="bg-white border border-[#e2ddd3] rounded-[14px] p-7 shadow-[0_1px_4px_rgba(31,42,36,0.04)]">
            <h3 className="text-lg font-normal font-[family-name:var(--font-fraunces)] text-[#1f2a24] mb-2">
              Bill Fighter
            </h3>
            <p className="font-light text-[#5c6b62] mb-4">
              Answer a few questions about your situation. We generate a
              ready-to-send letter citing the specific laws that protect you.
            </p>
            <ul className="space-y-2 text-sm font-light text-[#5c6b62]">
              <li className="flex gap-2">
                <span className="text-[#5b8a6e] font-bold" aria-hidden="true">&#10003;</span>
                Itemized bill requests
              </li>
              <li className="flex gap-2">
                <span className="text-[#5b8a6e] font-bold" aria-hidden="true">&#10003;</span>
                Financial assistance applications
              </li>
              <li className="flex gap-2">
                <span className="text-[#5b8a6e] font-bold" aria-hidden="true">&#10003;</span>
                No Surprises Act disputes
              </li>
              <li className="flex gap-2">
                <span className="text-[#5b8a6e] font-bold" aria-hidden="true">&#10003;</span>
                Debt validation demands
              </li>
            </ul>
          </div>
          <div className="bg-white border border-[#e2ddd3] rounded-[14px] p-7 shadow-[0_1px_4px_rgba(31,42,36,0.04)]">
            <h3 className="text-lg font-normal font-[family-name:var(--font-fraunces)] text-[#1f2a24] mb-2">
              The Playbook
            </h3>
            <p className="font-light text-[#5c6b62] mb-4">
              Step-by-step guides that teach you how the system works and how
              to use it to your advantage.
            </p>
            <ul className="space-y-2 text-sm font-light text-[#5c6b62]">
              <li className="flex gap-2">
                <span className="text-[#5b8a6e] font-bold" aria-hidden="true">&#10003;</span>
                Your legal rights, explained in plain English
              </li>
              <li className="flex gap-2">
                <span className="text-[#5b8a6e] font-bold" aria-hidden="true">&#10003;</span>
                How to read and challenge a medical bill
              </li>
              <li className="flex gap-2">
                <span className="text-[#5b8a6e] font-bold" aria-hidden="true">&#10003;</span>
                When to negotiate vs. dispute vs. get a lawyer
              </li>
              <li className="flex gap-2">
                <span className="text-[#5b8a6e] font-bold" aria-hidden="true">&#10003;</span>
                State-specific protections and resources
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Privacy promise */}
      <div className="bg-[#eee9df] border border-[#e2ddd3] rounded-[14px] p-8 text-center">
        <h2 className="text-xl font-normal font-[family-name:var(--font-fraunces)] text-[#1f2a24] mb-3">
          Your data never leaves your browser
        </h2>
        <p className="font-light text-[#5c6b62] max-w-xl mx-auto leading-[1.7]">
          ClaimBack is a static website. There is no server, no database, no
          account to create. Everything you enter stays on your device. We never
          see, collect, or transmit your personal information. The entire app
          works offline.
        </p>
      </div>
    </div>
  );
}
