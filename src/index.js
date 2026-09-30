import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/theme.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { NotificationProvider } from "./components/ui/NotificationProvider";
import { ThemeProvider } from "./components/ui/ThemeProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HelmetProvider>
    <ThemeProvider>
      <BrowserRouter>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </BrowserRouter>
    </ThemeProvider>
  </HelmetProvider>,
);

reportWebVitals();
