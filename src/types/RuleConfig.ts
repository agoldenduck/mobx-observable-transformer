import { AltTextConfig } from "../rules/AltTextRule";
import { InsufficientTextContrastConfig } from "../rules/ContrastRule";
import { ImageProcessingDangerZoneConfig } from "../rules/DangerZoneRule";

export type SyncRuleConfig = AltTextConfig;
export type AsyncRuleConfig =
  | InsufficientTextContrastConfig
  | ImageProcessingDangerZoneConfig;
export type RuleConfig = AsyncRuleConfig | SyncRuleConfig;

export type RuleId = RuleConfig["rule"];
export type AsyncRuleId = AsyncRuleConfig["rule"];
export type SyncRuleId = SyncRuleConfig["rule"];

export type RuleInfo<R extends RuleId> = RuleConfig extends infer A
  ? A extends { rule: R }
    ? RuleConfig["info"]
    : never
  : never;
