import { Show, onMount } from "solid-js";
import { useSearchParams } from "solid-start";
import { FormError } from "solid-start/data";
import { createServerAction$ } from "solid-start/server";
import { Button, Input } from "~/components";
import styles from "~/css/login.module.css";
import { triggerPasswordReset } from "~/db/session";

const validateEmail = (email: unknown) => {
  // Go through some email checks
  if (typeof email !== "string") {
    return "Issue submitting email.";
  }
  if (email.length === 0) {
    return "Email is a required field.";
  }
  if (!email.includes("@") || email.split(".").length < 2) {
    return "Email seems to be formatted incorrectly";
  }
};

const Reset = () => {
  const [params] = useSearchParams();

  const [submittingForm, { Form }] = createServerAction$(
    async (form: FormData) => {
      // Get all the data from the form
      const email = form.get("email");
      // Quick validation
      if (typeof email !== "string") {
        throw new FormError(`Form not submitted correctly.`);
      }
      // More validation
      const fields = { email };
      const fieldErrors = {
        email: validateEmail(email),
      };
      if (Object.values(fieldErrors).some(Boolean)) {
        throw new FormError("There are some field format issues", {
          fieldErrors,
          fields,
        });
      }

      // Send reset password to supabase
      triggerPasswordReset(email, "/reset");
    }
  );

  return (
    <div class={styles.logincontainer}>
      <div class={styles.loginmodal}>
        <h1 class={styles.logintitle}>Password Reset</h1>
        <Form class={styles.loginform}>
          <input
            type="hidden"
            name="redirectTo"
            value={params.redirectTo ?? "/"}
          />
          <Show when={submittingForm.error}>
            <span role="alert" class={styles.loginerror} id="error-message">
              {submittingForm.error.message}
            </span>
          </Show>
          <Input
            Label="Email"
            DefaultValue={params.email}
            Name="email"
            Placeholder="person@place.biz"
            Type="text"
            Error={submittingForm.error?.fieldErrors?.email}
          />
          <Button Type="submit">Reset Password</Button>
        </Form>
      </div>
      <h2 class={styles.pollboytitle}>Pollboy</h2>
    </div>
  );
};

export default Reset;
