import { action, extendObservable } from "mobx";
import { Diagnostic } from "./Diagnostic";
import { Lintable } from "./Lintable";

export const PENDING = "pending";
export const FULFILLED = "fulfilled";
export const REJECTED = "rejected";

type PendingDiagnostic = Diagnostic & {
  readonly value: Diagnostic;
  readonly state: "pending";
};
type FulfilledDiagnostic<D extends Diagnostic = Diagnostic> = Diagnostic & {
  readonly value: D;
  readonly state: "fulfilled";
};
type RejectedDiagnostic = Diagnostic & {
  readonly value: undefined;
  readonly state: "rejected";
};
export type AsyncDiagnostic<D extends Diagnostic = Diagnostic> =
  | PendingDiagnostic
  | FulfilledDiagnostic<D>
  | RejectedDiagnostic;

export function toAsyncDiagnostic<
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
}): AsyncDiagnostic<D> {
  const observablePromise = promise as any;
  promise.then(
    action((value: D) => {
      observablePromise.value = value;
      observablePromise.state = FULFILLED;
    }),
    action(() => {
      observablePromise.value = undefined;
      observablePromise.state = REJECTED;
    })
  );
  observablePromise.isAsyncDiagnostic = true;
  extendObservable(
    observablePromise,
    {
      value: {
        rule,
        id,
        lintable,
      },
      rule,
      id,
      lintable,
      state: PENDING,
    },
    {},
    { deep: false }
  );

  return observablePromise;
}

export function isAsyncDiagnostic(value: any): value is AsyncDiagnostic {
  return value && value.isAsyncDiagnostic === true;
}
