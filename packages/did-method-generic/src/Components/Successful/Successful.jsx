import React from "react";
import { useStyles } from "./styled";
import Check from "../../Assets/svg/Check";
import { Typography, Box } from "@material-ui/core";
import Link from "../Link/Link";

const Successful = ({ previewUrl }) => {
  const classes = useStyles();

  return (
    <>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Check />
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Typography className={classes.done}>Done!</Typography>
      </Box>

      <Box display="flex" justifyContent="center" alignItems="center">
        <Typography className={classes.text}>
          Your content is already locked for user who pay and meet the
          conditions
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Link to={previewUrl.url} target={"_blank"} className={classes.link}>
          {previewUrl.url}
        </Link>
      </Box>
      <Box style={{ marginTop: "10px", cursor: "pointer" }}>
        <Link to="/mycontent">Regresar</Link>
      </Box>
    </>
  );
};
export default Successful;
