import { Suspense, useEffect, useState, lazy } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import firebase from "firebase";
import { AirtableProvider, PollAPIProvider, getTheme } from "./utilities";
import { Poll } from "./views";
import { v4 } from "uuid";
import { StyleWrapper } from "@pridgey/afterburner";

// Do we still need this if people aren't logging in?
firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "pridgey-poll.firebaseapp.com",
  projectId: "pridgey-poll",
  storageBucket: "pridgey-poll.appspot.com",
  messagingSenderId: "1085093590247",
  appId: "1:1085093590247:web:ccc7c0aededa8c13599e42",
});

const Home = lazy(() => import("./views/home"));

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
      <PollAPIProvider>
        <StyleWrapper Theme={getTheme()}>
          <BrowserRouter>
            <Suspense fallback={<div>loading</div>}>
              <Switch>
                <Route path="/" component={Home} />
              </Switch>
            </Suspense>
          </BrowserRouter>
        </StyleWrapper>
      </PollAPIProvider>
    </AirtableProvider>
  );
};

export default App;
