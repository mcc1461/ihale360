// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { store, persistor } from "./app/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <App />
          <ToastContainer /> {/* To display toast notifications */}
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
