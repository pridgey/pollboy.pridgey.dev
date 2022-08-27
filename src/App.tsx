import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { SupabaseProvider, getTheme, RecentPollProvider } from "./utilities";
import { StyleWrapper } from "@pridgey/afterburner";
import { Layout } from "./components";
import { Toaster } from "react-hot-toast";

// Lazy load components
const Home = lazy(() => import("./views/home"));
const CreatePoll = lazy(() => import("./views/createPoll"));
const EditPoll = lazy(() => import("./views/EditPoll"));
const PollView = lazy(() => import("./views/PollView"));

const App = () => (
  <SupabaseProvider>
    <RecentPollProvider>
      <StyleWrapper Theme={getTheme()}>
        <Toaster containerClassName="toast" />
        <BrowserRouter>
          <Suspense fallback={<div>loading</div>}>
            <Layout>
              <Switch>
                <Route path="/create" component={CreatePoll} />
                <Route path="/edit" component={EditPoll} />
                <Route path="/poll" component={PollView} />
                <Route path="/" component={Home} />
              </Switch>
            </Layout>
          </Suspense>
        </BrowserRouter>
      </StyleWrapper>
    </RecentPollProvider>
  </SupabaseProvider>
);

export default App;
