import React, { useState } from "react";
import { Container, Typography } from "@material-ui/core";
import { useStyles } from "./style";
import { useHistory } from "react-router";
import Fab from "@material-ui/core/Fab";
import IconUse from ".././../Assets/svg/IconUse";
import Link from "../Link";
import ScanShare from "./ScanShare";

const ScanAuth = ({ QrResponse }) => {
  const classes = useStyles();
  const history = useHistory();
  const [scanAuth, setScanAuth] = useState(false);
  const handleReturn = () => {
    if (history.length <= 2) {
      history.push("/identity");
    } else {
      history.goBack();
    }
  };
  const handleClick = () => {
    setScanAuth(!scanAuth);
  };
  return (
    <>
      <Container style={{ display: scanAuth ? "none" : "block" }}>
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

        <div style={{ marginTop: "25px", textAlign: "center" }}>
          <p style={{ fontSize: "1.6rem" }}>Would you like to</p>
          <p style={{ fontSize: "3.4rem" }}>Lorem Ipsum</p>
          <p style={{ fontSize: "1.6rem" }}>width your SmartWallet?</p>
        </div>
        <div className={classes.appBar}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className={classes.buttonBlue} onClick={handleClick}>
              {" "}
              AUTHORIZE
            </div>
            <div className={classes.buttonBlack} onClick={handleReturn}>
              {" "}
              DENY
            </div>
          </div>
        </div>
      </Container>
      {scanAuth && <ScanShare QrResponse={QrResponse} />}
    </>
  );
};
export default ScanAuth;
