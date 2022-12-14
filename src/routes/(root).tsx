import { Outlet } from "@solidjs/router";
// import styles from "./style.module.scss";

export default function GlobalLayout() {
  return (
    <div id="layout">
      <nav class="navbar">
        <span>Pollboy</span>
        <span>Login</span>
      </nav>
      <main class="maincontent">
        <Outlet />
      </main>
    </div>
  );
}
