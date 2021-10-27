import { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useStyles } from "../styled";
import Link from "../../Link";
import IconLeft from "../../../Assets/svg/IconLeft";
import { credential_address } from "../../../Const";
import MonconImg from "../../../Assets/img/MonconImg";

const DemoPostal = () => {
  const classes = useStyles();
  const history = useHistory();
  const [data, setData] = useState(JSON.parse(localStorage.getItem(credential_address)));
  const address = useSelector((state) => state.UserReducer[credential_address]);

  const handleReturn = () => {
    if (history.length <= 2) {
      history.push("/documents");
    } else {
      history.goBack();
    }
  };
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
            <div className={classes.issuedSubtitle}>Postal Address</div>
            <Link
              to="https://moncon.co/"
              target={"_blank"}
              className={classes.link}
            >
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
            <p className={classes.documentsMessage}>{address.value.address}</p>
          </div>
        </div>
      </div>
      <div
        style={{ marginTop: "15px" }}
        className={classes.documentDetailsContainer}
      >
        <div>
          <div style={{ marginLeft: "20px" }}>
            <div className={classes.documentsSubtitle}>credential hash</div>
            <p className={classes.documentsMessage}>{data.hash}</p>
          </div>
        </div>
      </div>
      <div
        style={{ marginTop: "15px" }}
        className={classes.documentDetailsContainer}
      >
        <div>
          <div style={{ marginLeft: "20px" }}>
            <div className={classes.documentsSubtitle}>sawtooth transaction id</div>
            <p className={classes.documentsMessage}>{data.my_credential_signature_id}</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default DemoPostal;
