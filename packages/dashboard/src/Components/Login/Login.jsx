import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import {
  TextField,
  Paper,
  Button,
  Grid,
  Typography,
  ThemeProvider,
  CssBaseline,
  FormHelperText,
} from "@material-ui/core";
import ForgotPassword from './ForgotPassword/ForgotPassword';
import firebaseService from "../../Services/firebaseService";
import apiService from "../../Services/apiService";
import AppContext from "../../AppContext";
import moncon_negro from "../../Assets/Images/moncon_negro.png";
import moncon_blanco from "../../Assets/Images/moncon_blanco.png";
import FacebookLogo from "../../Assets/svg/FacebookLogo.jsx";
import GoogleLogo from "../../Assets/svg/GoogleLogo.jsx";
import { useStyles, userTheme, publisherTheme } from "./styles";
import { getRoleFromUserClaims } from "../../Services/utilsService";
import {
  LS_KEY_ROLE,
  LS_KEY_TOKEN,
  ROLES_DEFAULT_ROUTES,
  ROLE_PUBLISHER,
  ROLE_ISSUER,
} from "../../Constants";

const PROVIDER_GOOGLE = "PROVIDER_GOOGLE";
const PROVIDER_FACEBOOK = "PROVIDER_FACEBOOK";

const Login = () => {
  const classes = useStyles();
  const history = useHistory();
  const { setUserRole, setIsLoading, isUserAuthed, logout } = useContext(AppContext);
  const [userType, setUserType] = useState(localStorage.getItem(LS_KEY_ROLE));
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [error, setError] = useState(null);
  const [forgotPassword, setForgotPassword] = useState(false);

  useEffect(() => {
    localStorage.setItem(LS_KEY_ROLE, userType);
  }, [userType]);

  useEffect(() => {
    setError(window.loginError);
  }, []);

  const handleChangeLoginRegister = () => {
    setIsLogin(!isLogin);
  };

  const isLoginWithCorrectRole = (userRole) =>
    userRole === "admin" || userRole === userType;

  const handleLoginEmail = async () => {
    try {
      setIsLoading(true);
      let userCredential;
      let tokenData;
      if (isLogin) {
        userCredential = await firebaseService
          .auth()
          .signInWithEmailAndPassword(email, password);
        tokenData = await userCredential.user.getIdTokenResult();
      } else {
        if (password !== passwordRepeat) {
          throw new Error("Passwords mismatch");
        }

        userCredential = await firebaseService
          .auth()
          .createUserWithEmailAndPassword(email, password);
        const token = await userCredential.user.getIdToken();
        await apiService.post("/register/setCustomClaims", {
          token: token,
          claim: localStorage.getItem(LS_KEY_ROLE),
        });
        // Refresh token to get the user role
        tokenData = await userCredential.user.getIdTokenResult(true);
      }

      const userRole = getRoleFromUserClaims(tokenData.claims);
      if (!isLoginWithCorrectRole(userRole)) {
        throw new Error("Invalid role");
      }
      window.loginError = {};
      setUserRole(userRole);
      localStorage.setItem(LS_KEY_TOKEN, tokenData.token);
      history.push(ROLES_DEFAULT_ROUTES[userRole]);
    } catch (err) {
      console.log("nok", err.message);
      var errorMessage = err.message;
      window.loginError = {};
      window.loginError.errorMessage = errorMessage;
      window.loginError.origin = "email";
      setIsLoading(false);
      logout();
    }
  };

  const handleLoginProvider = async (providerName) => {
    const provider =
      providerName === PROVIDER_GOOGLE
        ? new firebaseService.auth.GoogleAuthProvider()
        : new firebaseService.auth.FacebookAuthProvider();

    try {
      setIsLoading(true);
      const userCredential = await firebaseService
        .auth()
        .signInWithPopup(provider);
      let tokenData;

      if (userCredential.additionalUserInfo.isNewUser) {
        const token = await userCredential.user.getIdToken();
        await apiService.post("/register/setCustomClaims", {
          token: token,
          claim: localStorage.getItem(LS_KEY_ROLE),
        });
        // Refresh token to get the user role
        tokenData = await userCredential.user.getIdTokenResult(true);
      } else {
        tokenData = await userCredential.user.getIdTokenResult();
      }

      const userRole = getRoleFromUserClaims(tokenData.claims);
      if (!isLoginWithCorrectRole(userRole)) {
        throw new Error("Invalid role");
      }
      window.loginError = {};
      setUserRole(userRole);
      localStorage.setItem(LS_KEY_TOKEN, tokenData.token);
      history.push(ROLES_DEFAULT_ROUTES[userRole]);
    } catch (err) {
      console.log("nok", err.message);
      var errorMessage = err.message;
      window.loginError = {};
      window.loginError.errorMessage = errorMessage;
      window.loginError.origin = providerName;
      setIsLoading(false);
      logout();
    }
  };

  return (
    <ThemeProvider theme={publisherTheme}>
      <CssBaseline />
      <Grid container justify="center">
        <Grid container justify="center" item xs={12}>
          <img
            src={moncon_negro}
            alt="logo"
            className={classes.logo}
          />
        </Grid>
      </Grid>
      <Grid container justify='center' className={classes.claims}>
        <Grid item xs={1}>
          <Typography 
            onClick={() => {
              setUserType(ROLE_PUBLISHER)
              setError(null)
            }} 
            variant='body2'
            className={ 
              userType === ROLE_PUBLISHER ? 
                classes.publisherButton : 
                classes.clearSwitchPublisherButton 
            }
          >
            For publisher
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography 
            onClick={() => {
              setUserType(ROLE_ISSUER)
              setError(null)
            }} 
            variant='body2'
            className={ 
              userType === ROLE_PUBLISHER ?
                classes.clearSwitchUserButton : 
                classes.userButton 
            }
          >
            For issuers
          </Typography>
        </Grid>
      </Grid>
      <ThemeProvider theme={publisherTheme}>
        <Grid container justify="center">
          <Grid item xs={4}>
            <Typography variant="h4" className={classes.title}>
              The Future of Pay
              <span className={classes.decoratedText}>walls</span>
            </Typography>
          </Grid>
          <Grid container item xs={9} justify="center" className={classes.root}>
            <Paper className={classes.paper}>
              { userType === ROLE_PUBLISHER ? !forgotPassword? (
                <>
                  <Grid container justify="center">
                    <Typography variant="subtitle1" className={classes.subTitle}>
                      {isLogin ? "Login with Email" : "Register as publisher"}
                    </Typography>
                  </Grid>
                  <Grid container justify="center">
                    <Grid item>
                      <TextField
                        label="Your email addres"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className={classes.textField}
                      />
                    </Grid>
                    <Grid container justify="center">
                      <TextField
                        label="Your password"
                        value={password}
                        type="password"
                        onChange={(event) => setPassword(event.target.value)}
                        className={classes.textField}
                      />
                    </Grid>
                    {!isLogin && (
                      <Grid container justify="center">
                        <TextField
                          label="Repeat your password"
                          value={passwordRepeat}
                          type="password"
                          onChange={(event) =>
                            setPasswordRepeat(event.target.value)
                          }
                          error={password !== passwordRepeat}
                          className={classes.textField}
                          helperText={
                            password !== passwordRepeat
                              ? "The passwords are diferent"
                              : ""
                          }
                        />
                      </Grid>
                    )}
                    <Grid container item xs={8} justify="center">
                      <FormHelperText error={error?.origin === "email"}>
                        {error?.origin === "email" && error?.errorMessage}
                      </FormHelperText>
                    </Grid>
                    <Grid container justify="center">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleLoginEmail}
                        className={classes.button}
                      >
                        {isLogin ? "Login" : "Register"}
                      </Button>
                    </Grid>
                    {isLogin && (
                      <Grid container justify="center">
                        <Typography 
                          onClick={() => setForgotPassword(true)} 
                          className={classes.labels} 
                          variant="body2"
                        >
                          Forgot your password?
                        </Typography>
                      </Grid>
                    )}
                    <Grid container justify="center">
                      <Typography
                        className={classes.labels}
                        variant="body2"
                        onClick={handleChangeLoginRegister}
                      >
                        {isLogin
                          ? "Register as publisher"
                          : "Login to your account"}
                      </Typography>
                    </Grid>
                  </Grid>
                </>
                ): <ForgotPassword close={setForgotPassword}/>
                : (
                  <>
                    <Grid container justify="center">
                      <Typography variant="subtitle1" className={classes.subTitle}>
                        Login with Email
                      </Typography>
                    </Grid>
                    <Grid container justify="center">
                      <Grid item>
                        <TextField
                          label="Your email addres"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          className={classes.textField}
                        />
                      </Grid>
                      <Grid container justify="center">
                        <TextField
                          label="Your password"
                          value={password}
                          type="password"
                          onChange={(event) => setPassword(event.target.value)}
                          className={classes.textField}
                        />
                      </Grid>
                      <Grid container item xs={8} justify="center">
                      <FormHelperText error={error?.origin === "email"}>
                        {error?.origin === "email" && error?.errorMessage}
                      </FormHelperText>
                    </Grid>
                    <Grid container justify="center">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleLoginEmail}
                        className={classes.button}
                      >
                        Login
                      </Button>
                    </Grid>
                      <Grid container justify="center">
                        <Typography 
                          onClick={() => setForgotPassword(true)} 
                          className={classes.labels} 
                          variant="body2"
                        >
                          Forgot your password?
                        </Typography>
                      </Grid>
                    </Grid>
                  </>
                )
              }
            </Paper>
            { userType === ROLE_PUBLISHER && !forgotPassword && (
                <Grid
                  container
                  justify="center"
                  className={classes.publisherProviderButtons}
                >
                  <Grid item className={classes.facebookButtonContainer}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleLoginProvider(PROVIDER_FACEBOOK)}
                      className={classes.facebookButton}
                    >
                      <FacebookLogo />
                      &nbsp; Login with Facebook
                    </Button>
                  </Grid>
                  <Grid
                    container
                    justify="center"
                    className={classes.googleButtonContainer}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleLoginProvider(PROVIDER_GOOGLE)}
                      className={classes.googleButton}
                    >
                      <GoogleLogo />
                      &nbsp; Login with Google
                    </Button>
                    <Grid container item xs={10} justify="flex-end">
                      <Grid container item xs={12} justify="center">
                        <FormHelperText
                          error={
                            error?.origin === PROVIDER_GOOGLE ||
                            error?.origin === PROVIDER_FACEBOOK
                          }
                        >
                          {error?.origin !== "email" && error?.errorMessage}
                        </FormHelperText>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )
            }
          </Grid>
        </Grid>
      </ThemeProvider>
    </ThemeProvider>
  );
};
export default Login;
