import { AsyncDiagnostic } from "../types/Diagnostic";
import { Lintable } from "../types/Lintable";
import { AsyncRule } from "../types/Rule";

export type AnotherAsyncId = "another_async_rule";

export type AnotherAsyncInfo = {
  components: {}[];
};

export type AnotherAsyncProps = {
  dangerZoneSvgPath: string;
};

export type AnotherAsyncConfig = {
  rule: AnotherAsyncId;
  info: AnotherAsyncInfo;
  props: AnotherAsyncProps;
};

export class AnotherAsyncRule implements AsyncRule<AnotherAsyncId> {
  checkFixed(lintable: Lintable): AsyncDiagnostic<AnotherAsyncId>[] {
    if (lintable.type === "page") {
      return [];
    }

    if (lintable.element.data.includes("a")) {
      const diagnostic: AsyncDiagnostic<AnotherAsyncId> = {
        type: "async",
        lintable,
        id: "another_async_id",
        rule: "another_async_rule",
        hasViolation: true,
        components: [],
      };
      return [diagnostic];
    }
    return [];
  }
}
