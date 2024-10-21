import { IPromiseBasedObservable } from "mobx-utils";
import { AltTextId, AltTextInfo } from "./rules/AltTextRule";
import {
  InsufficientTextContrastId,
  InsufficientTextContrastInfo,
} from "./rules/ContrastRule";
import {
  ImageProcessingDangerZoneId,
  ImageProcessingDangerZoneInfo,
} from "./rules/DangerZoneRule";
import { AsyncRuleId, Lintable, RuleId, SyncRuleId } from "./rules/Rule";

type BaseDiagnostic = {
  id: string;
  lintable: Lintable;
};
type SyncDiagnostic<R extends SyncRuleId = SyncRuleId> = BaseDiagnostic & {
  type: "sync";
  fix?(): void;
} & ({ rule: Exclude<R, AltTextId> } | ({ rule: AltTextId } & AltTextInfo));

type AsyncDiagnosticData<Info extends {} = {}> = IPromiseBasedObservable<
  {
    fix?(): void;
  } & Info
>;

type AsyncDiagnostic<R extends AsyncRuleId = AsyncRuleId> = BaseDiagnostic & {
  type: "async";
} & (
    | {
        rule: Exclude<
          R,
          ImageProcessingDangerZoneId | InsufficientTextContrastId
        >;
        promise: AsyncDiagnosticData;
      }
    | {
        rule: ImageProcessingDangerZoneId;
        promise: AsyncDiagnosticData<ImageProcessingDangerZoneInfo>;
      }
    | {
        rule: InsufficientTextContrastId;
        promise: AsyncDiagnosticData<InsufficientTextContrastInfo>;
      }
  );
export type Diagnostic<R extends RuleId = RuleId> = R extends SyncRuleId
  ? SyncDiagnostic<R>
  : R extends AsyncRuleId
  ? AsyncDiagnostic<R>
  : never;
