import { useState } from "react";
import { Button, Snackbar, makeStyles } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  button: {
    borderRadius: 8,
  },
}));

const ButtonSnackbar = ({ status, children, successMessage, errorMessage }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [succes, setSucces] = useState(true);

  const handleClick = () => {
    status()
      .then(() => {
        setOpen(true);
      })
      .catch(() => {
        setSucces(false);
        setOpen(true);
      });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    setSucces(true);
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        component="span"
        onClick={handleClick}
      >
        {children}
      </Button>
      <Snackbar open={open} autoHideDuration={3 * 1000} onClose={handleClose}>
        {succes ? (
          <Alert onClose={handleClose} severity="success">
            {successMessage}
          </Alert>
        ) : (
          <Alert onClose={handleClose} severity="error">
            {errorMessage}
          </Alert>
        )}
      </Snackbar>
    </div>
  );
};

export default ButtonSnackbar;
