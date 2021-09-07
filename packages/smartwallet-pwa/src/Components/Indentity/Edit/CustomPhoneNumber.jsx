import React from "react";
import { withStyles } from "@material-ui/core";
import MuiPhoneNumber from "material-ui-phone-number";
const focusedColor = "rgba(255, 255, 255, 0.74) !important";
const styles = (theme) => ({
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
  countryList: {
    fontSize: "1.8rem",
    lineHeight: "24px",
    width: "100%",
    color: "#ffff !important",
    "&.Mui-focused": {
      color: "#ffff",
    },
    "& .MuiFormLabel-root": {
      color: "#ffff", // or black
    },
  },
});

function PhoneField(props) {
  const { value, defaultCountry, onChange, classes } = props;

  return (
    <React.Fragment>
      <MuiPhoneNumber
        value={value}
        data-cy="user-phone"
        defaultCountry={defaultCountry || "es"}
        onChange={onChange}
        inputClass={classes.field}
      />
    </React.Fragment>
  );
}

export default withStyles(styles)(PhoneField);
