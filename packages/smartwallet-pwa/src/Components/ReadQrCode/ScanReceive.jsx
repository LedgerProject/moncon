import React, { useState } from "react";
import { Container, Typography } from "@material-ui/core";
import { useStyles } from "./style";
import { useHistory } from "react-router";
import Checkbox from "@material-ui/core/Checkbox";
import Fab from "@material-ui/core/Fab";
import IconUse from ".././../Assets/svg/IconUse";
import Link from "../Link";
import clsx from "clsx";

import ScanAuth from "./ScanAuth";

const ScanReceive = ({ QrResponse, socket }) => {
  const classes = useStyles();
  const history = useHistory();
  const [receive, setReceive] = useState(false);

  const handleReturn = () => {
    if (history.length <= 2) {
      history.push("/identity");
    } else {
      history.goBack();
    }
  };
  const handleClick = () => {
    let data = {
      idProvider: "ClGLRW0zOt62BUywAAA5",
      idUser: socket.current.id,
      hostnama: "localhost",
      request: "credential_birthday",
    };

    const validate = localStorage.hasOwnProperty(data.request);

    if (!validate) {
      return alert("credential fail");
    }
    const credential = JSON.parse(localStorage.getItem(data.request));
    data.credential = credential;

    socket.current.emit("webCredentialRequest", data);

    setReceive(!receive);
  };
  return (
    <>
      <Container style={{ display: receive ? "none" : "block" }}>
        <h1 className={classes.titleH1}>Service</h1>
        <div style={{ marginTop: "15px" }}>
          <div className={classes.serviceContainerWhite}>
            <Fab aria-label="edit" className={classes.fabWhite}>
              <IconUse />
            </Fab>
            <div>
              <Typography
                variant="body1"
                className={classes.serviceSubtitleBlack}
              >
                Demo Offline
              </Typography>
              <Link target={"_blank"} to={QrResponse} className={classes.link}>
                {QrResponse}
              </Link>
            </div>
          </div>
        </div>

        <h1 className={classes.titleH1}>
          Choose one or more documents provided by this service and we will
          generate them for you.
        </h1>

        <div style={{ marginTop: "15px" }} className={classes.serviceContainer}>
          <div style={{ display: "flex" }}>
            <Typography variant="body1" className={classes.serviceTitle}>
              Proof Of ID Credential Demo
            </Typography>
            <Checkbox
              className={classes.root}
              disableRipple
              color="default"
              checkedIcon={
                <span className={clsx(classes.icon, classes.checkedIcon)} />
              }
              icon={<span className={classes.icon} />}
              inputProps={{ "aria-label": "decorative checkbox" }}
            />
          </div>
          <div className={classes.contentService}>
            <Fab
              style={{ marginLeft: "12px", marginRight: "14px" }}
              aria-label="edit"
              className={classes.fab}
            >
              <IconUse />
            </Fab>
            <div>
              <Typography variant="body1" className={classes.serviceSubtitle}>
                Demo Offline
              </Typography>
              <Link to={QrResponse} className={classes.link}>
                {QrResponse}
              </Link>
            </div>
          </div>
        </div>
        <div className={classes.appBar}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div onClick={handleClick} className={classes.buttonBlue}>
              {" "}
              RECEIVE
            </div>
            <div className={classes.buttonBlack} onClick={handleReturn}>
              {" "}
              DENY
            </div>
          </div>
        </div>
      </Container>
      {receive && <ScanAuth QrResponse={QrResponse} />}
    </>
  );
};
export default ScanReceive;
