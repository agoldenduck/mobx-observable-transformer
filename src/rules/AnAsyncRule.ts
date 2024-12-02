import { action, computed, observable } from "mobx";
import { fromPromise, IPromiseBasedObservable } from "mobx-utils";
import { document } from "../types/Document";
import {
  ExpensivePageTaskManager,
  PageTask,
} from "../ExpensivePageTaskManager";
import { AsyncRule } from "../types/Rule";
import { AbstractAsyncDiagnostic } from "../types/Diagnostic";
import { Lintable } from "../types/Lintable";
import { RuleInfo } from "../types/RuleConfig";

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

class AnAsyncDiagnostic
  extends AbstractAsyncDiagnostic<AnAsyncId>
  implements RuleInfo<AnAsyncId>
{
  readonly rule = "an_async_rule";
  @observable.struct
  currentTargetColors: readonly number[] | undefined;
  @observable
  getCandidates: (() => number[]) | undefined;
  @observable
  fix: ((newColor?: string) => void) | undefined;

  @observable
  private fromPromise:
    | IPromiseBasedObservable<{
        hasViolation: boolean;
        fix?: (newColor?: string) => void;
        getCandidates?: () => number[];
        currentTargetColors?: readonly number[];
      }>
    | undefined;

  constructor(
    readonly id: string,
    readonly lintable: Lintable,
    private readonly pageTask: PageTask,
    private readonly lint: () => Promise<{
      hasViolation: boolean;
      fix?: (newColor?: string) => void;
      getCandidates?: () => number[];
      currentTargetColors?: readonly number[];
    }>
  ) {
    super();
    pageTask.then(() => this.calculate());
  }

  @computed
  get hasViolation() {
    if (
      this.pageTask.state !== "fulfilled" ||
      this.fromPromise?.state !== "fulfilled"
    ) {
      return "pending";
    }
    return this.fromPromise.value.hasViolation;
  }

  @action
  private async calculate() {
    this.fromPromise = fromPromise(this.lint());
    this.fromPromise.then(
      action(({ hasViolation, fix, getCandidates, currentTargetColors }) => {
        if (hasViolation) {
          this.fix = fix;
          this.getCandidates = getCandidates;
          this.currentTargetColors = currentTargetColors;
        }
      })
    );
  }
}

export class AnAsyncRule implements AsyncRule<AnAsyncId> {
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
    const resolved: {
      fix?: () => void;
      hasViolation: boolean;
    } & AnAsyncInfo = {
      fix: () => {},
      hasViolation: lintable.element.data.includes("1"),
      currentTargetColors: [0, 1, 2],
      getCandidates: () => [3, 4, 5],
    };
    const promise = () =>
      new Promise<
        {
          fix?: () => void;
          hasViolation: boolean;
        } & AnAsyncInfo
      >((resolve) => {
        setTimeout(() => resolve(resolved), 2000);
      });

    const pageTask = this.pageTaskManager.getPageTaskResult(lintable.page);

    const diagnostic = observable(
      new AnAsyncDiagnostic("an_async_id", lintable, pageTask, promise)
    );
    return [diagnostic];
  }
}
