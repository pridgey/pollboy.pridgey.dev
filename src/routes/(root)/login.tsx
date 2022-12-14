import { Show } from "solid-js";
import { useParams, useRouteData } from "solid-start";
import { FormError } from "solid-start/data";
import {
  createServerAction$,
  createServerData$,
  redirect,
} from "solid-start/server";
import { db } from "~/db";
import { createUserSession, getUser, login, register } from "~/db/session";
import styles from "~/css/login.module.css";
import { Button, Input } from "~/components";

function validateEmail(email: unknown) {
  if (typeof email !== "string" || email.length < 3) {
    return `Email must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
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
    console.log("Form:", { form });

    // Get all the data from the form
    const loginType = form.get("loginType");
    const username = form.get("username");
    const email = form.get("email");
    const password = form.get("password");
    const redirectTo = form.get("redirectTo") || "/";

    console.log("Data:", { email, password });

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
      username: validateEmail(email),
      password: validatePassword(password),
    };
    if (Object.values(fieldErrors).some(Boolean)) {
      throw new FormError("Fields invalid", { fieldErrors, fields });
    }

    console.log("------- It's login time...");
    const user = await login({ email, password });
    console.log("------- Post Login:", { user });
    if (!user) {
      throw new FormError(`Ah man, something went wrong`, {
        fields,
      });
    }
    console.log("------ It's session time...");
    return createUserSession(
      user?.user?.id || "",
      user?.session?.access_token || "",
      redirectTo
    );

    // // Depending on login or register, do stuff
    // switch (loginType) {
    //   case "login": {
    //     console.log("------- It's login time...");
    //     const user = await login({ email, username, password });
    //     console.log("------- Post Login:", { user });
    //     if (!user) {
    //       throw new FormError(`Ah man, something went wrong`, {
    //         fields,
    //       });
    //     }
    //     console.log("------ It's session time...");
    //     return createUserSession(
    //       user?.user?.id || "",
    //       user?.session?.access_token || "",
    //       redirectTo
    //     );
    //   }
    //   case "register": {
    //     const userExists = await db.user.findUnique({ where: { username } });
    //     if (userExists) {
    //       throw new FormError(`User with username ${username} already exists`, {
    //         fields,
    //       });
    //     }
    //     const user = await register({ email, username, password });
    //     if (!user) {
    //       throw new FormError(
    //         `Something went wrong trying to create a new user.`,
    //         {
    //           fields,
    //         }
    //       );
    //     }
    //     return createUserSession(
    //       user?.user?.id || "",
    //       user?.session?.access_token || "",
    //       redirectTo
    //     );
    //   }
    //   default: {
    //     throw new FormError(`Login type invalid`, { fields });
    //   }
    // }
  });

  return (
    <main class={styles.logincontainer}>
      <div class={styles.loginmodal}>
        <h1 class={styles.logintitle}>Login</h1>
        <Form class={styles.loginform}>
          <input
            type="hidden"
            name="redirectTo"
            value={params.redirectTo ?? "/"}
          />
          <Show when={loggingIn.error}>
            <p role="alert" id="error-message">
              There's an error: {loggingIn.error.message}
            </p>
          </Show>
          <Input
            Label="Email"
            Name="email"
            Placeholder="person@place.biz"
            Type="text"
          />
          <Show when={loggingIn.error?.fieldErrors?.email}>
            <p role="alert">{loggingIn.error.fieldErrors.email}</p>
          </Show>
          <Input
            Label="Password"
            Name="password"
            Placeholder="maybe not 'password'"
            Type="password"
          />
          <Show when={loggingIn.error?.fieldErrors?.password}>
            <p role="alert">{loggingIn.error.fieldErrors.password}</p>
          </Show>
          <Button Type="submit">{data() ? "Login" : ""}</Button>
        </Form>
      </div>
      <h2 class={styles.pollboytitle}>Pollboy</h2>
    </main>
  );
}
