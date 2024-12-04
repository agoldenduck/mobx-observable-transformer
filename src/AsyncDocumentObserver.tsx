import { observer } from "mobx-react-lite";
import { Diagnostic } from "./types/Diagnostic";

type AsyncDocumentObserverProps = {
  diagnostics: Diagnostic[][];
  pendingDiagnostics: Diagnostic[][];
};

export const AsyncDocumentObserver = observer(
  ({ diagnostics, pendingDiagnostics }: AsyncDocumentObserverProps) => {
    return (
      <div style={{ textAlign: "left" }}>
        <h2>All Diagnostics</h2>
        {pendingDiagnostics.flat().length > 0 &&
          `Pending diagnostics: ${pendingDiagnostics.reduce(
            (accum, pageDiagnostics) => {
              return accum + pageDiagnostics.length;
            },
            0
          )}`}
        {diagnostics.map((pageDiagnostics, pi) =>
          pageDiagnostics.map((diagnostic, di) => (
            <p key={`${pi}_${di}`}>
              {diagnostic.lintable.type === "element"
                ? diagnostic.lintable.element.data + ": "
                : ""}
              {diagnostic.rule}
            </p>
          ))
        )}
      </div>
    );
  }
);
