/** Address structure used for sender and recipient */
export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

/** Data passed into a Handlebars template to generate a letter */
export interface LetterContext {
  // Sender info
  sender: {
    fullName: string;
    address: Address;
    phone?: string;
    email?: string;
  };

  // Recipient info
  recipient: {
    name: string;
    department?: string;
    address: Address;
  };

  // Letter metadata
  date: string;
  accountNumber?: string;
  dateOfService?: string;
  amountBilled?: string;
  amountDisputed?: string;

  // Legal citations (injected by engine)
  citations: LegalCitationRef[];

  // State-specific additions
  stateSpecific?: {
    statute?: string;
    additionalRights?: string;
    filingInfo?: string;
  };

  // Computed fields
  deadlineDate?: string;
  sendMethod: "certified_mail" | "email" | "both";

  // Workflow-specific data (varies per template)
  [key: string]: unknown;
}

export interface LegalCitationRef {
  key: string;
  statute: string;
  shortName: string;
  relevantText: string;
}
