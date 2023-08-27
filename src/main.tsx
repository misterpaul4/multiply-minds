import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.less";
import { RecoilRoot } from "recoil";
import Layout from "./Layout.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RecoilRoot>
      <Layout>
        <App />
      </Layout>
    </RecoilRoot>
  </React.StrictMode>
);

