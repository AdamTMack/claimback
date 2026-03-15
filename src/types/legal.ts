/** A federal law citation that can be used in letter templates */
export interface FederalCitation {
  key: string;
  statute: string;
  publicLaw?: string;
  uscode: string;
  cfr?: string;
  shortName: string;
  effectiveDate: string;
  summary: string;
  keyProvisions: string[];
  enforcementAgency: string;
  complaintUrl?: string;
  lastVerified: string;
}

/** State-specific legal data */
export interface StateLegalData {
  stateCode: string;
  stateName: string;
  citations: StateCitation[];
  statuteOfLimitations: {
    years: number;
    statute: string;
  };
  charityCareLaw?: {
    statute: string;
    summary: string;
    incomeThreshold?: string;
  };
  insuranceCommissioner: {
    name: string;
    complaintUrl: string;
  };
  attorneyGeneral: {
    complaintUrl: string;
  };
  lastVerified: string;
}

export interface StateCitation {
  key: string;
  statute: string;
  summary: string;
  additionalProtections?: string;
  filingAgency?: string;
  complaintUrl?: string;
  lastVerified: string;
}

/** Federal Poverty Level thresholds, updated annually */
export interface FPLTable {
  year: number;
  effectiveDate: string;
  thresholds: {
    householdSize: number;
    annualIncome: number;
  }[];
  source: string;
  lastVerified: string;
}
