import styles from "~/css/login.module.css";

export default function Confirm() {
  return (
    <div class={styles.logincontainer}>
      <div class={styles.loginmodal}>
        <h1 class={styles.logintitle}>Excellent</h1>
        <h2 class={styles.logintext}>
          Before you can login to Pollboy you will need to confirm your email
        </h2>
        <h2 class={styles.logintext}>
          Head over to your email, click the confirmation link.
        </h2>
        <h2 class={styles.logintext}>
          The confirmation link should take you back to the Pollboy login
        </h2>
        <h2 class={styles.logintitle}>Thank you!</h2>
      </div>
      <h2 class={styles.pollboytitle}>Pollboy</h2>
    </div>
  );
}
