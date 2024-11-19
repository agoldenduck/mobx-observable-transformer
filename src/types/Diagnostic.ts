import { Lintable } from "./Lintable";
import {
  SyncRuleId,
  AsyncRuleId,
  RuleId,
  AsyncRuleConfig,
  SyncRuleConfig,
} from "./RuleConfig";

type BaseDiagnostic = {
  id: string;
  lintable: Lintable;
  fix?(): void;
};

/**
 * Essentially the old Diagnostic type
 */
export type SyncDiagnostic<
  R extends SyncRuleId = SyncRuleId,
  C extends SyncRuleConfig = SyncRuleConfig extends infer A
    ? A extends { rule: R }
      ? SyncRuleConfig
      : never
    : never
> = BaseDiagnostic & {
  type: "sync";
  rule: R;
} & C["info"];

/**
 * New Diagnostic type that can be Pending
 * Although `hasViolation` can be false, Design Linter should not expose
 * those Diagnostics to consumers
 */
export type AsyncDiagnostic<
  R extends AsyncRuleId = AsyncRuleId,
  C extends AsyncRuleConfig = AsyncRuleConfig extends infer A
    ? A extends { rule: R }
      ? AsyncRuleConfig
      : never
    : never
> = BaseDiagnostic & {
  type: "async";
  rule: R;
  hasViolation: boolean | "pending";
} & C["info"];

export type Diagnostic<R extends RuleId = RuleId> = R extends SyncRuleId
  ? SyncDiagnostic<R>
  : R extends AsyncRuleId
  ? AsyncDiagnostic<R>
  : never;

export abstract class AbstractAsyncDiagnostic<
  R extends AsyncRuleId = AsyncRuleId
> implements BaseDiagnostic
{
  readonly type = "async";
  abstract readonly rule: R;
  abstract get hasViolation(): boolean | "pending";
  abstract readonly id: string;
  abstract readonly lintable: Lintable;
  abstract fix?(): void;

  update(lintable: Lintable) {}
}
