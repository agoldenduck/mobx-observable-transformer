import { observer } from "mobx-react-lite";
import { action } from "mobx";
import { useRef } from "react";
import { Document } from "./Document";

type DocumentMutatorProps = {
  document: Document;
};

export const DocumentMutator = observer(
  ({ document }: DocumentMutatorProps) => {
    const elementTextRef = useRef<HTMLInputElement>(null);
    const pageNumRef = useRef<HTMLSelectElement>(null);
    const onAddPageClick = action(() => {
      document.pages.push({ elements: [] });
    });
    const onAddElementClick = action(() => {
      const page = Number(pageNumRef.current?.value) ?? 0;
      document.pages[page].elements.push({
        data: elementTextRef.current?.value ?? "",
      });
      if (elementTextRef.current) {
        elementTextRef.current.value = "";
      }
      if (pageNumRef.current) {
        pageNumRef.current.value = "0";
      }
    });
    return (
      <div>
        <h2>Mutate Document</h2>
        <p>
          Add page:{" "}
          <button type="button" onClick={onAddPageClick}>
            Add page
          </button>
        </p>
        <p>
          Add element: <input type="text" ref={elementTextRef} /> to page:{" "}
          <select ref={pageNumRef}>
            {document.pages.map((_, i) => (
              <option key={i}>{i}</option>
            ))}
          </select>{" "}
          <button type="button" onClick={onAddElementClick}>
            Add element
          </button>
        </p>
      </div>
    );
  }
);
