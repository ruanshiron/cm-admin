import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { purple } from "@material-ui/core/colors";
import SignInPage from "./pages/SignInPage";
import "./themes/style.scss";
import CssBaseline from "@material-ui/core/CssBaseline";
import UserLoading from "./components/loadings/UserLoading";
import AuthenticatedRoute from "./components/routes/AuthenticatedRoute";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./config/firebase";
import { SnackbarProvider } from "notistack";
import { ConfirmProvider } from "material-ui-confirm";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: purple[500],
    },
  },
});

function App() {
  const [user, loading] = useAuthState(auth);

  return (
    <SnackbarProvider maxSnack={3}>
      <ConfirmProvider>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          {loading ? (
            <UserLoading />
          ) : user ? (
            <AuthenticatedRoute />
          ) : (
            <SignInPage />
          )}
        </MuiThemeProvider>
      </ConfirmProvider>
    </SnackbarProvider>
  );
}

export default App;
