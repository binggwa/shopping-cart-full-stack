import React from "react";
import ReactDOM from "react-dom/client";
import {App} from "./App.tsx";

// 배포 시 msw가 실제 api 요청을 가로채지 않도록 임시 주석처리
// async function enableMocking() {
//   if (!import.meta.env.DEV) {
//     return;
//   }
//   const { worker } = await import("./mocks/browser");
//   return worker.start();
// }

// enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
// });
