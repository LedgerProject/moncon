import { useState, useEffect } from "react";
import { Grid, Typography } from "@material-ui/core";
import { useStyles } from "./style";
import QrReader from "react-qr-reader";
import { useHistory } from "react-router-dom";
import IconLeft from "../../Assets/svg/IconLeft";
import { useToasts } from "react-toast-notifications";

const ReadQRCode = ({ setQrResponse, QrScan }) => {
  const classes = useStyles();
  const { addToast } = useToasts();
  const history = useHistory();
  //this is the delay between each scan
  const delay = 400;

  const handleError = (err) => {
    addToast(err.message, {
      appearance: "error",
      autoDismiss: true,
      autoDismissTimeout: 3000,
    });
  };

  const handleReturn = () => {
    if (history.length <= 2) {
      history.push("/documents");
    } else {
      history.goBack();
    }
  };

  const handleScan = (data) => {
    try {
      if (data) {
        if (process.env.NODE_ENV === "development") {
          console.log("raw data", data);
        }
        const dataParse = JSON.parse(data);
        if (process.env.NODE_ENV === "development") {
          console.log("parsed data", dataParse);
        }

        return setQrResponse(dataParse);
      }
    } catch (error) {
      console.log(error.message);
      addToast(error.message, {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 3000,
      });
      setQrResponse({});
    }
  };

  return (
    <>
      <Grid container justifyContent="center" className={classes.root}>
        <Grid
          container
          justifyContent="center"
          style={{ background: "#272727 !important" }}
        >
          {!QrScan && (
            <>
              <div className={classes.contentMenu}>
                <div
                  onClick={handleReturn}
                  style={{
                    marginTop: "18px",
                    marginRight: "12px",
                    cursor: "pointer",
                  }}
                >
                  <IconLeft />
                </div>

                <h1 style={{ color: "#ffff", fontSize: "2.2rem" }}>
                  Scan QR code
                </h1>
              </div>
              <Grid
                container
                justifyContent="center"
                className={classes.contentMenu_2}
              >
                <Typography
                  style={{
                    color: "#ffff",
                    fontSize: "2.2rem",
                    fontWeight: "normal !important",
                  }}
                >
                  To use Moncon Wallet go to the web to unlock on your computer
                </Typography>
              </Grid>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  paddingTop: "70em",
                  background: "#272727 !important",
                }}
              >
                <QrReader
                  delay={delay}
                  className={classes.previewStyle}
                  onError={handleError}
                  onScan={handleScan}
                  facingMode="environment"
                />
              </div>
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default ReadQRCode;
