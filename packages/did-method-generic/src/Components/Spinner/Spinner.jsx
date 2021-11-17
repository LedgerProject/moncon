import React from "react";
import {
  Backdrop,
  CircularProgress,
  makeStyles,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const Spinner = ({ open, message = "" }) => {
  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open={open}>
      <CircularProgress color="inherit" />
      {message && (
        <Typography variant="body2" style={{ marginLeft: 8 }}>
          {message}
        </Typography>
      )}
    </Backdrop>
  );
};

export default Spinner;
