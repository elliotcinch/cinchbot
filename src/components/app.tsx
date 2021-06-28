import { FunctionalComponent, h } from "preact";
import { Route, Router } from "preact-router";
import "normalize.css";

import Chatbot from "../routes/chatbot";

const App: FunctionalComponent = () => {
  return (
    <div id="preact_root">
      <Router>
        <Route path="/" component={Chatbot} />
      </Router>
    </div>
  );
};

export default App;
