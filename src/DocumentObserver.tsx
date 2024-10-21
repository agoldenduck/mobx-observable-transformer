import { observer } from "mobx-react-lite";
import { Document } from "./Document";

type DocumentObserverProps = {
  document: Document;
};

export const DocumentObserver = observer(
  ({ document }: DocumentObserverProps) => {
    const { pages } = document;
    return (
      <div>
        <h2>The Document</h2>
        {pages.map((page, i) => {
          return (
            <div key={i}>
              <h3>Page {i}</h3>
              {page.elements.map((element, ei) => (
                <p key={ei}>{element.data}</p>
              ))}
            </div>
          );
        })}
      </div>
    );
  }
);
