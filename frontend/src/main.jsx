import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import RedirectHandler from "./pages/RedirectHandler";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Home page — URL shortener UI */}
        <Route path="/" element={<App />} />
        {/* Redirect handler — catches /:shortCode and redirects to original URL */}
        <Route path="/:shortCode" element={<RedirectHandler />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
