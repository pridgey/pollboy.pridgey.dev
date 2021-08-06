import { createContext, useContext, FC, useState, useEffect } from "react";
import { v4 } from "uuid";

export const UserIDContext = createContext("");

export const useUserID = (): string => useContext(UserIDContext);

export const UserIDProvider: FC = ({ children }) => {
  // The userid of this user
  const [userID, setUserID] = useState("");

  useEffect(() => {
    const localID = localStorage.getItem("pollboy-userid");
    if (localID) {
      setUserID(localID);
    } else {
      const newID = v4();
      localStorage.setItem("pollboy-userid", newID);
      setUserID(newID);
    }
  }, []);

  return (
    <UserIDContext.Provider value={userID}>{children}</UserIDContext.Provider>
  );
};
