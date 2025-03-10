import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom"; // BrowserRouter 임포트
import App from "./App"; // App 컴포넌트 임포트

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router> {/* Router로 감싸서 라우팅 활성화 */}
      <App />
    </Router>
  </React.StrictMode>
);

