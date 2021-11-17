import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import {
  Container,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { useStyles } from "./style";
import { useToasts } from "react-toast-notifications";
import ArrowLeft from "../../../Assets/svg/ArrowLeft";
import DataCountries from "../../../Data/countries";
import { credential_region } from "../../../Const";

const EditRegion = () => {
  const classes = useStyles();
  const { addToast } = useToasts();
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const history = useHistory();
  const dispatchUserData = useDispatch();

  const handleClick = (event) => {
    event.preventDefault();


    if (localStorage.hasOwnProperty("credential_region")){
      localStorage.removeItem("credential_region");
    }

    if(country.trim() && city.trim()){
      const payload = { value: `${country}--${city}`, id: credential_region, status: false, pending:false };
      dispatchUserData({
        type: "update",
        payload,
      });
    }


    setTimeout(() => {
      return history.push("/identity");
    }, 500);
    addToast("Has been added successfully", {
      appearance: "success",
      autoDismiss: true,
      autoDismissTimeout: 2000,
    });
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
          fontWeight: 500,
        }}
      >
        <Container className={classes.root}>
          <div onClick={handleReturn} className={classes.return}>
            <ArrowLeft /> <p style={{ marginLeft: "15px" }}>Return</p>
          </div>
          <h1 className={classes.title}>Postal Address</h1>
          <form
            onSubmit={handleClick}
            className={classes.root}
            noValidate
            autoComplete="off"
          >
            <FormControl style={{ margin: "30px 0px" }}>
              <InputLabel
                className={classes.field}
                id="demo-simple-select-label"
              >
                Country
              </InputLabel>
              <Select
                inputClass={classes.field}
                style={{ width: "230px" }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={country}
                onChange={(event) => setCountry(event.target.value)}
              >
                {DataCountries.map((country) => (
                  <MenuItem
                    className={classes.field}
                    value={country.countryName}
                    key={country.countryShortCode}
                  >
                    {country.countryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <br />
            <FormControl>
              <InputLabel id="demo-simple-select-label">Region</InputLabel>
              <Select
                className={classes.formControl}
                style={{ width: "230px" }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                disabled={!country}
              >
                {country
                  ? DataCountries.find(
                      ({ countryName }) => countryName === country
                    ).regions.map((region) => (
                      <MenuItem
                        InputProps={{
                          className: classes.input,
                        }}
                        value={region.name}
                        key={region.name}
                      >
                        {region.name}
                      </MenuItem>
                    ))
                  : []}
              </Select>
            </FormControl>
            <br />
            <Button
              onClick={handleClick}
              className={classes.buttonBlue}
              variant="contained"
              color="primary"
              type="submit"
            >
              ADD DATA
            </Button>
          </form>
        </Container>
      </div>
    </>
  );
};
export default EditRegion;