export interface GuideSection {
  heading: string;
  content: string;
  callout?: {
    type: "tip" | "warning" | "deadline" | "legal-right";
    text: string;
  };
}

export interface Guide {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  readingTime: string;
  relatedWorkflow?: string;
  keyTakeaways: string[];
  sections: GuideSection[];
}

export const guides: Record<string, Guide> = {
  "itemized-bills-101": {
    slug: "itemized-bills-101",
    title: "Always Request an Itemized Bill",
    subtitle:
      "The single most important first step when fighting any medical bill",
    category: "Getting Started",
    readingTime: "5 min",
    relatedWorkflow: "itemized-bill",
    keyTakeaways: [
      "49-80% of medical bills contain errors that are only visible on an itemized statement",
      "You have the legal right to an itemized bill, and providers must give you one when you ask",
      "Many bills drop in price just from requesting an itemized bill, because providers know errors will be found",
      "Always request one before paying, negotiating, or disputing",
    ],
    sections: [
      {
        heading: "What is an itemized bill?",
        content:
          "The bill you typically receive from a hospital or doctor is a summary bill. It shows a total amount owed but not the individual charges. An itemized bill breaks down every single service, procedure, medication, and supply with its billing code (CPT or HCPCS code) and price.\n\nThink of it as the difference between a credit card statement that says 'GROCERY STORE $200' versus a receipt that lists every item you bought. You can't check for errors on a summary.",
      },
      {
        heading: "Why itemized bills matter",
        content:
          "Studies consistently find that 49-80% of medical bills contain errors. The most common errors include:\n\n• Duplicate charges (the same service billed twice)\n• Upcoding (billing for a more expensive service than what was actually provided)\n• Unbundling (billing separately for services that should be billed together at a lower rate)\n• Charges for services not received, like medications you weren't given or procedures that didn't happen\n• Incorrect quantities (being charged for 3 hours of operating room time when the surgery took 45 minutes)\n• Wrong patient charges (services that were provided to someone else)\n\nThe average hospital bill over $10,000 contains approximately $1,300 in overcharges. You can only find these errors on an itemized bill.",
        callout: {
          type: "tip",
          text: "Even if your bill seems reasonable, request an itemized bill anyway. You might find charges you didn't know about.",
        },
      },
      {
        heading: "How to read your itemized bill",
        content:
          "Once you receive your itemized bill, look for these columns:\n\n• Date of Service: when each service was provided\n• Description: what the service was\n• CPT/HCPCS Code: the standardized billing code (you can look these up online)\n• Quantity: how many units were billed\n• Unit Price: the price per unit\n• Total: quantity times unit price\n\nCompare each line item to your memory of what happened during your visit. Did you actually receive each service listed? Do the quantities seem right? Were you really in the operating room for that long?",
      },
      {
        heading: "Common red flags to look for",
        content:
          "When reviewing your itemized bill, watch for:\n\n• Charges for a private room when you were in a shared room\n• Operating room time that seems too long\n• Lab tests you don't remember having ordered\n• Medications you weren't given or that were available over-the-counter\n• Equipment charges (like crutches or braces) for items you never received\n• \"Facility fees\" that seem disproportionate to the service\n• Any charge that appears twice on separate lines",
        callout: {
          type: "warning",
          text: "If you find errors, do not pay the bill until they are corrected. Paying can be interpreted as accepting the charges.",
        },
      },
      {
        heading: "How to request an itemized bill",
        content:
          "You can request an itemized bill by:\n\n1. Calling the billing department and asking for a complete itemized statement with CPT codes\n2. Sending a written request via certified mail (our Bill Fighter tool generates this letter for you)\n3. Requesting through the patient portal if the provider has one\n\nThe written request via certified mail is best because it creates a legal record. Most providers respond within 2-4 weeks. If they don't respond within 30 days, you have grounds to file a complaint with your state Attorney General.",
      },
    ],
  },

  "charity-care": {
    slug: "charity-care",
    title: "Charity Care: The Hospital Discount Nobody Tells You About",
    subtitle:
      "Nonprofit hospitals are legally required to offer financial assistance. Here is how to get it.",
    category: "Dispute Strategies",
    readingTime: "8 min",
    relatedWorkflow: "charity-care",
    keyTakeaways: [
      "About 57% of US hospitals are nonprofit and legally required to offer financial assistance",
      "Many hospitals offer free care up to 200% FPL and reduced-cost care up to 400% FPL",
      "Hospitals cannot send you to collections without first screening you for financial assistance",
      "You can apply even after a bill has been sent to collections",
      "There is no downside to applying. The worst they can say is no.",
    ],
    sections: [
      {
        heading: "What is charity care?",
        content:
          'Charity care, more formally called "financial assistance," is a legal requirement for nonprofit hospitals. Under Section 501(r) of the Internal Revenue Code, tax-exempt hospitals must maintain a Financial Assistance Policy (FAP) and must screen patients for eligibility before taking aggressive collection actions.\n\nThis isn\'t a donation or an act of generosity. It\'s a condition of their tax-exempt status. In exchange for not paying taxes (which saves large health systems hundreds of millions of dollars per year), they are required to provide financial assistance to patients who qualify.',
        callout: {
          type: "legal-right",
          text: "Under 26 USC § 501(r), nonprofit hospitals MUST have a written Financial Assistance Policy, publicize it, and screen patients before extraordinary collection actions.",
        },
      },
      {
        heading: "Do you qualify?",
        content:
          "Eligibility is based on your income relative to the Federal Poverty Level (FPL). While each hospital sets its own thresholds, here are common ranges:\n\n• Free care: Household income at or below 200% FPL\n• Significant discount (50-75% off): 200-300% FPL\n• Moderate discount (25-50% off): 300-400% FPL\n\nFor reference, 200% FPL in 2025 is approximately $31,300 for a single person, $42,300 for a family of two, and $64,300 for a family of four.\n\nMany hospitals also consider extenuating circumstances: recent job loss, high medical expenses, disability, or other financial hardship. Even if your income is above their standard threshold, it's worth applying.",
      },
      {
        heading: "How to check if your hospital is nonprofit",
        content:
          "Most hospitals are nonprofit, but here's how to verify:\n\n1. Search the IRS Tax Exempt Organization database at apps.irs.gov/app/eos\n2. Look at the hospital's website. Nonprofit hospitals usually mention their status.\n3. Call the billing department and ask: 'Is this hospital a 501(c)(3) organization?'\n4. Check your state's hospital association website\n\nMajor nonprofit health systems include: Ascension, CommonSpirit Health, Providence, Trinity Health, Advocate Health, and most university-affiliated hospitals.",
      },
      {
        heading: "How to apply",
        content:
          "1. Send a formal request letter via certified mail (our Bill Fighter tool generates this)\n2. Call the billing department and ask for their Financial Assistance Application form\n3. Gather supporting documents: recent tax return, 2-3 months of pay stubs, bank statements\n4. Complete their application and submit it with your documents\n5. Request that collection activity be paused while your application is under review\n\nThe formal letter is important because it creates a legal record of your request and references the specific legal obligations under 501(r). But you should also complete the hospital's own application form if they have one.",
        callout: {
          type: "tip",
          text: "Apply as soon as possible. Many hospitals have a lookback period and may apply financial assistance retroactively to bills from the past 240 days or more.",
        },
      },
      {
        heading: "What if you are denied?",
        content:
          "If your application is denied:\n\n1. Ask for the reason in writing\n2. Appeal the decision. Many hospitals have an appeals process.\n3. Provide additional documentation of hardship\n4. Contact your state Attorney General if you believe the hospital is not complying with 501(r)\n5. File a complaint with the IRS if the hospital is not maintaining a proper FAP\n\nAlso consider requesting an itemized bill. If there are billing errors, correcting them may bring the bill down enough to change your eligibility.",
        callout: {
          type: "warning",
          text: "If a nonprofit hospital sends you to collections without first screening you for financial assistance, they may be violating federal law. This is grounds for a complaint to the IRS.",
        },
      },
    ],
  },

  "no-surprises-act": {
    slug: "no-surprises-act",
    title: "The No Surprises Act: Your Rights When Bills Exceed Estimates",
    subtitle:
      "Federal law protects you when your actual bill is much higher than what you were told",
    category: "Dispute Strategies",
    readingTime: "6 min",
    relatedWorkflow: "no-surprises-act",
    keyTakeaways: [
      "If you are uninsured or self-pay, providers must give you a Good Faith Estimate before scheduled services",
      "If your bill exceeds the GFE by $400 or more, you can initiate a formal dispute",
      "You have 120 days from receiving the bill to file a dispute",
      "The provider must stop collection while the dispute is pending",
      "An independent entity makes a binding determination on what you owe",
    ],
    sections: [
      {
        heading: "What is the No Surprises Act?",
        content:
          "The No Surprises Act, which took full effect in January 2022, includes protections specifically for uninsured and self-pay patients. Before any scheduled service, providers must give you a Good Faith Estimate (GFE) of what the service will cost.\n\nIf the actual bill ends up being significantly more than the estimate (specifically $400 or more over), you have the right to dispute the difference through an independent process. This prevents providers from lowballing estimates to get you in the door and then hitting you with a much larger bill.",
        callout: {
          type: "legal-right",
          text: "Under Public Law 116-260 and 45 CFR Part 149, providers who fail to provide a GFE or who exceed it by $400+ face enforceable patient dispute rights.",
        },
      },
      {
        heading: "Who qualifies?",
        content:
          "The GFE dispute process applies to:\n\n• Uninsured patients (people without any health insurance)\n• Self-pay patients (people who have insurance but chose not to use it for a particular service)\n\nIf you used your insurance for the service, different protections apply (such as balance billing protections for out-of-network emergency care). The GFE dispute process is specifically for people paying out of pocket.",
      },
      {
        heading: "The $400 threshold",
        content:
          "The dispute process is triggered when the actual bill exceeds the Good Faith Estimate by $400 or more. This is calculated on the total bill, not individual line items.\n\nFor example:\n• GFE of $2,000, actual bill of $2,350 → Difference is $350 → Below threshold\n• GFE of $2,000, actual bill of $2,500 → Difference is $500 → Above threshold, eligible to dispute\n\nIf you are below the $400 threshold, you can still negotiate with the provider or request an itemized bill to check for errors.",
      },
      {
        heading: "The 120-day deadline",
        content:
          "You must initiate the dispute within 120 calendar days of receiving the bill. This is measured from the date you received the bill (not the date of service).\n\nDo not wait. Send the dispute letter as soon as you realize the bill exceeds your GFE by $400 or more. The 120-day window can go by quickly, especially if you are dealing with other medical issues.",
        callout: {
          type: "deadline",
          text: "120 calendar days from receiving the bill. Mark this date on your calendar and act well before it.",
        },
      },
      {
        heading: "How the dispute process works",
        content:
          "1. Send a dispute letter to the provider (our Bill Fighter tool generates this)\n2. Also file through CMS at cms.gov/medical-bill-rights or call 1-800-985-3059\n3. Pay the $25 administrative fee to initiate the Patient-Provider Dispute Resolution process\n4. The provider must stop all collection activity while the dispute is pending\n5. An independent dispute resolution entity reviews the case\n6. They compare your GFE to the actual charges and make a binding determination\n7. The determination is final. Both you and the provider must accept it.\n\nThe process is designed to be accessible to patients without requiring an attorney.",
      },
    ],
  },

  "dealing-with-collectors": {
    slug: "dealing-with-collectors",
    title: "Dealing with Debt Collectors",
    subtitle:
      "Your rights under the FDCPA and how to use them to protect yourself",
    category: "Dispute Strategies",
    readingTime: "7 min",
    relatedWorkflow: "debt-validation",
    keyTakeaways: [
      "You have 30 days from receiving the collector's written notice to demand debt validation. Use it.",
      "During validation, the collector must stop all collection activity",
      "NEVER acknowledge the debt, make any payment, or discuss it on the phone before sending your letter",
      "You can sue for up to $1,000 in statutory damages per lawsuit, plus actual damages and attorney's fees",
      "Many FDCPA attorneys work on contingency, so the collector pays the fees if you win",
    ],
    sections: [
      {
        heading: "What is the FDCPA?",
        content:
          "The Fair Debt Collection Practices Act (15 USC § 1692) is a federal law that protects consumers from abusive, unfair, and deceptive debt collection practices. It applies to third-party debt collectors, meaning companies that buy debts or are hired to collect on behalf of the original creditor.\n\nThe FDCPA gives you powerful tools, including the right to demand that a collector prove the debt is valid before they can continue collecting.",
        callout: {
          type: "legal-right",
          text: "The FDCPA only applies to third-party collectors, not the original provider. If the hospital itself is billing you, different rules apply.",
        },
      },
      {
        heading: "The 30-day validation window",
        content:
          "Within 5 days of first contacting you, a debt collector must send you a written notice with the amount of the debt, the name of the creditor, and your right to dispute.\n\nYou then have 30 days to send a written dispute (debt validation demand). If you do:\n\n• The collector must stop ALL collection activity\n• They cannot report the debt to credit bureaus\n• They must provide verification of the debt before contacting you again\n\nIf you miss the 30-day window, you can still demand validation, but the collector is not required to stop collecting while they verify. That said, many collectors stop anyway because they know the risks of continuing without proper documentation.",
        callout: {
          type: "deadline",
          text: "The 30-day clock starts from when you RECEIVE the collector's written notice, not from their first phone call. First contact triggers a 5-day window for them to send the notice.",
        },
      },
      {
        heading: "What NOT to do",
        content:
          "When a debt collector contacts you, there are critical things you must NOT do:\n\n• DO NOT acknowledge the debt. Do not say 'yes, I owe that' or anything similar.\n• DO NOT make any payment, no matter how small. Even a $1 payment can restart the statute of limitations.\n• DO NOT discuss the debt on the phone. Collectors are trained to get you to say things that hurt your position.\n• DO NOT give them any financial information (bank account numbers, employer info, etc.)\n• DO NOT agree to a payment plan before sending a validation demand\n\nThe correct response is: 'I am not discussing this on the phone. Please send all communications in writing.' Then send the validation demand letter immediately.",
        callout: {
          type: "warning",
          text: "A single payment, even $5, can restart the statute of limitations on a debt that was otherwise too old to collect. Never pay anything until the debt is validated.",
        },
      },
      {
        heading: "What collectors cannot do",
        content:
          "Under the FDCPA, debt collectors are prohibited from:\n\n• Calling before 8am or after 9pm in your time zone\n• Using threats, obscene language, or harassment\n• Calling you at work if you tell them not to\n• Discussing your debt with anyone other than you, your spouse, or your attorney\n• Making false or misleading statements about the debt\n• Adding unauthorized fees or interest\n• Threatening legal action they cannot or do not intend to take\n• Continuing to contact you after you send a cease-and-desist letter (with limited exceptions)\n\nEvery violation is actionable. You can sue for up to $1,000 in statutory damages per lawsuit, plus actual damages and attorney's fees.",
      },
      {
        heading: "The statute of limitations",
        content:
          "Every state has a statute of limitations on debt, a deadline after which the debt can no longer be collected through a lawsuit. For medical debt, this ranges from 3 to 10 years depending on your state.\n\nOnce the statute of limitations has expired:\n\n• The collector cannot sue you for the debt\n• If they threaten to sue, that itself is an FDCPA violation\n• The debt may still appear on your credit report for up to 7 years, but it should be marked as time-barred\n\nIMPORTANT: Making a payment or acknowledging the debt in writing can restart the statute of limitations in many states. This is why it is critical not to make any payment or acknowledgment before understanding your rights.",
      },
    ],
  },

  "insurance-appeals": {
    slug: "insurance-appeals",
    title: "How to Appeal an Insurance Denial",
    subtitle:
      "Less than 1% of denied claims are appealed, but 44-83% of appeals succeed",
    category: "Advanced",
    readingTime: "10 min",
    keyTakeaways: [
      "Less than 1% of denied claims are appealed, but success rates are high (44-83%)",
      "You have the right to at least one internal appeal and one external review",
      "The ACA requires insurers to provide specific reasons for denials",
      "External reviews are conducted by independent physicians, not the insurer",
      "Keep records of everything and always meet deadlines",
    ],
    sections: [
      {
        heading: "Why you should almost always appeal",
        content:
          "Insurance companies deny claims knowing that almost nobody appeals. Less than 1% of denied claims are ever challenged. But when patients do appeal, the success rate is striking: studies show 44-83% of appeals result in the denial being overturned.\n\nThis means the denial is often not the final answer. It's a first answer designed to save the insurer money, and it works because most people accept it.\n\nAppealing takes effort, but the financial stakes are usually significant enough to make it worthwhile.",
        callout: {
          type: "tip",
          text: "Think of a denial as a first offer in a negotiation, not a final decision. The appeals process exists specifically because denials are often wrong.",
        },
      },
      {
        heading: "Understanding your denial",
        content:
          "When your claim is denied, the insurer must send you an Explanation of Benefits (EOB) or denial letter that includes:\n\n• The specific reason for the denial\n• The plan provision or policy that supports the denial\n• Instructions for how to appeal\n• Deadlines for filing an appeal\n• Your right to request the claim file and any relevant documents\n\nRead the denial reason carefully. Common reasons include: service not medically necessary, out-of-network provider, prior authorization not obtained, service not covered, or coding errors. Each reason requires a different appeal strategy.",
      },
      {
        heading: "Internal appeals",
        content:
          "Your first step is an internal appeal, a request for the insurer to reconsider their decision. Under the ACA, you have the right to at least one level of internal appeal.\n\nA strong appeal letter should include:\n\n1. Your policy number and the claim being appealed\n2. The specific denial reason and why you disagree\n3. A letter from your doctor explaining why the service was medically necessary\n4. Any relevant medical records or test results\n5. Published medical guidelines supporting the treatment\n6. Any prior authorization documentation if applicable\n\nThe insurer typically has 30 days (for non-urgent claims) or 72 hours (for urgent claims) to decide your internal appeal.",
      },
      {
        heading: "External reviews",
        content:
          "If your internal appeal is denied, you have the right to an external review. This is the most powerful tool in the appeals process because:\n\n• The review is conducted by an independent physician or panel, not the insurance company\n• The reviewer must be an expert in the relevant medical specialty\n• The insurer is bound by the external reviewer's decision\n• External reviews are generally free to you\n\nThe external review process is established under the ACA. Your insurer must provide instructions for requesting one. State insurance departments can also help you initiate an external review.\n\nExternal review success rates are high because independent physicians often disagree with insurance company denials, especially for medically necessary services.",
        callout: {
          type: "legal-right",
          text: "Under the ACA, external reviews are conducted by independent entities, and their decisions are binding on the insurer.",
        },
      },
      {
        heading: "Tips for a successful appeal",
        content:
          "1. Meet every deadline. Missing deadlines can forfeit your appeal rights.\n2. Get your doctor involved. A letter of medical necessity from your treating physician is the strongest evidence.\n3. Request the full claim file. You have the right to see everything the insurer considered.\n4. Be specific. Address the exact reason for denial, not general arguments.\n5. Include medical literature (published guidelines from medical societies supporting the treatment)\n6. Keep copies of everything you send and receive\n7. Send appeals via certified mail so you have proof of delivery\n8. If your internal appeal is denied, always file for external review. You have nothing to lose.",
      },
    ],
  },

  "when-to-get-a-lawyer": {
    slug: "when-to-get-a-lawyer",
    title: "When to Get a Lawyer",
    subtitle:
      "Not every situation can be handled with a letter. Here is how to know when you need professional help.",
    category: "Advanced",
    readingTime: "5 min",
    keyTakeaways: [
      "If a debt collector has filed a lawsuit, you need an attorney immediately",
      "Many consumer rights attorneys work on contingency, so the collector pays if you win",
      "Legal aid organizations provide free help for qualifying individuals",
      "FDCPA cases often include attorney's fees, so lawyers are incentivized to take them",
      "Filing complaints with government agencies is free and can be very effective",
    ],
    sections: [
      {
        heading: "Signs you need legal help",
        content:
          "Consider getting an attorney if any of these apply:\n\n• A debt collector has filed a lawsuit against you. This is urgent; you have a short deadline to respond.\n• Your wages are being garnished or your bank account has been frozen\n• A hospital has placed a lien on your home\n• You believe a provider or collector has committed fraud\n• Your bill involves complex insurance coverage disputes\n• You've been denied financial assistance at a nonprofit hospital and believe the denial violates 501(r)\n• A debt collector continues to violate the FDCPA after receiving your validation demand\n• The amount at stake is very large (over $10,000) and you're unsure how to proceed",
        callout: {
          type: "warning",
          text: "If you've been served with a lawsuit, do NOT ignore it. You typically have 20-30 days to respond. Missing this deadline can result in wage garnishment or bank account seizure.",
        },
      },
      {
        heading: "Finding free legal help",
        content:
          "Several resources provide free legal assistance:\n\n• LawHelp.org (directory of free legal aid by state)\n• Call 211 (connects you to local resources including legal aid)\n• Legal Aid Society (most states have one; they handle debt cases)\n• Law school clinics (many law schools have free clinics for consumer issues)\n• State bar associations (many have lawyer referral programs with reduced fees)\n\nLegal aid organizations prioritize cases based on urgency and income. If you're facing a lawsuit or garnishment, mention this when you call. It may move your case up in priority.",
      },
      {
        heading: "Consumer rights attorneys",
        content:
          "For FDCPA violations, many consumer rights attorneys work on a contingency basis, meaning they only get paid if you win. This is possible because the FDCPA allows courts to award attorney's fees to the consumer, meaning the debt collector pays the lawyer's fees.\n\nTo find a consumer rights attorney:\n\n• National Association of Consumer Advocates: consumeradvocates.org\n• Your state bar association's lawyer referral service\n• Search for 'FDCPA attorney' or 'consumer rights attorney' in your area\n\nWhen contacting an attorney, have your documentation ready: all letters from the collector, the original bill, your validation demand letter and certified mail receipt, and a log of any contacts the collector made.",
      },
      {
        heading: "Government agencies that can help",
        content:
          "Filing complaints with government agencies is free and can be effective:\n\n• Consumer Financial Protection Bureau (CFPB) at consumerfinance.gov/complaint, for debt collection violations\n• State Attorney General, for consumer protection complaints including medical billing issues\n• State Insurance Commissioner, for insurance-related billing disputes\n• CMS (Centers for Medicare & Medicaid Services) at cms.gov/nosurprises, for No Surprises Act violations\n• IRS, for nonprofit hospitals that violate 501(r) financial assistance requirements\n• Office for Civil Rights (HHS), for HIPAA violations related to billing records\n\nGovernment complaints create a record and can trigger investigations. Even if they don't resolve your individual case immediately, they put pressure on the offending organization and protect future patients.",
      },
      {
        heading: "When DIY is enough",
        content:
          "Most situations described in our Bill Fighter tool can be handled without an attorney:\n\n• Requesting an itemized bill\n• Applying for financial assistance / charity care\n• Filing a No Surprises Act dispute (the process is designed for patients)\n• Sending a debt validation demand\n• Filing complaints with government agencies\n\nThe letters we generate are modeled on templates used by patient advocates and consumer rights attorneys. They cite the relevant statutes, make clear demands, and create a legal record. For most people, these tools are sufficient.\n\nThe general rule: if it's a matter of exercising a clear legal right (requesting documents, demanding validation, filing a dispute), DIY works. If it involves complex legal strategy, active litigation, or your adversary has an attorney, get one yourself.",
      },
    ],
  },
};
