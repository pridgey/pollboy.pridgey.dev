import { Suspense, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import firebase from "firebase";
import { AirtableProvider, getTheme } from "./utilities";
import { Poll } from "./views";
import { v4 } from "uuid";
import { StyleWrapper } from "@pridgey/afterburner";

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "pridgey-poll.firebaseapp.com",
  projectId: "pridgey-poll",
  storageBucket: "pridgey-poll.appspot.com",
  messagingSenderId: "1085093590247",
  appId: "1:1085093590247:web:ccc7c0aededa8c13599e42",
});

const App = () => {
  const [userID, setUserID] = useState("");

  useEffect(() => {
    const storageUserID = localStorage.getItem("pbid");
    if (storageUserID) {
      setUserID(storageUserID);
    } else {
      const newUserID = v4();
      setUserID(newUserID);
      localStorage.setItem("pbid", newUserID);
    }
  }, []);

  return (
    <AirtableProvider>
      <StyleWrapper Theme={getTheme()}>
        <BrowserRouter>
          <Suspense fallback={<div>loading</div>}>
            <Poll UserID={userID} />
          </Suspense>
        </BrowserRouter>
      </StyleWrapper>
    </AirtableProvider>
  );
};

export default App;
