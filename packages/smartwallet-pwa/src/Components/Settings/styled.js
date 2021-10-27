import { makeStyles } from "@material-ui/core";
const focusedColor = "rgba(255, 255, 255, 0.74)";

export const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    boxSizing: "border-box",
    margin: "0",
    padding: 0,
    position: "relative",
    marginBottom: "4rem",
  },
  titleH1: {
    marginLeft: "15px",
    fontWeight: 500,
    fontSize: "2.4rem",
    lineHeight: "24px",
    marginTop: "40px",
    textAlign: "center",
    "@media screen and (max-width: 800px)": {
      textAlign: "left",
      fontWeight: 400,
      fontSize: "1.6rem",
      lineHeight: "24px",
      paddingTop: "10px",
    },
  },
  buttonBlue: {
    margin: "20px 0px",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: 600,
    padding: "12px 31px 14px",
    background: "rgb(25, 25, 25)",
    color: "#fff",
    cursor: "pointer",
    "@media screen and (max-width: 800px)": {
      borderRadius: "4px",
      fontSize: "14px",
      fontWeight: 600,
      padding: "12px 31px 14px",
      color: "#fff",
      cursor: "pointer",
    },
    "&:hover": {
      backgroundColor: "rgba(51,51,51,1)",
      boxShadow: "none",
    },
  },
  contentWarning: {
    marginTop: "15px",
    background: "#F1A008",
    display: "flex",
    textAlign: "left",
    margin: "0px 220px",
    padding: "10px 10px",
    flexDirection: "row",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    "@media screen and (max-width: 800px)": {
      margin: "0px 0px",
      padding: "10px 10px",
    },
  },
  fab: {
    boxShadow: "none",
    marginLeft: "10px",
    marginRight: "10px",
    display: "flex",
  },
  contentSetting: {
    marginTop: "3px",
    background: "#ffff",
    margin: "0px 220px",
    padding: "10px 10px",
    display: "flex",
    textAlign: "left",
    flexDirection: "row",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    "@media screen and (max-width: 800px)": {
      margin: "0px 0px",
      padding: "0px 0px",
    },
  },
  settingsP: {
    fontSize: "1.6rem",
    color: "rgba(0, 0, 0, 0.6)",
    "@media screen and (max-width: 800px)": {
      fontSize: "1.4rem",
    },
  },
  titleSettings: {
    color: "rgba(0, 0, 0, 0,6)",
    marginTop: "15px",
    fontWeight: "normal",
    fontSize: "1.8rem",
    lineHeight: "24px",
    "@media screen and (max-width: 800px)": {
      fontSize: "1.6rem",
    },
  },
  name: {
    fontSize: "1.6rem",
    lineHeight: "24px",
    letter: "0.15px",
  },
  mnemonicRoot: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    boxSizing: "border-box",
    margin: "0",
    padding: 0,
    background: "#272727",
    position: "relative",

    "& label.Mui-focused": {
      color: focusedColor,
    },

    "& .MuiInput-underline:after": {
      borderBottomColor: focusedColor,
    },
    "& .MuiInput-underline:before": {
      borderBottomColor: focusedColor,
    },
    "& .MuiFilledInput-underline:after": {
      borderBottomColor: focusedColor,
    },

    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: focusedColor,
      },
    },
    "&.Mui-focused": {
      color: "rgba(255, 255, 255, 0.74)",
    },
    "& .MuiFormLabel-root": {
      color: "rgba(255, 255, 255, 0.74)",
      fontSize: "1.6rem",
    },
  },
  mnemonicReturn: {
    color: "#ffff",
    display: "flex",
    textAlign: "left",
    marginTop: "15px",
    cursor: "pointer",
    marginLeft: "15px",
    fontSize: "1.6rem",
  },
  mnemonicButtonBlue: {
    margin: "30px",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: 600,
    padding: "12px 31px 14px",
    background: "#03DAC5",
    color: "#fff",
    cursor: "pointer",
    "@media screen and (max-width: 800px)": {
      margin: "20px 100px",
      borderRadius: "4px",
      fontSize: "14px",
      fontWeight: 600,
      padding: "12px 31px 14px",
      background: "#03DAC5",
      color: "#fff",
      cursor: "pointer",
    },
    "&:hover": {
      backgroundColor: "#03C1AE",
      boxShadow: "none",
    },
  },

  mnemonicInput: {
    fontSize: "1.8rem !important",
    lineHeight: "24px !important",
    width: "100% !important",
    color: "#ffff !important",
    "&.Mui-focused": {
      color: "#ffff !important",
    },
    "& .MuiFormLabel-root": {
      color: "#ffff !important", // or black
    },
    "& .MuiSvgIcon-root": {
      color: "#ffff !important",
    },
  },

}));
