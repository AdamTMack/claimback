import { describe, it, expect } from "vitest";
import { renderTemplate } from "@/lib/templates/engine";
import { templates } from "@/data/templates/index";

describe("Template rendering", () => {
  describe("itemized-bill-request", () => {
    const template = templates["itemized-bill-request"];

    it("renders with complete context", () => {
      const html = renderTemplate(template, {
        senderName: "Jane Doe",
        senderStreet: "123 Main St",
        senderCity: "Springfield",
        senderState: "IL",
        senderZip: "62701",
        providerName: "Springfield Memorial Hospital",
        providerStreet: "800 E Carpenter",
        providerCity: "Springfield",
        providerState: "IL",
        providerZip: "62769",
        dateOfService: "2025-12-15",
        billAmount: 5000,
        accountNumber: "ACC-12345",
      });

      expect(html).toContain("Jane Doe");
      expect(html).toContain("Springfield Memorial Hospital");
      expect(html).toContain("Request for Itemized Bill");
      expect(html).toContain("$5,000.00");
      // Date formatting is timezone-dependent; verify it matches the helper's output
      const expectedDate = new Date("2025-12-15").toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      expect(html).toContain(expectedDate);
      expect(html).toContain("CPT/HCPCS");
      expect(html).toContain("ACC-12345");
      expect(html).toContain("Certified Mail");
    });

    it("renders without optional fields", () => {
      const html = renderTemplate(template, {
        senderName: "Jane Doe",
        senderStreet: "123 Main St",
        senderCity: "Springfield",
        senderState: "IL",
        senderZip: "62701",
        providerName: "Hospital",
        providerStreet: "1 Hospital Dr",
        providerCity: "Chicago",
        providerState: "IL",
        providerZip: "60601",
        dateOfService: "2025-01-01",
        billAmount: 1000,
      });

      expect(html).toContain("Jane Doe");
      expect(html).not.toContain("Account Number:");
    });
  });

  describe("charity-care-application", () => {
    const template = templates["charity-care-application"];

    it("renders with complete context", () => {
      const html = renderTemplate(template, {
        senderName: "John Smith",
        senderStreet: "456 Oak Ave",
        senderCity: "Chicago",
        senderState: "IL",
        senderZip: "60601",
        providerName: "University Hospital",
        providerStreet: "1 Medical Center",
        providerCity: "Chicago",
        providerState: "IL",
        providerZip: "60602",
        dateOfService: "2025-11-01",
        billAmount: 25000,
        annualIncome: 28000,
        householdSize: 2,
      });

      expect(html).toContain("John Smith");
      expect(html).toContain("Financial Assistance");
      expect(html).toContain("$25,000.00");
      expect(html).toContain("$28,000.00");
      expect(html).toContain("2 person");
      expect(html).toContain("Section 501(r)");
    });
  });

  describe("no-surprises-dispute", () => {
    const template = templates["no-surprises-dispute"];

    it("renders with complete context", () => {
      const html = renderTemplate(template, {
        senderName: "Alice Brown",
        senderStreet: "789 Pine St",
        senderCity: "Austin",
        senderState: "TX",
        senderZip: "73301",
        providerName: "Austin Surgical Center",
        providerStreet: "500 Medical Pkwy",
        providerCity: "Austin",
        providerState: "TX",
        providerZip: "73301",
        dateOfService: "2025-10-15",
        gfeAmount: 3000,
        billAmount: 5500,
      });

      expect(html).toContain("Alice Brown");
      expect(html).toContain("Good Faith Estimate");
      expect(html).toContain("$3,000.00");
      expect(html).toContain("$5,500.00");
      expect(html).toContain("$2,500.00"); // subtracted
      expect(html).toContain("No Surprises Act");
      expect(html).toContain("Public Law 116-260");
      expect(html).toContain("120-day");
    });
  });

  describe("debt-validation-demand", () => {
    const template = templates["debt-validation-demand"];

    it("renders with complete context", () => {
      const html = renderTemplate(template, {
        senderName: "Bob Wilson",
        senderStreet: "321 Elm St",
        senderCity: "Miami",
        senderState: "FL",
        senderZip: "33101",
        collectorName: "ABC Collections",
        collectorStreet: "999 Debt Blvd",
        collectorCity: "Tampa",
        collectorState: "FL",
        collectorZip: "33601",
        amountClaimed: 8500,
        referenceNumber: "REF-99999",
        originalCreditor: "Miami General Hospital",
      });

      expect(html).toContain("Bob Wilson");
      expect(html).toContain("ABC Collections");
      expect(html).toContain("Demand for Debt Validation");
      expect(html).toContain("$8,500.00");
      expect(html).toContain("REF-99999");
      expect(html).toContain("Miami General Hospital");
      expect(html).toContain("15 USC § 1692g");
      expect(html).toContain("FDCPA");
    });
  });

  describe("all templates", () => {
    it("every template includes the ClaimBack disclaimer", () => {
      for (const [name, template] of Object.entries(templates)) {
        // We need minimal context to avoid Handlebars errors
        const minimalContext = {
          senderName: "Test",
          senderStreet: "1 St",
          senderCity: "City",
          senderState: "NY",
          senderZip: "10001",
          providerName: "Hospital",
          providerStreet: "1 Dr",
          providerCity: "City",
          providerState: "NY",
          providerZip: "10001",
          collectorName: "Collector",
          collectorStreet: "1 St",
          collectorCity: "City",
          collectorState: "NY",
          collectorZip: "10001",
          dateOfService: "2025-01-01",
          billAmount: 1000,
          gfeAmount: 500,
          amountClaimed: 1000,
          annualIncome: 20000,
          householdSize: 1,
        };

        const html = renderTemplate(template, minimalContext);
        expect(
          html.includes("ClaimBack"),
          `Template "${name}" is missing ClaimBack disclaimer`
        ).toBe(true);
        expect(
          html.includes("not legal advice") || html.includes("does not constitute legal advice"),
          `Template "${name}" is missing legal disclaimer`
        ).toBe(true);
      }
    });
  });
});
