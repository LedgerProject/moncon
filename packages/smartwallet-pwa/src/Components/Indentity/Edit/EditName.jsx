import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, TextField, Button } from "@material-ui/core";
import { useStyles } from "./style";
import { useHistory } from "react-router";
import ArrowLeft from "../../../Assets/svg/ArrowLeft";
import { useToasts } from "react-toast-notifications";

const EditName = () => {
  const classes = useStyles();
  const { addToast } = useToasts();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const history = useHistory();
  const dispatchUserData = useDispatch();
  const nameValue = useSelector((state) => state.UserReducer.name.value);
  const lastNameValue = useSelector(
    (state) => state.UserReducer.lastName.value
  );

  const handleReturn = () => {
    if (history.length <= 2) {
      history.push("/identity");
    } else {
      history.goBack();
    }
  };

  const handleClick = (event) => {
    event.preventDefault();
    if (name === nameValue && lastName === lastNameValue) {
      addToast("No changes have been made", {
        appearance: "warning",
        autoDismiss: true,
        autoDismissTimeout: 2000,
      });
    } else {
      dispatchUserData({
        type: "update",
        payload: { id: "name", value: name, status: false, pending:false },
      });

      dispatchUserData({
        type: "update",
        payload: { id: "lastName", value: lastName, status: false, pending:false },
      });

      setTimeout(() => {
        return history.push("/identity");
      }, 500);
      addToast("Has been added successfully", {
        appearance: "success",
        autoDismiss: true,
        autoDismissTimeout: 2000,
      });
    }
  };

  useEffect(() => {
    setName(nameValue);
  }, [nameValue]);

  useEffect(() => {
    setLastName(lastNameValue);
  }, [lastNameValue]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          color: "rgba(0, 0, 0, 0.6)",
          fontSize: "20px",
          background: "#272727",
          fontWeight: 500,
        }}
      >
        <Container className={classes.root}>
          <div onClick={handleReturn} className={classes.return}>
            <ArrowLeft /> <p style={{ marginLeft: "15px" }}>Return</p>
          </div>
          <h1 className={classes.title}>Name</h1>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              style={{ marginTop: "20px" }}
              InputProps={{
                className: classes.input,
              }}
              value={name}
              onChange={(event) => setName(event.target.value)}
              id="standard-secondary"
              label="Give Name"
            />
            <br />
            <TextField
              style={{ marginTop: "20px" }}
              InputProps={{
                className: classes.input,
              }}
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              id="standard-secondary"
              label="Family Name"
            />
          </form>
          <Button
            onClick={handleClick}
            className={classes.buttonBlue}
            variant="contained"
            color="primary"
            type="submit"
          >
            ADD CLAIM
          </Button>
        </Container>
      </div>
    </>
  );
};
export default EditName;
