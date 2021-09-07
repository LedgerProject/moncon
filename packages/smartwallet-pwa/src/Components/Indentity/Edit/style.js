import { makeStyles } from "@material-ui/core";
const focusedColor = "rgba(255, 255, 255, 0.74)";
export const useStyles = makeStyles((theme) => ({
  root: {
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
  field: {
    "& .MuiInputBase-input": {
      color: "#ffff !important",
      fontSize: "1.8rem !important",
    },
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

  return: {
    color: "#ffff",
    display: "flex",
    textAlign: "left",
    marginTop: "15px",
    cursor: "pointer",
    marginLeft: "15px",
    fontSize: "1.6rem",
  },
  buttonBlue: {
    margin: "30px",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: 600,
    padding: "12px 31px 14px",
    background: "#03DAC5",
    color: "#fff",
    cursor: "pointer",
    "@media screen and (max-width: 800px)": {
      margin: "30px 100px",
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

  link: {
    fontSize: "14px",
    lineHeight: "20px",
    color: "#00C4B4 !important",
  },

  proofSubtitle: {
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "24px",
    color: "rgba(255, 255, 255, 0.84)",
    paddingTop: "10px",
  },

  title: {
    marginLeft: "15px",
    fontWeight: "bold",
    fontSize: "2rem",
    marginTop: "40px",
    lineHeight: "24px",
    color: "#ffff",
  },
  input: {
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
