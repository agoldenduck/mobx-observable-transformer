import { Element, Page } from "./Document";

export type LintablePage = {
  type: "page";
  page: Page;
};

export type LintableElement = {
  type: "element";
  page: Page;
  element: Element;
};

export type Lintable = LintablePage | LintableElement;
