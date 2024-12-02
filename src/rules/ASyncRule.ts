import { SyncDiagnostic } from "../types/Diagnostic";
import { Lintable } from "../types/Lintable";
import { Rule } from "../types/Rule";

export type ASyncId = "a_sync_rule";
export type ASyncInfo = {
  Syncable: {};
};
export type ASyncConfig = {
  rule: ASyncId;
  info: ASyncInfo;
};

export class ASyncRule implements Rule<ASyncId> {
  checkFixed(lintable: Lintable) {
    const diagnostic: SyncDiagnostic = {
      type: "sync",
      lintable,
      id: "a_sync_id",
      rule: "a_sync_rule",
      Syncable: {},
    };
    return [diagnostic];
  }
}
