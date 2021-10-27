import { useEffect, lazy, Suspense, useState, useRef } from "react";
import {
  Route,
  Switch,
  useLocation,
  useHistory,
  Redirect,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import io from "socket.io-client";
import didMethod from 'did-method-generic';
import { makeStyles } from "@material-ui/core/styles";
import PWAPrompt from 'react-ios-pwa-prompt'
import { useToasts } from "react-toast-notifications";
import Badge from "@material-ui/core/Badge";
import Header from "./Components/Header";
import BackupQuestions from './Components/BackupQuestions';
import ScanShare from "./Components/ReadQrCode/ScanShare";
import SwUpdater from "./SwUpdater";
import Spinner from "./Components/Loaded/Spinner";
import Article from "./Components/Article";
import {
  NOT_DISPAY_HEADER_IN,
  LS_USER_KEY,
  LS_DID_KEY,
  initialState,
  LS_KEY_PAIR,
} from "./Const";
import { updateCredential, getPendingResponses } from './services/SocketUtils';
import { ContextProvider } from "./AppContext";
import "./App.css";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(2),
      background: "#f50057",
      color: "#fff",
      borderRadius: "9999px",
      padding: "0px 15px",
      fontSize: "1.4rem",
      right: "0",
      marginTop: "20px",
      zIndex: "10",
      position: "fixed",
      fontWeight: 700,
    },
  },
  lowConnection: {
    "& > *": {
      margin: theme.spacing(2),
      background: "#ff9800",
      color: "#fff",
      borderRadius: "9999px",
      padding: "0px 15px",
      fontSize: "1.4rem",
      right: "0",
      marginTop: "20px",
      zIndex: "10",
      position: "fixed",
      fontWeight: 700,
    },
  },
}));

const ReactLazyPreload = (importStatement) => {
  const Component = lazy(importStatement);
  Component.preload = importStatement;
  return Component;
};

const EditField = ReactLazyPreload(() =>
  import("./Components/Indentity/Edit/EditField")
);
const DemoEmail = ReactLazyPreload(() =>
  import("./Components/Documents/Demo/DemoEmail")
);
const DemoPostal = ReactLazyPreload(() =>
  import("./Components/Documents/Demo/DemoPostal")
);
const DemoDateBirth = ReactLazyPreload(() =>
  import("./Components/Documents/Demo/DemoDateBirth")
);
const DemoDinamycs = ReactLazyPreload(() =>
  import("./Components/Documents/Demo/DemoDinamycs")
);
const EditAdd = ReactLazyPreload(() =>
  import("./Components/Indentity/Edit/Add")
);
const Identity = ReactLazyPreload(() =>
  import("./Components/Indentity/Indentity")
);
const Documents = ReactLazyPreload(() => import("./Components/Documents"));
const Settings = ReactLazyPreload(() =>
  import("./Components/Settings/Settings")
);
const ImportBackup = ReactLazyPreload(() =>
  import("./Components/Settings/ImportBackup")
);
const Scan = ReactLazyPreload(() => import("./Components/Scan"));
const DemoMobile = ReactLazyPreload(() =>
  import("./Components/Documents/Demo/DemoMobile")
);
const EditName = ReactLazyPreload(() =>
  import("./Components/Indentity/Edit/EditName")
);
const EditEmail = ReactLazyPreload(() =>
  import("./Components/Indentity/Edit/EditEmail")
);
const EditMobile = ReactLazyPreload(() =>
  import("./Components/Indentity/Edit/EditMobile")
);
const EditPostal = ReactLazyPreload(() =>
  import("./Components/Indentity/Edit/EditPostal")
);
const EditDateBirth = ReactLazyPreload(() =>
  import("./Components/Indentity/Edit/EditDateBirth")
);

