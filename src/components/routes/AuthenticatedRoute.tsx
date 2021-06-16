import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";
import HomePage from "../../pages/HomePage";
import FeedbackPage from "../../pages/FeedbackPage";
import Header from "../Header";
import Footer from "../Footer";
import Container from "@material-ui/core/Container";
import useAdmin from "../../hooks/useAdmin";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../config/firebase";
import AdminLoading from "../loadings/AdminLoading";
import PermissionDeinedPage from "../../pages/PermissionDeinedPage";

const AdminRoute = () => {
  return (
    <>
      <Header />
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route exact path="/feedback">
          <FeedbackPage />
        </Route>
        <Redirect from="*" to="/" />
      </Switch>
      <Footer />
    </>
  );
};

export default function AuthenticatedRoute() {
  const [user] = useAuthState(auth);
  const [isAdmin, loading] = useAdmin(user?.uid);
  return (
    <Router>
      <Container maxWidth="lg">
        {loading ? (
          <AdminLoading />
        ) : isAdmin ? (
          <AdminRoute />
        ) : (
          <PermissionDeinedPage />
        )}
      </Container>
    </Router>
  );
}
