import { IPromiseBasedObservable } from "mobx-utils";
import { Page, Element } from "../Document";
import { AltTextId, AltTextInfo } from "./AltTextRule";
import {
  InsufficientTextContrastId,
  InsufficientTextContrastInfo,
} from "./ContrastRule";
import {
  ImageProcessingDangerZoneConfig,
  ImageProcessingDangerZoneId,
  ImageProcessingDangerZoneInfo,
} from "./DangerZoneRule";

type BaseDiagnostic = {
  id: string;
  lintable: Lintable;
};
export type SyncDiagnostic<R extends SyncRuleId = SyncRuleId> =
  BaseDiagnostic & {
    type: "sync";
    fix?(): void;
  } & ({ rule: Exclude<R, AltTextId> } | ({ rule: AltTextId } & AltTextInfo));

export type AsyncDiagnostic<R extends AsyncRuleId = AsyncRuleId> =
  BaseDiagnostic & {
    type: "async";
    hasViolation: boolean | "pending";
    fix?(): void;
  } & (
      | {
          rule: Exclude<
            R,
            ImageProcessingDangerZoneId | InsufficientTextContrastId
          >;
        }
      | ({
          rule: ImageProcessingDangerZoneId;
        } & Partial<ImageProcessingDangerZoneInfo>)
      | ({
          rule: InsufficientTextContrastId;
        } & Partial<InsufficientTextContrastInfo>)
    );
export type Diagnostic<R extends RuleId = RuleId> = R extends SyncRuleId
  ? SyncDiagnostic<R>
  : R extends AsyncRuleId
  ? AsyncDiagnostic<R>
  : never;

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

export type RuleId = RuleConfig["rule"];
export type AsyncRuleId = AsyncRuleConfig["rule"];
export type SyncRuleId = SyncRuleConfig["rule"];

type AsyncRuleConfig =
  | { rule: InsufficientTextContrastId }
  | {
      rule: ImageProcessingDangerZoneId;
      config: ImageProcessingDangerZoneConfig;
    };
type SyncRuleConfig = { rule: AltTextId };
export type RuleConfig = AsyncRuleConfig | SyncRuleConfig;

export interface Rule<R extends RuleId> {
  init?(): void;
  checkFixed(lintable: Lintable): Diagnostic<R>[];
}

export interface AsyncRule<R extends AsyncRuleId> extends Rule<R> {}
