import { Show } from "solid-js";
import { useParams, useRouteData, A } from "solid-start";
import { FormError } from "solid-start/data";
import { createServerAction$, createServerData$ } from "solid-start/server";
import { createUserSession, login } from "~/db/session";
import styles from "~/css/login.module.css";
import { Button, Input } from "~/components";

function validateEmail(email: unknown) {
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
}

function validatePassword(password: unknown) {
  if (typeof password !== "string") {
    return "Issue submitting password.";
  }
  if (password.length === 0) {
    return "Passwords is a required field.";
  }
  if (password.length < 6) {
    return "Password must be longer than 6 characters.";
  }
}

export function routeData() {
  return createServerData$(async (_, { request }) => {
    // if (await getUser(request)) {
    //   throw redirect("/");
    // }
    return {};
  });
}

export default function Login() {
  const data = useRouteData<typeof routeData>();
  const params = useParams();

  const [loggingIn, { Form }] = createServerAction$(async (form: FormData) => {
    // Get all the data from the form
    const email = form.get("email");
    const password = form.get("password");
    const redirectTo = form.get("redirectTo") || "/";

    // Quick validation
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof redirectTo !== "string"
    ) {
      throw new FormError(`Form not submitted correctly.`);
    }

    // More validation
    const fields = { email, password };
    const fieldErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };

    if (Object.values(fieldErrors).some(Boolean)) {
      throw new FormError("There are some field format issues", {
        fieldErrors,
        fields,
      });
    }

    const user = await login({ email, password });
    if (!user) {
      throw new FormError("That didn't work. Please try again", {
        fields,
      });
    }
    return createUserSession(
      user?.user?.id || "",
      user?.session?.access_token || "",
      user?.session?.refresh_token || "",
      redirectTo
    );
  });

  return (
    <div class={styles.logincontainer}>
      <div class={styles.loginmodal}>
        <h1 class={styles.logintitle}>Login</h1>
        <Form class={styles.loginform}>
          <input
            type="hidden"
            name="redirectTo"
            value={params.redirectTo ?? "/"}
          />
          <Show when={loggingIn.error}>
            <span role="alert" class={styles.loginerror} id="error-message">
              {loggingIn.error.message}
            </span>
          </Show>
          <Input
            Label="Email"
            Name="email"
            Placeholder="person@place.biz"
            Type="text"
            Error={loggingIn.error?.fieldErrors?.email}
          />
          <Input
            Label="Password"
            Name="password"
            Placeholder="maybe not 'password'"
            Type="password"
            Error={loggingIn.error?.fieldErrors?.password}
          />
          <Button Type="submit">{data() ? "Login" : ""}</Button>
        </Form>
        <A href="/register" class={styles.loginlink}>
          register
        </A>
      </div>
      <h2 class={styles.pollboytitle}>Pollboy</h2>
    </div>
  );
}
