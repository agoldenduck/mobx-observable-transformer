import { action, computed, observable, when } from "mobx";
import { fromPromise, IPromiseBasedObservable } from "mobx-utils";
import { document } from "../Document";
import {
  ExpensivePageTaskManager,
  PageTask,
} from "../ExpensivePageTaskManager";
import { AsyncDiagnostic, AsyncRule, Lintable } from "./Rule";

export type InsufficientTextContrastId = "insufficient_text_contrast";

export type InsufficientTextContrastInfo = {
  // Colors associated with the issue target, providing them directly as not much extra computing needed.
  currentTargetColors: readonly number[];
  // Candidates array are not provided directly due to computing them is expansive and
  // the current use case for them uses the candidates from a single linter diagnostic instead of all
  // the diagnostics, so computing candidates on-demand time saves a lot.
  getCandidates(): number[];
  // Apply new color to diagnostic associated target like element or item,
  // common use case is letting users select one color from the given candidates and applying it
  // to get contrast issue fixed.
  updateTargetColor?(newColor: string): void;
};

class InsufficientTextContrastDiagnostic {
  readonly type = "async";
  readonly rule = "insufficient_text_contrast";
  @observable.struct
  currentTargetColors: readonly number[] | undefined;
  @observable
  getCandidates: (() => number[]) | undefined;
  @observable
  fix: ((newColor?: string) => void) | undefined;

  @observable.ref
  private calculated: boolean = false;
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
    when(
      () => pageTask.state === "fulfilled",
      () => this.calculate()
    );
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

  @computed
  get state() {
    if (this.pageTask.state !== "fulfilled") {
      return this.pageTask.state;
    }
    if (this.calculated) {
      return "fulfilled";
    }
    return "pending";
  }

  @action
  private async calculate() {
    this.fromPromise = fromPromise(this.lint());
    this.fromPromise.then(
      action(({ hasViolation, fix, getCandidates, currentTargetColors }) => {
        this.calculated = true;
        if (hasViolation) {
          this.fix = fix;
          this.getCandidates = getCandidates;
          this.currentTargetColors = currentTargetColors;
        }
      })
    );
  }
}

export class ContrastRule implements AsyncRule<InsufficientTextContrastId> {
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
    } & InsufficientTextContrastInfo = {
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
        } & InsufficientTextContrastInfo
      >((resolve) => {
        setTimeout(() => resolve(resolved), 2000);
      });

    const pageTask = this.pageTaskManager.getPageTaskResult(lintable.page);

    const diagnostic = observable(
      new InsufficientTextContrastDiagnostic(
        "contrast_awesome",
        lintable,
        pageTask,
        promise
      )
    );
    return [diagnostic];
  }
}