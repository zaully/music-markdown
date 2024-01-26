import { HashRouter, Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
import { GitHubApiProvider } from "../context/GitHubApiProvider";
import { ReposProvider } from "../context/ReposProvider";
import { SnackbarProvider } from "../context/SnackbarProvider";
import { SongPrefsProvider } from "../context/SongPrefsProvider";
import { ThemeProvider } from "../context/ThemeProvider";
import { YouTubeIdProvider } from "../context/YouTubeIdProvider";
import { REPO_REGEX } from "../lib/constants";
import AppBar from "./AppBar";
import BranchViewer from "./BranchView";
import FileViewer from "./FileView";
import Edit from "./MusicMd/Edit";
import View from "./MusicMd/View";
import RepoViewer from "./RepoView";
import { GlobalUserPrefsProvider } from "../context/GlobalUserPrefProvider";

const App = () => (
  <YouTubeIdProvider>
    <GlobalUserPrefsProvider>
      <SongPrefsProvider>
        <GitHubApiProvider>
          <ReposProvider>
            <ThemeProvider>
              <SnackbarProvider>
                <HomeRouter />
              </SnackbarProvider>
            </ThemeProvider>
          </ReposProvider>
        </GitHubApiProvider>
      </SongPrefsProvider>
    </GlobalUserPrefsProvider>
  </YouTubeIdProvider>
);

const HomeRouter = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/app">
        <HashRouter>
          <Route component={AppBar} />
          <Switch>
            <Route path={`${REPO_REGEX}/viewer/:branch/:path+`} component={View} />
            <Route
              path={`${REPO_REGEX}/browser/:branch/:path*`}
              component={FileViewer}
            />
            <Route path={`${REPO_REGEX}/editor/:branch/:path*`} component={Edit} />
            <Route path={REPO_REGEX} component={BranchViewer} />
            <Route exact path="/" component={RepoViewer} />
          </Switch>
        </HashRouter>
      </Route>
      <Route render={() => <Redirect to="/app/" />} />
    </Switch>
  </BrowserRouter>
);

export default App;
