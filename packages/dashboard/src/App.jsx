import { useEffect, useState } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import firebaseService from "./Services/firebaseService";
import PrivateRoute from "./PrivateRoute";
import Publishers from "./Components/Publishers";
import PremiumContent from "./Components/PremiumContent";
import Settings from "./Components/Settings";
import Header from "./Components/Header";
import Admin from "./Components/Admin";
import Login from "./Components/Login";
import Spinner from "./Components/Spinner/Spinner";
import AppContext from "./AppContext";
import { getRoleFromUserClaims } from "./Services/utilsService";
import {
  ROLES_DEFAULT_ROUTES,
  ROLE_ADMIN,
  ROLE_PUBLISHER,
  ROLE_USER,
  LS_KEY_TOKEN,
} from "./Constants";
import { Container, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: 50,
    [theme.breakpoints.down("xs")]: {
      padding: 10,
    },
  },
}));

function App() {
  const classes = useStyles();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isUserAuthed, setIsUserAuthed] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [userPhoto, setUserPhoto] = useState("");

  useEffect(() => {
    const removeListener = firebaseService.auth().onAuthStateChanged((user) => {
      setIsLoading(true);
      if (user) {
        setIsUserAuthed(true);
        user.getIdTokenResult().then((tokenData) => {
          setUserRole(getRoleFromUserClaims(tokenData.claims));
          localStorage.setItem(LS_KEY_TOKEN, tokenData.token);
          setUserId(tokenData.claims.user_id);
          setUserPhoto(tokenData.claims.picture);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      removeListener();
    };
  }, []);

  const logout = () => {
    firebaseService.auth().signOut();
    setIsUserAuthed(false);
    setUserRole("");
    localStorage.removeItem(LS_KEY_TOKEN);
  };

  const redirectPath = ROLES_DEFAULT_ROUTES[userRole] || "/auth";

  return isLoading ? (
    <Spinner open={true} />
  ) : (
    <AppContext.Provider
      value={{
        isUserAuthed,
        userRole,
        userId,
        userPhoto,
        setUserRole,
        setIsLoading,
        logout,
      }}
    >
      {location.pathname !== "/auth" && location.pathname !== "/newlogin" && (
        <Header />
      )}
      <div className={classes.root}>
        <Container>
          <Switch>
            <Route exact path="/auth" component={Login} />
            <PrivateRoute
              exact
              path="/publishers"
              component={Publishers}
              allowedRoles={[ROLE_PUBLISHER]}
            />
            <PrivateRoute
              exact
              path="/mycontent"
              component={PremiumContent}
              allowedRoles={[ROLE_PUBLISHER]}
            />
            <PrivateRoute
              exact
              path="/publishers/settings"
              component={Settings}
              allowedRoles={[ROLE_PUBLISHER]}
            />
            <PrivateRoute
              exact
              path="/admin"
              component={Admin}
              allowedRoles={[ROLE_ADMIN]}
            />
            <Redirect to={redirectPath} />
          </Switch>
        </Container>
      </div>
    </AppContext.Provider>
  );
}

export default App;
