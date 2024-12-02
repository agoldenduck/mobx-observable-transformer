import { AnAsyncConfig } from "../rules/AnAsyncRule";
import { ASyncConfig } from "../rules/ASyncRule";
import { AnotherAsyncZoneConfig } from "../rules/AnotherAsyncRule";

export type SyncRuleConfig = ASyncConfig;
export type AsyncRuleConfig = AnAsyncConfig | AnotherAsyncZoneConfig;
export type RuleConfig = AsyncRuleConfig | SyncRuleConfig;

export type RuleId = RuleConfig["rule"];
export type AsyncRuleId = AsyncRuleConfig["rule"];
export type SyncRuleId = SyncRuleConfig["rule"];

export type RuleInfo<R extends RuleId> = RuleConfig extends infer A
  ? A extends { rule: R }
    ? RuleConfig["info"]
    : never
  : never;
