import { Diagnostic } from "../types/Diagnostic";
import { Lintable } from "../types/Lintable";
import { Rule } from "../types/Rule";

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

export class AnotherAsyncRule implements Rule<AnotherAsyncId> {
  checkFixed(lintable: Lintable): Diagnostic<AnotherAsyncId>[] {
    if (lintable.type === "page") {
      return [];
    }

    if (lintable.element.data.includes("a")) {
      const diagnostic: Diagnostic<AnotherAsyncId> = {
        lintable,
        id: "another_async_id",
        rule: "another_async_rule",
        components: [],
      };
      return [diagnostic];
    }
    return [];
  }
}
