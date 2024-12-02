import { AsyncDiagnostic } from "../types/Diagnostic";
import { Lintable } from "../types/Lintable";
import { AsyncRule } from "../types/Rule";

export type AnotherAsyncZoneId = "another_async_rule";

export type AnotherAsyncZoneInfo = {
  components: {}[];
};

export type AnotherAsyncZoneProps = {
  dangerZoneSvgPath: string;
};

export type AnotherAsyncZoneConfig = {
  rule: AnotherAsyncZoneId;
  info: AnotherAsyncZoneInfo;
  props: AnotherAsyncZoneProps;
};

export class AnotherAsyncZoneRule implements AsyncRule<AnotherAsyncZoneId> {
  checkFixed(lintable: Lintable): AsyncDiagnostic<AnotherAsyncZoneId>[] {
    throw new Error("Method not implemented.");
  }
}
