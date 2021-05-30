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

// Lazy load components
const Home = lazy(() => import("./views/home"));

const App = () => (
  <UserIDProvider>
    <AirtableProvider>
      <PollAPIProvider>
        <StyleWrapper Theme={getTheme()}>
          <BrowserRouter>
            <Suspense fallback={<div>loading</div>}>
              <Layout>
                <Switch>
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