function useOnlineStatus() {
  const [online, setOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    function handleOnline() {
      setOnline(true);
    }

    function handleOffline() {
      setOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return online;
}

function App() {
  const online = useOnlineStatus();
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const { addToast } = useToasts();
  const classes = useStyles();
  const credentialSocketRef = useRef();
  const svc = [
    {
      "id": "#linkedin",
      "type": "linkedin",
      "serviceEndpoint": "https://www.linkedin.com/company/infinitelabs-co"
    },
    {
      "id": "#gitlab",
      "type": "gitlab",
      "serviceEndpoint": "https://gitlab.com/infinite-labs"
    }
  ]
  const didHandler  = didMethod.driver({method:'moncon',service:svc})


  useEffect(() => {
    history.listen((location, action) => {
      // check for sw updates on page change
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => regs.forEach((reg) => reg.update()));
    });
  }, [history]);

  const handleUpdateServiceWorker = () => {
    navigator.serviceWorker.getRegistrations().then((regs) =>
      regs.forEach((reg) => {
        reg.waiting.postMessage({ type: "SKIP_WAITING" });
      })
    );
  };

  useEffect(() => {
    if (online === false) {
      addToast("No internet connection", {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 6000,
      });
      addToast("Refresh the browser when the connection returns", {
        appearance: "info",
        autoDismiss: true,
        autoDismissTimeout: 6000,
      });
    }
  }, [addToast, online]);

  useEffect(() => {
    const userId = localStorage.getItem(LS_DID_KEY);
    if (!userId) {
      const setUserId = async () => {
        let id = (await didHandler.generate()).id;
        localStorage.setItem(LS_DID_KEY, id);
      }
      setUserId()
    }
    const lsData = localStorage.getItem(LS_USER_KEY);
    if (!lsData) {
      const parsedState = JSON.stringify(initialState);
      localStorage.setItem(LS_USER_KEY, parsedState);
    }
  }, []);

  useEffect(() => {
    const lsData = JSON.parse(localStorage.getItem(LS_USER_KEY));
    if (lsData) {
      dispatch({
        payload: lsData,
        type: "load_store_data",
      });
    }
  }, [dispatch]);


  useEffect(() => {
    credentialSocketRef.current = io(process.env.REACT_APP_MONCON_URL_SOCKET);
    credentialSocketRef.current.on("connect", () => {
      console.log(credentialSocketRef.current.id);
      let userId = localStorage.getItem(LS_DID_KEY);
      if (!userId) {
        return
      }
      credentialSocketRef.current.emit('subscribeToCredentialRequestStatus',{userId});
      credentialSocketRef.current.on("updateCredentialStatus", (data) => {
        updateCredential(data,credentialSocketRef,dispatch,addToast)
      });
    });
    console.log('updateCredential useEffect')
    return () => {
      credentialSocketRef.current.on("disconnect", () => {
        console.log("disconnect");
        credentialSocketRef.current.off("updateCredentialStatus", (data) => {
          updateCredential(data,credentialSocketRef,dispatch,addToast)
        });
      });
    };
  }, []);

  useEffect(() => {
    let userId = localStorage.getItem(LS_DID_KEY);
    if (!userId) {
      return
    }
    console.log('getPendingResponses useEffect')
    getPendingResponses(userId,credentialSocketRef,dispatch,addToast)

  }, []);

  return (
    <div>
      <div id="new-updates">
        <SwUpdater onClick={handleUpdateServiceWorker} />
      </div>

      <div className={classes.root}>
        {online === false && (
          <Badge>
            <span>Offline</span>
          </Badge>
        )}
      </div>

      <Switch>
        <ContextProvider
          value={{
            EditName,
            EditEmail,
            EditMobile,
            EditPostal,
            EditAdd,
          }}
        >
          <Redirect to="/identity" />

          <Route exact path="/identity">
            <Suspense fallback={<Spinner />}>
              <Identity />
            </Suspense>
          </Route>

          <Route exact path="/identity/edit/name">
            <Suspense fallback={<Spinner />}>
              <EditName />
            </Suspense>
          </Route>

          <Route exact path="/identity/edit/email">
            <Suspense fallback={<Spinner />}>
              <EditEmail />
            </Suspense>
          </Route>

          <Route exact path="/identity/edit/mobile">
            <Suspense fallback={<Spinner />}>
              <EditMobile />
            </Suspense>
          </Route>

          <Route exact path="/identity/edit/postal">
            <Suspense fallback={<Spinner />}>
              <EditPostal />
            </Suspense>
          </Route>

          <Route exact path="/identity/edit/datebirth">
            <Suspense fallback={<Spinner />}>
              <EditDateBirth />
            </Suspense>
          </Route>

          <Route exact path="/identity/add/field">
            <Suspense fallback={<Spinner />}>
              <EditAdd />
            </Suspense>
          </Route>

          <Route exact path="/credentials">
            <Suspense fallback={<Spinner />}>
              <Documents />
            </Suspense>
          </Route>

          <Route exact path="/scan">
            <Suspense fallback={<Spinner />}>
              <Scan />
            </Suspense>
          </Route>

          <Route exact path="/articles">
            <Suspense fallback={<Spinner />}>
              <Article />
            </Suspense>
          </Route>

          <Route exact path="/settings">
            <Suspense fallback={<Spinner />}>
              <Settings />
            </Suspense>
          </Route>

          <Route exact path="/settings/import-backup">
            <Suspense fallback={<Spinner />}>
              <ImportBackup />
            </Suspense>
          </Route>

          <Route path="/identity/edit/field/:fieldId">
            <Suspense fallback={<Spinner />}>
              <EditField />
            </Suspense>
          </Route>

          <Route path="/documents/demo/field/:fieldId">
            <Suspense fallback={<Spinner />}>
              <DemoDinamycs />
            </Suspense>
          </Route>

          <Route path="/documents/demo/email">
            <Suspense fallback={<Spinner />}>
              <DemoEmail />
            </Suspense>
          </Route>

          <Route exact path="/documents/demo/mobile">
            <Suspense fallback={<Spinner />}>
              <DemoMobile />
            </Suspense>
          </Route>

          <Route exact path="/documents/demo/datebirth">
            <Suspense fallback={<Spinner />}>
              <DemoDateBirth />
            </Suspense>
          </Route>

          <Route exact path="/documents/demo/postal">
            <Suspense fallback={<Spinner />}>
              <DemoPostal />
            </Suspense>
          </Route>
        </ContextProvider>
      </Switch>
      <PWAPrompt />
      {!NOT_DISPAY_HEADER_IN.includes(location.pathname) && <Header />}
      <BackupQuestions/>
    </div>
  );
}

export default App;
