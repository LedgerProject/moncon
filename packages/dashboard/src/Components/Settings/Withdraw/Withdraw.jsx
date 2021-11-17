import { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Paper,
  makeStyles,
  Grid,
  Link,
} from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import apiService from "../../../Services/apiService.js";
import { AMOUNT_TO_DISPLAY } from "../../../Constants";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 20,
  },
  description: {
    marginBottom: 20,
  },
  balance: {
    marginTop: 30,
    marginBottom: 30,
    fontWeight: 400,
    fontSize: "1.7rem"
  },
}));

const formatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR'
})

const errorOptions = {
  appearance: "error",
  autoDismiss: true,
  autoDismissTimeout: 7000,
}

const successOptions = {
  appearance: "success",
  autoDismiss: true,
  autoDismissTimeout: 7000,
} 

const Withdraw = () => {
  const classes = useStyles();
  const [stripeAccountId, setStripeAccountId] = useState("");
  const [unpaidBalance,setUnpaidBalance] = useState(0);
  const { addToast } = useToasts();

  useEffect(() => {
    apiService.get("/publisher/account").then((response) => {
      setStripeAccountId(response?.data?.stripeAccountId);
    });
  }, []);
  useEffect(() => {
    apiService.get("/publisher/unpaid-balance").then((response) => {
      setUnpaidBalance(response?.data?.unpaidBalance);
    });
  }, []);

  const withdraw = async () => {
    
    if(!unpaidBalance){
      return addToast("You need to have a balance to withdraw",errorOptions);
    }
    
    let response;
    
    try{
      response = await apiService.post("/publisher/pay-to-stripe");
    }catch(err){
      console.log(err)
      return addToast("Some error has ocurred");
    }

    return addToast(
      `${formatter.format(AMOUNT_TO_DISPLAY(response.data.paidBalance))} has been withdrawn`,
      successOptions
    );
  }

  return (
    <Paper className={classes.root} elevation={0}>
      <Grid className={classes.description}>
        <Typography variant="h4">Withdraw your funds</Typography>
        <Typography variant="h6">
          here you can withdraw your funds to your stripe account
        </Typography>
      </Grid>
      <Grid>
      </Grid>
        <Typography variant="subtitle1" className={classes.balance}>
          Balance: {formatter.format(AMOUNT_TO_DISPLAY(unpaidBalance))}
        </Typography>
      <Grid>
        <Button
          variant="contained"
          color="primary"
          component="span"
          disabled={!stripeAccountId}
          onClick={withdraw}
        >
          {stripeAccountId ? "Withdraw" : "Create your Stripe account first"}
        </Button>
      </Grid>
    </Paper>
  );
};
export default Withdraw;
