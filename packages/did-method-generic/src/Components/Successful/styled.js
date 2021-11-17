import { makeStyles } from "@material-ui/core";
export const useStyles = makeStyles((theme) => ({
  root: {},
  done: {
    marginTop: "10px",
    fontWeight: 700,
    fontSize: "32px",
    lineHeight: "43,58px",
  },
  text: {
    marginTop: "10px",
    fontWeight: 400,
    fontSize: "18px",
    lineHeight: "24,52px",
    textAlign: "center",
  },
  link: {
    marginTop: "20px",
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "19px",
    textDecorationLine: "underline !important",
    textAlign: "center",
    color: "#000000 !important",
  },
}));
