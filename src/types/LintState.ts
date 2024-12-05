import { action, extendObservable } from "mobx";
import { Diagnostic } from "./Diagnostic";
import { Lintable } from "./Lintable";

export enum LINT_STATE {
  PENDING = "pending",
  HAS_VIOLATION = "has_violation",
  RESOLVED = "rejected",
}

export type LintPending = Diagnostic & {
  readonly value: Diagnostic;
  readonly state: LINT_STATE.PENDING;
};
export type LintViolation<D extends Diagnostic = Diagnostic> = Diagnostic & {
  readonly value: D;
  readonly state: LINT_STATE.HAS_VIOLATION;
};
export type LintResolved = Diagnostic & {
  readonly value: undefined;
  readonly state: LINT_STATE.RESOLVED;
};
export type LintState<D extends Diagnostic = Diagnostic> =
  | LintPending
  | LintViolation<D>
  | LintResolved;

export function toLintState<
  D extends Diagnostic = Diagnostic,
  R extends D["rule"] = D["rule"]
>({
  rule,
  id,
  lintable,
  promise,
}: {
  rule: R;
  id: string;
  lintable: Lintable;
  promise: PromiseLike<D>;
}): LintState<D> {
  const observablePromise = promise as any;
  observablePromise.isLintState = true;
  extendObservable(
    observablePromise,
    {
      value: {
        rule,
        id,
        lintable,
      },
      state: LINT_STATE.PENDING,
    },
    {},
    { deep: false }
  );

  promise.then(
    action((value: D) => {
      observablePromise.value = value;
      observablePromise.state = LINT_STATE.HAS_VIOLATION;
    }),
    action(() => {
      observablePromise.value = undefined;
      observablePromise.state = LINT_STATE.RESOLVED;
    })
  );

  return observablePromise;
}

export namespace toLintState {
  export const resolve = action(
    <D extends Diagnostic = Diagnostic>(diagnostic: D): LintState<D> => {
      const { rule, id, lintable } = diagnostic;
      const lintState = toLintState({
        rule,
        id,
        lintable,
        promise: Promise.resolve(diagnostic),
      });
      return lintState;
    }
  );
}
