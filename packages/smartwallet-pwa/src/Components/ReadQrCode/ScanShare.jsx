import { useEffect } from "react";
import { Fab, Container, Typography } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { useStyles } from "./style";
import { useToasts } from "react-toast-notifications";
import Check from "../../Assets/svg/Check";
import IconEdit from "../../Assets/svg/IconEdit";
import MonconImg from "../../Assets/img/MonconImg";

const ScanShare = ({ QrResponse, socket, setCredential_verified }) => {
  const classes = useStyles();
  const history = useHistory();
  const { addToast } = useToasts();
  const dispatchArticles = useDispatch();

  const handleDeny = () => {
    addToast("Deny", {
      appearance: "error",
      autoDismiss: true,
      autoDismissTimeout: 3000,
    });
    return handleReturn();
  };

  const handleReturn = () => {
    if (history.length <= 2) {
      history.push("/identity");
    } else {
      history.goBack();
    }
  };

  const validatedCredentialResponse = (data) => {
    if (data.validated) {
      addToast("Credential validated", {
        appearance: "success",
        autoDismiss: true,
        autoDismissTimeout: 3000,
      });

      if (QrResponse.type === "request_credential") {
        const { url, image, title } = QrResponse.content;
        dispatchArticles({
          type: "add-articles",
          payload: { url, image, title },
        });
        return history.push("/articles");
      }

      return setCredential_verified(true);
    } else {
      addToast("Credential in not valid", {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 3000,
      });
      return handleReturn();
    }
  };

  useEffect(() => {
    socket.current.on(
      "validatedCredentialResponse",
      validatedCredentialResponse
    );

    return () => {
      socket.current.off(
        "validatedCredentialResponse",
        validatedCredentialResponse
      );
    };
  }, [socket]);

  const handleClick = () => {
    let data = QrResponse;
    const credential = JSON.parse(localStorage.getItem(data.request));
    if (!credential) {
      if (process.env.NODE_ENV == "development") {
        console.log("data.request in ScanShare in handleClick", data.request);
      }
      addToast("Credential does not exist", {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 3000,
      });
      return handleReturn();
    }
    data.idUser = socket.current.id;
    data.credential = credential;
    if (process.env.NODE_ENV == "development") {
      console.log("Sending credential in ScanShare in line 93", data);
    }
    socket.current.emit("webCredentialRequest", data);

    addToast(
      "Credential sent, waiting for response, this could take some time",
      {
        appearance: "success",
        autoDismiss: true,
        autoDismissTimeout: 3000,
      }
    );
  };

  return (
    <>
      <Container>
        <h1 className={classes.titleH1}>Service</h1>
        <div style={{ marginTop: "15px" }}>
          <div className={classes.serviceContainerWhite}>
            <div className={classes.fabWhite}>
              <MonconImg />
            </div>
            <div>
              <Typography
                variant="body1"
                className={classes.serviceSubtitleBlack}
              >
                {QrResponse.hostname}
              </Typography>
            </div>
          </div>
        </div>

        <h1 className={classes.titleH1}>
          This service is asking you to share the following claims:
        </h1>
        <div className={classes.contentPersonal}>
          <Fab color="secondary" aria-label="edit" className={classes.fab}>
            <IconEdit />
          </Fab>
          <div
            style={{
              flexGrow: 1,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              alignItems: "center",
            }}
          >
            <div>
              <p className={classes.titleName}>{QrResponse.request}</p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginRight: "20px",
              }}
            >
              <div className={classes.check}>
                <Check />
              </div>
            </div>
          </div>
        </div>

        <div className={classes.appBar}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className={classes.buttonBlue} onClick={handleClick}>
              SEND CREDENTIAL
            </div>
            <div className={classes.buttonBlack} onClick={handleDeny}>
              {" "}
              DENY
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};
export default ScanShare;
