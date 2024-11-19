import { Diagnostic } from "./Diagnostic";
import { Lintable } from "./Lintable";
import { RuleId, AsyncRuleId } from "./RuleConfig";

export interface Rule<R extends RuleId> {
  init?(): void;
  checkFixed(lintable: Lintable): Diagnostic<R>[];
}

export interface AsyncRule<R extends AsyncRuleId> extends Rule<R> {}
