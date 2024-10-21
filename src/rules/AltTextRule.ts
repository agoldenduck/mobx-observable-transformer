import { Lintable, Rule, SyncDiagnostic } from "./Rule";

export type AltTextId = "alt_text";
export type AltTextInfo = {
  altTextable: {};
};

export class AltTextRule implements Rule<AltTextId> {
  checkFixed(lintable: Lintable) {
    const diagnostic: SyncDiagnostic = {
      type: "sync",
      lintable,
      id: "contrast_awesome",
      rule: "alt_text",
      altTextable: {},
    };
    return [diagnostic];
  }
}
