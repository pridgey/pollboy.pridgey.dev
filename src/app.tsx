// @refresh reload
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import { Navbar } from "./compositions/Navbar";

export default function App() {
  return (
    <Router
      root={(props) => (
        <>
          <Suspense>
            <Navbar />
            {props.children}
          </Suspense>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
