import { AsyncDiagnostic } from "./AsyncDiagnostic";
import { Diagnostic } from "./Diagnostic";
import { Lintable } from "./Lintable";
import { RuleId } from "./RuleConfig";

export interface Rule<
  R extends RuleId,
  D extends Diagnostic<R> = Diagnostic<R>
> {
  init?(): void;
  checkFixed(lintable: Lintable): D[] | AsyncDiagnostic<D>[];
}
