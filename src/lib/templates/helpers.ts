import Handlebars from "handlebars";

export function registerHelpers(hbs: typeof Handlebars) {
  hbs.registerHelper("formatDate", (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  hbs.registerHelper("formatCurrency", (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  });

  hbs.registerHelper("uppercase", (str: string) => str?.toUpperCase());

  hbs.registerHelper(
    "ifEquals",
    function (
      this: unknown,
      a: unknown,
      b: unknown,
      options: Handlebars.HelperOptions
    ) {
      return a === b ? options.fn(this) : options.inverse(this);
    }
  );

  hbs.registerHelper("today", () => {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  hbs.registerHelper("addDays", (dateStr: string, days: number) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  hbs.registerHelper("daysBetween", (dateStr1: string, dateStr2: string) => {
    const d1 = new Date(dateStr1);
    const d2 = new Date(dateStr2);
    const diffMs = Math.abs(d2.getTime() - d1.getTime());
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  });

  hbs.registerHelper("subtractCurrency", (a: number, b: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(a - b);
  });

  hbs.registerHelper(
    "ifGreaterThan",
    function (
      this: unknown,
      a: number,
      b: number,
      options: Handlebars.HelperOptions
    ) {
      return a > b ? options.fn(this) : options.inverse(this);
    }
  );
}
