import Handlebars from "handlebars";
import { registerHelpers } from "./helpers";

let initialized = false;

function ensureInitialized() {
  if (initialized) return;
  registerHelpers(Handlebars);
  initialized = true;
}

/**
 * Render a letter template with the given context.
 * Returns HTML string suitable for display and printing.
 */
export function renderTemplate(
  templateSource: string,
  context: Record<string, unknown>
): string {
  ensureInitialized();

  const compiled = Handlebars.compile(templateSource);
  const rendered = compiled(context);

  // Wrap in a print-friendly container with proper formatting
  return rendered;
}

/**
 * Register a partial template (reusable snippet like sender/recipient blocks)
 */
export function registerPartial(name: string, source: string): void {
  ensureInitialized();
  Handlebars.registerPartial(name, source);
}
