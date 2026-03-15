export function Footer() {
  return (
    <footer className="bg-[#eee9df] border-t border-[#e2ddd3] mt-auto">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-normal font-[family-name:var(--font-fraunces)] text-[#1f2a24] mb-2">ClaimBack</h3>
            <p className="text-sm font-light text-[#5c6b62]">
              A free, open-source tool that helps Americans exercise their legal
              rights when fighting medical bills.
            </p>
          </div>
          <div>
            <h3 className="font-normal font-[family-name:var(--font-fraunces)] text-[#1f2a24] mb-2">Your Privacy</h3>
            <p className="text-sm font-light text-[#5c6b62]">
              All your information stays in your browser. We never collect, store, or
              transmit your personal data. No accounts. No tracking.
            </p>
          </div>
          <div>
            <h3 className="font-normal font-[family-name:var(--font-fraunces)] text-[#1f2a24] mb-2">Legal</h3>
            <p className="text-sm font-light text-[#5c6b62]">
              This tool provides general information, not legal advice. It does
              not create an attorney-client relationship. For advice about your
              specific situation, consult a licensed attorney.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-[#d0cbc2] text-center text-xs text-[#5c6b62]">
          ClaimBack is open source under the MIT License.
        </div>
      </div>
    </footer>
  );
}
