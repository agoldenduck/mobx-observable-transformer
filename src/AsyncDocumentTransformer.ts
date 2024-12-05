import { computed, observable } from "mobx";
import { computedFn, createTransformer } from "mobx-utils";
import { AnAsyncRule } from "./rules/AnAsyncRule";
import { AnotherAsyncRule } from "./rules/AnotherAsyncRule";
import { ASyncRule } from "./rules/ASyncRule";
import { Diagnostic } from "./types/Diagnostic";
import { document, Document, Element, Page } from "./types/Document";
import { LintablePage, LintableElement, Lintable } from "./types/Lintable";
import {
  LINT_STATE,
  LintPending,
  LintState,
  LintViolation,
} from "./types/LintState";
import { BaseRule } from "./types/Rule";
import { RuleId, RuleConfig } from "./types/RuleConfig";

export class AsyncDocumentTransformer {
  @observable.deep
  document: Document = {
    pages: [],
  };

  @observable.struct
  private rules: BaseRule<RuleId>[] = [];

  startTransforming(ruleConfigs?: RuleConfig[]) {
    this.document = document;
    this.rules = [new AnAsyncRule(), new ASyncRule(), new AnotherAsyncRule()];
    this.rules.forEach((rule) => rule.init?.());
  }

  /**
   * This is a new computed
   */
  @computed
  get pendingAsyncDiagnostics(): Diagnostic[][] {
    return this.transformedDocument.map(lintNodeToPendingDiagnostics);
  }

  @computed
  get diagnostics(): Diagnostic[][] {
    return this.transformedDocument.map(lintNodeToDiagnostics);
  }

  @computed
  get transformedDocument(): LintNode[] {
    return this._transformDocument(this.document);
  }
  private readonly _transformDocument = createTransformer(
    (document: Document) => {
      return document.pages.map((page) => this._transformPage(page));
    }
  );

  private readonly _transformPage = createTransformer(
    (page: Page): LintNode => {
      const lintable: LintablePage = {
        type: "page",
        page,
      };

      return {
        lintable,
        lintStates: this.rules.flatMap((rule) =>
          rule.getLintStates(lintable).filter(exists)
        ),
        children: page.elements.map((element) =>
          this._transformElement(page, element)
        ),
      };
    }
  );

  private readonly _transformElement = computedFn(
    (page: Page, element: Element): LintNode => {
      const lintable: LintableElement = {
        type: "element",
        page,
        element,
      };

      return {
        lintable,
        lintStates: this.rules.flatMap((rule) =>
          rule.getLintStates(lintable).filter(exists)
        ),
      };
    }
  );
}

function exists<T>(t: T | undefined | null): t is T {
  return t != null;
}

type LintNode = {
  lintable: Lintable;
  lintStates: LintState[];
  children?: LintNode[];
};

/**
 * Find the diagnostics in a node and all its child nodes
 * This updates as the observable diagnostics resolve
 */
export function lintNodeToDiagnostics(node: LintNode): Diagnostic[] {
  return flattenLintNode(node).flatMap((n) =>
    n.lintStates
      .filter(lintStateIsLintViolation)
      .map((lintState) => lintState.value)
  );
}

/**
 * Find the loading diagnostics in a node and all its child nodes
 */
export function lintNodeToPendingDiagnostics(node: LintNode): Diagnostic[] {
  return flattenLintNode(node).flatMap((n) =>
    n.lintStates
      .filter(lintStateIsLintPending)
      .map((lintState) => lintState.value)
  );
}

function lintStateIsLintViolation(
  lintState: LintState
): lintState is LintViolation {
  return lintState.state === LINT_STATE.HAS_VIOLATION;
}

function lintStateIsLintPending(
  lintState: LintState
): lintState is LintPending {
  return lintState.state === LINT_STATE.PENDING;
}

/**
 * Given a node, returns a flat list containing the node and all descending child nodes
 */
function flattenLintNode(node: LintNode): LintNode[] {
  if (!node.children || node.children.length === 0) {
    return [node];
  }
  return [node, ...node.children.flatMap((n) => flattenLintNode(n))];
}
