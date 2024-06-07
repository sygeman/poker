/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";

import { Home } from "./routes/home";
import { Session } from "./routes/session";
import { Route, Router } from "@solidjs/router";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(
  () => (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/:session" component={Session} />
    </Router>
  ),
  root!
);
