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
import { credential_address } from "../../../Const";

const EditPostal = () => {
  const classes = useStyles();
  const { addToast } = useToasts();
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const history = useHistory();
  const dispatchUserData = useDispatch();

  const handleClick = (event) => {
    event.preventDefault();
    let payload = { value: {}, id: credential_address, status: "false" };
    if (addressLine1.trim()) {
      payload.value.addressLine1 = addressLine1.trim();
    }
    if (addressLine2.trim()) {
      payload.value.addressLine2 = addressLine2.trim();
    }
    if (postalCode.trim()) {
      payload.value.postalCode = postalCode;
    }
    if (country.trim()) {
      payload.value.country = country;
    }
    if (city.trim()) {
      payload.value.city = city;
    }
    if (
      addressLine1.trim() ||
      addressLine2.trim() ||
      country.trim() ||
      city.trim()
    ) {
      payload.value.address =
        `${addressLine1.trim()} ${addressLine2.trim()} ${city} ${country}`.trim();
    }

    if (localStorage.hasOwnProperty("credential_address"))
      localStorage.removeItem("credential_address");

    dispatchUserData({
      type: "update",
      payload,
    });

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
                        key={region.shortCode}
                      >
                        {region.name}
                      </MenuItem>
                    ))
                  : []}
              </Select>
            </FormControl>
            <br />
            <TextField
              style={{ marginTop: "20px" }}
              InputProps={{
                className: classes.input,
              }}
              value={addressLine1}
              onChange={(event) => setAddressLine1(event.target.value)}
              id="standard-secondary"
              label="Address Line 1"
            />
            <br />
            <TextField
              style={{ marginTop: "20px" }}
              InputProps={{
                className: classes.input,
              }}
              value={addressLine2}
              onChange={(event) => setAddressLine2(event.target.value)}
              id="standard-secondary"
              label="Address Line 2"
            />
            <br />
            <TextField
              style={{ marginTop: "20px" }}
              InputProps={{
                className: classes.input,
              }}
              value={postalCode}
              onChange={(event) => setPostalCode(event.target.value)}
              id="standard-secondary"
              label="Postal Code"
            />
            <br />
            <Button
              onClick={handleClick}
              className={classes.buttonBlue}
              variant="contained"
              color="primary"
              type="submit"
            >
              ADD CLAIM
            </Button>
          </form>
        </Container>
      </div>
    </>
  );
};
export default EditPostal;
