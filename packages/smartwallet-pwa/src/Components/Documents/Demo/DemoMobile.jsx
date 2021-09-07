import React from "react";
import { useStyles } from "../styled";
import { useSelector } from "react-redux";
import MonconImg from "../../../Assets/img/MonconImg";
import Link from "../../Link";
import IconLeft from "../../../Assets/svg/IconLeft";
import { credential_mobil } from "../../../Const";

import { useHistory } from "react-router-dom";
const DemoMobile = () => {
  const classes = useStyles();
  const history = useHistory();
  const handleReturn = () => {
    if (history.length <= 2) {
      history.push("/documents");
    } else {
      history.goBack();
    }
  };

  const mobile = useSelector((state) => state.UserReducer[credential_mobil]);

  return (
    <>
      <div className={classes.contentMenu}>
        <div
          onClick={handleReturn}
          style={{ marginTop: "10px", marginRight: "15px", cursor: "pointer" }}
        >
          <IconLeft />
        </div>

        <h1 style={{ color: "#ffff" }}>Proof Of ID Credential Demo</h1>
      </div>

      <h1 className={classes.titleH1}>Issued by</h1>
      <div style={{ marginTop: "15px" }}>
        <div className={classes.proofContainerWhite}>
          <div className={classes.fabWhite}>
            <MonconImg />
          </div>
          <div>
            <div className={classes.issuedSubtitle}>Mobile Phone</div>
            <Link to="https://moncon.co/" className={classes.link}>
              https://moncon.co/
            </Link>
          </div>
        </div>
      </div>

      <h1 className={classes.titleH1}>Document details/claims</h1>
      <div
        style={{ marginTop: "15px" }}
        className={classes.documentDetailsContainer}
      >
        <div>
          <div style={{ marginLeft: "20px" }}>
            <div className={classes.documentsSubtitle}>Message</div>
            <p className={classes.documentsMessage}>{mobile.value}</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default DemoMobile;
