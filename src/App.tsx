import { lazy, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import firebase from "firebase";
import { AirtableProvider, getTheme } from "./utilities";
import { ThemeProvider } from "styled-components";
import { Poll } from "./views";

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "pridgey-poll.firebaseapp.com",
  projectId: "pridgey-poll",
  storageBucket: "pridgey-poll.appspot.com",
  messagingSenderId: "1085093590247",
  appId: "1:1085093590247:web:ccc7c0aededa8c13599e42",
});

const App = () => {
  return (
    <AirtableProvider>
      <ThemeProvider theme={getTheme()}>
        <BrowserRouter>
          <Suspense fallback={<div>loading</div>}>
            <Poll />
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </AirtableProvider>
  );
};

export default App;
