import { AnAsyncConfig } from "../rules/AnAsyncRule";
import { ASyncConfig } from "../rules/ASyncRule";
import { AnotherAsyncConfig } from "../rules/AnotherAsyncRule";

export type RuleConfig = AnAsyncConfig | AnotherAsyncConfig | ASyncConfig;

export type RuleId = RuleConfig["rule"];

export type RuleInfo<R extends RuleId> = RuleConfig extends infer A
  ? A extends { rule: R }
    ? RuleConfig["info"]
    : never
  : never;
