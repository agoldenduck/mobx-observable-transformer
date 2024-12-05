import { Diagnostic } from "./Diagnostic";
import { Lintable } from "./Lintable";
import { LintState, toLintState } from "./LintState";
import { RuleId } from "./RuleConfig";

export interface Rule<
  R extends RuleId,
  D extends Diagnostic<R> = Diagnostic<R>
> {
  init?(): void;
  check?(lintable: Lintable): D[];
  checkAsync?(lintable: Lintable): LintState<D>[];
  getLintStates(lintable: Lintable): LintState<D>[];
}

export abstract class BaseRule<
  R extends RuleId,
  D extends Diagnostic<R> = Diagnostic<R>
> implements Rule<R, D>
{
  init?(): void;
  check?(lintable: Lintable): D[];
  checkAsync?(lintable: Lintable): LintState<D>[];

  getLintStates(lintable: Lintable): LintState<D>[] {
    const diagnostics = this.check ? this.check(lintable) : [];
    const lintStates = this.checkAsync ? this.checkAsync(lintable) : [];
    return diagnostics
      .map((diagnostic) => toLintState.resolve(diagnostic))
      .concat(lintStates);
  }
}
