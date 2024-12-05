import { Lintable } from "./Lintable";
import { RuleId, RuleConfig } from "./RuleConfig";

export type Diagnostic<
  R extends RuleId = RuleId,
  C extends RuleConfig = RuleConfig
> = {
  id: string;
  lintable: Lintable;
  fix?(): void;
  rule: R;
} & C["info"];
