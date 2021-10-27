import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useStyles } from "./styled";
import MonconImg from "../../Assets/img/MonconImg";
const DemoField = ({ to, path, title, field }) => {
  const classes = useStyles();
  const state = useSelector((state) => state.UserReducer[path].value);
  console.log(path)

  return (
    <>
      <div className={classes.proofContainer} style={{ marginTop: "20px" }}>
        <Link to={to} style={{ textDecoration: "none" }}>
          <h1 className={classes.proofTitle}>Proof Of ID Credential Demo</h1>
          <div className={classes.contentPersonal}>
            <Link to={to} className={classes.fab}>
              <MonconImg />
            </Link>
            <div>
              <div className={classes.proofSubtitle}>{title}</div>
              <Link
                to="/"
                className={classes.link}
                style={{ textDecoration: "none" }}
              >
                {state}
              </Link>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};
export default DemoField;
