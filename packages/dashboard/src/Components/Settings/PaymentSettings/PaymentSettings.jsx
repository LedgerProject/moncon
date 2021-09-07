import {
  Typography,
  TextField,
  Button,
  Paper,
  makeStyles,
  Grid,
  Link,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import apiService from "../../../Services/apiService.js";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 20,
  },
  description: {
    marginBottom: 20,
  },
  textField: {
    width: "60%",
  },
  expires: {
    marginTop: 20,
  },
  link: {
    fontWeight: "bold",
  },
}));

const PaymentSettings = () => {
  const classes = useStyles();
  const [stripeAccountId, setStripeAccountId] = useState("");
  const [linkExpireAt, setLinkExpireAt] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    apiService.get("/publisher/account").then((response) => {
      setStripeAccountId(response?.data?.stripeAccountId);
    });
  }, []);

  const stripeAccount = async () => {
    let account;
    if (!stripeAccountId) {
      const response = await apiService.post("/publisher/account");
      if (response.status !== 200) {
        console.log(response);
        alert("Some error has occurred in our servers");
        return;
      }
      console.log(response.data.stripeAccountId);
      account = response.data.stripeAccountId;
      setStripeAccountId(response.data.stripeAccountId);
    }
    console.log(stripeAccountId);
    console.log(account);
    const response = await apiService.post("/publisher/account-link", {
      stripeAccountId: stripeAccountId || account,
    });
    const { expires_at, url } = response.data;
    if (!expires_at || !url) {
      console.log(response);
      alert("Some error has occurred in our servers");
      return;
    }

    setLinkExpireAt(
      `your link expires at ${moment(expires_at).format("DDD/MM HH:mm")}`
    );

    setUrl(url);

    window.location.href = url;
  };

  return (
    <Paper className={classes.root} elevation={0}>
      <Grid className={classes.description}>
        <Typography variant="h6">Create your Stripe account</Typography>
        <Typography variant="subtitle2">
          Create and account on Stripe to recive your payments just clicking
          here
        </Typography>
      </Grid>
      <Grid>
        <Button
          variant="contained"
          color="primary"
          component="span"
          onClick={stripeAccount}
        >
          {stripeAccountId ? "Refresh your link" : "Create your Stripe account"}
        </Button>
        {!!url && (
          <Typography variant="subtitle2" className={classes.expires}>
            if you are not automatically redirected&nbsp;
            <Link
              href={url}
              target="_blank"
              rel="noopener"
              variant="body2"
              className={classes.link}
            >
              click here
            </Link>
          </Typography>
        )}
        {!!linkExpireAt && (
          <Typography variant="subtitle2" className={classes.expires}>
            {linkExpireAt}
          </Typography>
        )}
      </Grid>
    </Paper>
  );
};
export default PaymentSettings;
