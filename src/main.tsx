
  // import { createRoot } from "react-dom/client";
  // import App from "./App.tsx";
  // import "./index.css";

  // createRoot(document.getElementById("root")!).render(<App />);
  
  import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { Provider } from "react-redux";

import "./index.css";
import store from "./store.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
  </React.StrictMode>
);