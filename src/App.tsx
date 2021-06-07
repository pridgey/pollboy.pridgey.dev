import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import {
  AirtableProvider,
  PollAPIProvider,
  UserIDProvider,
  getTheme,
} from "./utilities";
import { StyleWrapper } from "@pridgey/afterburner";
import { Layout } from "./components";
import { Toaster } from "react-hot-toast";

// Lazy load components
const Home = lazy(() => import("./views/home"));
const CreatePoll = lazy(() => import("./views/createPoll"));

const App = () => (
  <UserIDProvider>
    <AirtableProvider>
      <PollAPIProvider>
        <StyleWrapper Theme={getTheme()}>
          <Toaster containerClassName="toast" />
          <BrowserRouter>
            <Suspense fallback={<div>loading</div>}>
              <Layout>
                <Switch>
                  <Route path="/create" component={CreatePoll} />
                  <Route path="/" component={Home} />
                </Switch>
              </Layout>
            </Suspense>
          </BrowserRouter>
        </StyleWrapper>
      </PollAPIProvider>
    </AirtableProvider>
  </UserIDProvider>
);

export default App;
