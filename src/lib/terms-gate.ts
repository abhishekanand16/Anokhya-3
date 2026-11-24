/**
 * The register checkbox is accepted only as the literal value "on".
 * Missing, empty, "true", or a pre-checked default does not count.
 */
export function termsAccepted(value: unknown): boolean {
  return value === "on";
}
