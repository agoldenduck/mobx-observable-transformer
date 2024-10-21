import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { AsyncDocumentObserver } from "./AsyncDocumentObserver";
import { AsyncDocumentTransformer } from "./AsyncDocumentTransformer";
import { document } from "./Document";
import { DocumentMutator } from "./DocumentMutator";
import { DocumentObserver } from "./DocumentObserver";
import "./styles.css";

const App = observer(() => {
  const [transformer] = useState(new AsyncDocumentTransformer());
  useEffect(() => {
    transformer.startTransforming();
  }, []);
  const { pages } = document;
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <AsyncDocumentObserver
        diagnostics={transformer.diagnostics}
        pendingDiagnostics={transformer.pendingAsyncDiagnostics}
      />
      <Break />
      <DocumentMutator document={document} />
      <Break />
      <DocumentObserver document={document} />
    </div>
  );
});

export default App;

const Break = () => <br />;
