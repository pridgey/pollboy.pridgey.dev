import { Show } from "solid-js";
import { useParams, useRouteData } from "solid-start";
import { FormError } from "solid-start/data";
import {
  createServerAction$,
  createServerData$,
  redirect,
} from "solid-start/server";
import { createUserSession, register } from "~/db/session";
import styles from "~/css/login.module.css";
import { Button, Input } from "~/components";

const validateUsername = (username: unknown) => {
  if (typeof username !== "string") {
    return "Issue submitting username.";
  }
  if (username.length === 0) {
    return "Username is a required field";
  }
  if (username.length < 3) {
    return "Username must be 3 characters or more.";
  }
};

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

export default function Register() {
  const data = useRouteData<typeof routeData>();
  const params = useParams();

  const [loggingIn, { Form }] = createServerAction$(async (form: FormData) => {
    // Get all the data from the form
    const email = form.get("email");
    const password = form.get("password");
    const username = form.get("username");

    // Quick validation
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof username !== "string"
    ) {
      throw new FormError(`Form not submitted correctly.`);
    }

    // More validation
    const fields = { email, password, username };
    const fieldErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
      username: validateUsername(username),
    };

    if (Object.values(fieldErrors).some(Boolean)) {
      throw new FormError("There are some field format issues", {
        fieldErrors,
        fields,
      });
    }

    const user = await register({ email, username, password });

    if (!user) {
      throw new FormError("That didn't work. Please try again", {
        fields,
      });
    }

    return redirect("/confirm");
  });

  return (
    <div class={styles.logincontainer}>
      <div class={styles.loginmodal}>
        <h1 class={styles.logintitle}>Register</h1>
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
            Label="Username"
            Name="username"
            Placeholder="What to call you"
            Type="text"
            Error={loggingIn.error?.fieldErrors?.username}
          />
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
          <Button Disabled={loggingIn.pending} Type="submit">
            {data() ? "Register" : ""}
          </Button>
        </Form>
      </div>
      <h2 class={styles.pollboytitle}>Pollboy</h2>
    </div>
  );
}
