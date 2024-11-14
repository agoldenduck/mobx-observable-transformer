import { computed, observable } from "mobx";
import { computedFn, createTransformer } from "mobx-utils";
import { document, Document, Element, Page } from "./Document";
import { ContrastRule } from "./rules/ContrastRule";
import {
  Diagnostic,
  Lintable,
  LintableElement,
  LintablePage,
  Rule,
  RuleConfig,
  RuleId,
} from "./rules/Rule";

export class AsyncDocumentTransformer {
  @observable.deep
  document: Document = {
    pages: [],
  };

  @observable.struct
  private rules: Rule<RuleId>[] = [];

  startTransforming(ruleConfigs?: RuleConfig[]) {
    this.document = document;
    this.rules = [new ContrastRule()];
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
        diagnostics: this.rules.flatMap((rule) =>
          rule.checkFixed(lintable).filter(exists)
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
        diagnostics: this.rules.flatMap((rule) =>
          rule.checkFixed(lintable).filter(exists)
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
  diagnostics: Diagnostic[];
  children?: LintNode[];
};

/**
 * Find the diagnostics in a node and all its child nodes
 * This updates as the observable diagnostics resolve
 */
export function lintNodeToDiagnostics(node: LintNode): Diagnostic[] {
  return flattenLintNode(node).flatMap((n) =>
    n.diagnostics.filter((d) => d.type !== "async" || d.hasViolation === true)
  );
}

/**
 * Find the loading diagnostics in a node and all its child nodes
 */
export function lintNodeToPendingDiagnostics(node: LintNode): Diagnostic[] {
  return flattenLintNode(node).flatMap((n) =>
    n.diagnostics.filter(
      (d) => d.type === "async" && d.hasViolation === "pending"
    )
  );
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
