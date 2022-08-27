import React, {
  createContext,
  FC,
  useContext,
  useState,
  useEffect,
} from "react";
import { createClient, SupabaseClient, User } from "@supabase/supabase-js";

type SupabaseContextProps = {
  supabase: SupabaseClient;
  user: User;
};

const emptyUser: User = {
  app_metadata: {},
  aud: "",
  created_at: "",
  id: "",
  user_metadata: {},
};

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "";
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_PUBLIC || "";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const SupabaseContext = createContext<SupabaseContextProps>({
  supabase: supabase,
  user: emptyUser,
});

export const useSupabase = () => useContext(SupabaseContext);

export const SupabaseProvider: FC = ({ children }) => {
  // Store current user in state so when it updates we rerender everything
  const [currentUser, setCurrentUser] = useState<User>(emptyUser);

  // Grab the user if available
  useEffect(() => {
    if (!currentUser?.id) {
      // No user. Check supabase first for an auth'd user
      supabase.auth.getUser().then((user) => {
        if (!user?.data?.user) {
          // No user was found in supabase, so we need to log someone in
          // Redirect to /login
          console.log("Nothing found, log them in!");
          supabase.auth.signInWithOtp({ email: "taylor@pridgey.dev" });
        } else {
          // There is a user in supabase
          console.log("User found, setting state");
          setCurrentUser(user.data.user);
        }
      });
    }
  }, []);

  console.log({ currentUser });

  return (
    <SupabaseContext.Provider value={{ supabase, user: currentUser }}>
      {children}
    </SupabaseContext.Provider>
  );
};
