"use client";

import { useState } from "react";

export function DisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-[#faf3e8] border-b border-[#e2ddd3] px-6 py-2 text-sm text-[#7a5c28]">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <p>
          <strong>Important:</strong> This tool provides general information
          about your legal rights. It is not legal advice and does not create an
          attorney-client relationship.
        </p>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 text-[#876025] hover:text-[#7a5c28] font-medium"
          aria-label="Dismiss disclaimer"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
