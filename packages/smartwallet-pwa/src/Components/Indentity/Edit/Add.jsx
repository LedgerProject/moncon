import { useState } from "react";
import { useDispatch } from 'react-redux'
import { useHistory } from "react-router-dom";
import { Container, TextField,Button } from "@material-ui/core";
import { useStyles } from "./style";
import ArrowLeft from "../../../Assets/svg/ArrowLeft";
import { useToasts } from 'react-toast-notifications'
const EditAdd = () => {
 const { addToast } = useToasts();
  const classes = useStyles();
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const dispatchUserData = useDispatch()

  const handleClick = event => {
    dispatchUserData({
      type: "add-dynamic-field",
      payload: { 
      value,
      id: title.toString().toLowerCase().trim().replace(/\s+/g,"").replace(" ","-"),
      status: 'false',
      }
    });
    setTimeout(()=>{
 return history.push('/identity')

      },2500)
    addToast('Has been added successfully', { appearance: 'success',autoDismiss: true, autoDismissTimeout: 2000 });

  };

  const handleReturn = () => {
    if (history.length <= 2) {
      history.push("/identity");
    } else {
      history.goBack();
    }
  };
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
          fontWeight: 500
        }}
      >
        <Container className={classes.root}>
          <div onClick={handleReturn} className={classes.return}>
            <ArrowLeft /> <p style={{ marginLeft: "15px" }}>Return</p>{" "}
          </div>
          <h1 className={classes.title}>Add</h1>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              style={{ marginTop: "20px" }}
              InputProps={{
                className: classes.input
              }}
              id="standard-secondary"
              label="Data Name"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <br />
            <TextField
              style={{ marginTop: "20px" }}
              InputProps={{
                className: classes.input
              }}
              id="standard-secondary"
              label="Value"
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
            <br />
          </form>
<Button onClick={handleClick}
className={classes.buttonBlue}
                      variant="contained"
                      color="primary"
                      type="submit"
                
                    >
                        SAVE
                    </Button>
  
        </Container>
      </div>
    </>
  );
};
export default EditAdd;
