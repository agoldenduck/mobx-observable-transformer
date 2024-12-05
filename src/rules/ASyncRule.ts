import { Diagnostic } from "../types/Diagnostic";
import { Lintable } from "../types/Lintable";
import { BaseRule } from "../types/Rule";

export type ASyncId = "a_sync_rule";
export type ASyncInfo = {
  Syncable: {};
};
export type ASyncConfig = {
  rule: ASyncId;
  info: ASyncInfo;
};

export class ASyncRule extends BaseRule<ASyncId> {
  check(lintable: Lintable): Diagnostic<ASyncId>[] {
    if (lintable.type === "page") {
      return [];
    }

    if (lintable.element.data.includes("2")) {
      const diagnostic: Diagnostic<ASyncId> = {
        lintable,
        id: "a_sync_id",
        rule: "a_sync_rule",
        Syncable: {},
      };
      return [diagnostic];
    }
    return [];
  }
}
