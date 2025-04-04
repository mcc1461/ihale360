// src/index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "tailwindcss/tailwind.css";
import "sweetalert2/dist/sweetalert2.min.css";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import store, { persistor } from "./store"; // your Redux store & persistor
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "bootstrap/dist/css/bootstrap.min.css"; // remove if not using bootstrap
import Loader from "./components/Loader"; // optional loading component

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={<Loader />} persistor={persistor}>
      <React.StrictMode>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ToastContainer />
          <App />
        </BrowserRouter>
      </React.StrictMode>
    </PersistGate>
  </Provider>
);
