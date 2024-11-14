import { Page, Element } from "../Document";
import { AltTextConfig } from "./AltTextRule";
import { InsufficientTextContrastConfig } from "./ContrastRule";
import { ImageProcessingDangerZoneConfig } from "./DangerZoneRule";

export type LintablePage = {
  type: "page";
  page: Page;
};

export type LintableElement = {
  type: "element";
  page: Page;
  element: Element;
};

export type Lintable = LintablePage | LintableElement;

type SyncRuleConfig = AltTextConfig;
type AsyncRuleConfig =
  | InsufficientTextContrastConfig
  | ImageProcessingDangerZoneConfig;
export type RuleConfig = AsyncRuleConfig | SyncRuleConfig;

export type RuleId = RuleConfig["rule"];
export type AsyncRuleId = AsyncRuleConfig["rule"];
export type SyncRuleId = SyncRuleConfig["rule"];

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

export interface Rule<R extends RuleId> {
  init?(): void;
  checkFixed(lintable: Lintable): Diagnostic<R>[];
}

export interface AsyncRule<R extends AsyncRuleId> extends Rule<R> {}
