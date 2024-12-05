import { AnAsyncConfig } from "../rules/AnAsyncRule";
import { AnotherAsyncConfig } from "../rules/AnotherAsyncRule";
import { ASyncConfig } from "../rules/ASyncRule";

export type RuleConfig = AnAsyncConfig | AnotherAsyncConfig | ASyncConfig;

export type RuleId = RuleConfig["rule"];

export type RuleInfo<R extends RuleId> = RuleConfig extends infer A
  ? A extends { rule: R }
    ? RuleConfig["info"]
    : never
  : never;
