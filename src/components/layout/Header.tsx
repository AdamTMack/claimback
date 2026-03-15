import Link from "next/link";

export function Header() {
  return (
    <header className="bg-white border-b border-[#e2ddd3]">
      <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-normal font-[family-name:var(--font-fraunces)] text-[#1f2a24]">ClaimBack</span>
        </Link>
        <nav className="flex gap-6 text-sm font-medium" aria-label="Main navigation">
          <Link
            href="/bill-fighter/"
            className="text-[#5c6b62] hover:text-[#1f2a24] transition-colors"
          >
            Fight My Bill
          </Link>
          <Link
            href="/playbook/"
            className="text-[#5c6b62] hover:text-[#1f2a24] transition-colors"
          >
            Playbook
          </Link>
          <Link
            href="/about/"
            className="text-[#5c6b62] hover:text-[#1f2a24] transition-colors"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
