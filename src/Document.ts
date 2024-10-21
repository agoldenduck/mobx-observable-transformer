import { observable } from "mobx";

export type Element = {
  data: string;
};

export type Page = {
  elements: Element[];
};

export type Document = {
  pages: Page[];
};

export const document = observable({
  pages: [
    { elements: [{ data: "abcd1234" }, { data: "updownleftright" }] },
    { elements: [{ data: "54321_dance" }, { data: "20twenty" }] },
  ],
});
