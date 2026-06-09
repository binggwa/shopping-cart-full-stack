import React from "react";
import ReactDOM from "react-dom/client";
import {App} from "./App.tsx";

// 환경변수를 통해 로컬 상황에서만 msw가 켜지도록 변경
async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MSW !== 'true') {
    return;
  }
  const { worker } = await import("./mocks/browser");
  return worker.start();
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
