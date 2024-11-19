import { SyncDiagnostic } from "../types/Diagnostic";
import { Lintable } from "../types/Lintable";
import { Rule } from "../types/Rule";

export type AltTextId = "alt_text";
export type AltTextInfo = {
  altTextable: {};
};
export type AltTextConfig = {
  rule: AltTextId;
  info: AltTextInfo;
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
