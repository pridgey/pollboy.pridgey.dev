import styles from "./../../css/404.module.css";

export default function NotFound() {
  return (
    <div class={styles.container}>
      <h1 class={styles.notfoundtext}>404</h1>
      <h2 class={styles.subtext}>Page Not Found</h2>
    </div>
  );
}
