import { document } from "../types/Document";
import { ExpensivePageTaskManager } from "../ExpensivePageTaskManager";
import { Rule } from "../types/Rule";
import { Diagnostic } from "../types/Diagnostic";
import { Lintable } from "../types/Lintable";
import { toAsyncDiagnostic } from "../types/AsyncDiagnostic";

export type AnAsyncId = "an_async_rule";

export type AnAsyncConfig = {
  rule: AnAsyncId;
  info: AnAsyncInfo;
};

export type AnAsyncInfo = {
  // Colors associated with the issue target, providing them directly as not much extra computing needed.
  currentTargetColors?: readonly number[];
  // Candidates array are not provided directly due to computing them is expansive and
  // the current use case for them uses the candidates from a single linter diagnostic instead of all
  // the diagnostics, so computing candidates on-demand time saves a lot.
  getCandidates?(): number[];
  // Apply new color to diagnostic associated target like element or item,
  // common use case is letting users select one color from the given candidates and applying it
  // to get contrast issue fixed.
  updateTargetColor?(newColor: string): void;
};

export class AnAsyncRule implements Rule<AnAsyncId> {
  private readonly pageTaskManager = new ExpensivePageTaskManager();
  init(): void {
    document.pages.map((page) => {
      this.pageTaskManager.startListeningToChanges(page);
    });
  }

  checkFixed(lintable: Lintable) {
    if (lintable.type === "page") {
      return [];
    }
    const resolved: Diagnostic<AnAsyncId> = {
      rule: "an_async_rule",
      id: "an_async_id",
      lintable,
      fix: () => {},
      currentTargetColors: [0, 1, 2],
      getCandidates: () => [3, 4, 5],
    };
    const promise = () =>
      new Promise<Diagnostic<AnAsyncId>>((resolve, reject) => {
        setTimeout(() => {
          if (lintable.element.data.includes("1")) {
            resolve(resolved);
          } else {
            reject();
          }
        }, 2000);
      });

    const pageTask = this.pageTaskManager.getPageTaskResult(lintable.page);

    const diagnostic = toAsyncDiagnostic({
      rule: "an_async_rule",
      id: "an_async_id",
      lintable,
      promise: pageTask.then(() => promise()),
    });

    return [diagnostic];
  }
}
