import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "./Card.css";
import {
  DialogContentText,
  DialogActions,
  Paper,
  Typography,
  Grid,
  Avatar,
  Container,
} from "@material-ui/core";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useHistory } from "react-router";
import { useToasts } from "react-toast-notifications";
import apiService from "../../services/apiService";
import { useStyles } from "./style";
import {
  AMOUNT_TO_DISPLAY,
  LS_PAYMENT_METHOD_KEY,
  LS_DID_KEY,
  LS_CUSTOMER_KEY,
} from "../../Const";
import { SpinnerPayment } from "../Loaded/Spinner";

const ScanPayment = ({ QrResponse, socket }) => {
  const stripe = useStripe();
  const classes = useStyles();
  const elements = useElements();
  const history = useHistory();
  const dispatchArticles = useDispatch();
  const [stripeError, setStripeError] = useState("");
  const [userPaymentMethod, setUserPaymentMethod] = useState(
    localStorage.getItem(LS_PAYMENT_METHOD_KEY)
  );
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState({});
  const { addToast } = useToasts();

  useEffect(() => {
    setContent(QrResponse?.content || {});
  }, [QrResponse]);

  const handleReturn = () => {
    if (history.length <= 2) {
      history.push("/identity");
    } else {
      history.goBack();
    }
  };

  const validatedPaymentResponse = (data) => {
    setLoading(false);

    if (!data.paymentValidated) {
      console.log(data.error);
      addToast("Error validating the payment", {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 3000,
      });
      return handleReturn();
    }

    addToast("Payment validated", {
      appearance: "success",
      autoDismiss: true,
      autoDismissTimeout: 3000,
    });
    const { url, image, title } = QrResponse.content;
    dispatchArticles({
      type: "add-articles",
      payload: { url, image, title },
    });

    return history.push("/articles");
  };

  useEffect(() => {
    socket.current.on("validatedPaymentResponse", validatedPaymentResponse);

    return () => {
      socket.current.off("validatedPaymentResponse", validatedPaymentResponse);
    };
  }, [socket]);

  const handleClick = async () => {
    setLoading(true);
    if (!content) {
      setLoading(false);
      addToast("empty content info", {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 3000,
      });
      return;
    }
    const { url, image, title } = content;
    //title and url of the content
    const metadata = { url, title };
    const description = "purchase of a digital article";
    const { stripeAccountId } = QrResponse;
    const { amount, currency } = content;
    let paymentId = localStorage.getItem(LS_PAYMENT_METHOD_KEY);
    let customerId = localStorage.getItem(LS_CUSTOMER_KEY);

    if (!paymentId) {
      const response = await handleSubscribe();
      if (!response) {
        addToast("error creating customer and payment method", {
          appearance: "error",
          autoDismiss: true,
          autoDismissTimeout: 3000,
        });
        return;
      }
      paymentId = response.paymentId;
      customerId = response.customerId;
    }

    if (process.env.NODE_ENV == "development") {
      console.log("data sended to /createSubscription");
      console.table({
        metadata,
        description,
        stripeAccountId,
        paymentId,
        customerId,
      });
    }

    const subscription = await apiService.post("user/createSubscription", {
      metadata,
      description,
      stripeAccountId,
      paymentId,
      customerId,
    });

    if (!subscription.data.subscriptionId) {
      console.log("ScanPayment line 82", subscription);
      setLoading(false);
      addToast("error in payment", {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 3000,
      });
    }
    if (process.env.NODE_ENV == "development") {
      console.log("data sended to /updateSubscription");
      console.table({
        subscriptionId: subscription.data.subscriptionId,
        amount,
      });
    }
    const result = await apiService.post("user/chargeSubscription", {
      subscriptionId: subscription.data.subscriptionId,
      amount,
    });

    await apiService.post("user/updateSubscription", {
      subscriptionId: subscription.data.subscriptionId,
    });

    await apiService.post("user/updateSubscription", {
      subscriptionId: subscription.data.subscriptionId,
    });

    if (process.env.NODE_ENV == "development") {
      console.log(result);
    }

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      setLoading(false);
      addToast(result.error.message, {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 3000,
      });
    } else {
      // The payment has been processed!
      // Show a success message to your customer
      // There's a risk of the customer closing the window before callback
      // execution. Set up a webhook or plugin to listen for the
      // payment_intent.succeeded event that handles any business critical
      // post-payment actions.
      console.log("PAYMENT OK");
      const userId = localStorage.getItem(LS_DID_KEY);
      let data = {
        idProvider: QrResponse.idProvider,
        idUser: socket.current.id,
        subscriptionId: subscription.data.subscriptionId,
        contentId: content.id,
        userId,
        room: QrResponse.room,
      };
      if (process.env.NODE_ENV == "development") {
        console.log("ScanPayment handleClick line 156");
        console.log("sending data to the socket");
        console.table(data);
      }
      //send event using the socket to confirm the payment
      addToast("the payment is being confirmed, this could take some time", {
        appearance: "success",
        autoDismiss: true,
        autoDismissTimeout: 3000,
      });

      socket.current.emit("payment", data);
    }
  };

  const elStyle = {
    base: {
      fontSize: "20px",
      color: "#121212",
      padding: "20px 20px",
    },
  };

  const expiredStyle = {
    base: {
      fontSize: "20px",
      color: "#121212",
    },
  };

  const handleSubscribe = async () => {
    if (!stripe || !elements) {
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumberElement,
    });

    if (error) {
      console.log("ScanPayment in line 168");
      console.log("[error]", error);
      setStripeError(error.message);
      setLoading(false);
      return;
    }

    localStorage.setItem(LS_PAYMENT_METHOD_KEY, paymentMethod.id);

    const metadata = {};

    const userId = localStorage.getItem(LS_DID_KEY);

    let customer = localStorage.getItem(LS_CUSTOMER_KEY);

    let response;
    if (!customer) {
      response = await apiService.post("/user/customer", {
        userId,
        paymentId: paymentMethod.id,
        metadata,
      });
      setLoading(true);
      if (process.env.NODE_ENV == "development") {
        console.log("ScanPayment creating customer in line 230", response);
      }
      localStorage.setItem(LS_CUSTOMER_KEY, response.data.customerId);

      if (!response.data.customerId) {
        console.log("ScanPayment in line 235");
        console.log("[error]", response.data.error);
        setLoading(false);
        setStripeError(response.data.error);
        return;
      }
    } else {
      response = await apiService.post("/user/card", {
        card: paymentMethod.id,
        customer,
      });
      if (process.env.NODE_ENV == "development") {
        console.log("ScanPayment updating customer in line 242", response);
      }
      localStorage.setItem(LS_CUSTOMER_KEY, response.data.customerId);

      if (!response.data.customerId) {
        setLoading(false);
        addToast("Somer error has ocurred", {
          appearance: "error",
          autoDismiss: true,
          autoDismissTimeout: 2000,
        });
        console.log("ScanPayment in line 256");
        console.log("[error]", response.data.error);
        setStripeError(response.data.error);
        return;
      }
    }

    setUserPaymentMethod(paymentMethod.id);

    let result = {
      customerId: response.data.customerId,
      paymentId: paymentMethod.id,
    };

    return Promise.resolve(result);
  };

  return (
    <>
      <Container style={{ marginTop: "50px", marginBottom: "10rem" }}>
        <DialogContentText className={classes.dialogContent}>
          <Grid
            variant="outlined"
            className={classes.paymentInfo}
            component="span"
          >
            <Grid container justify="center" component="span">
              <Grid
                container
                item
                xs={3}
                justify="center"
                alignItems="center"
                component="span"
              >
                <Avatar
                  alt="Remy Sharp"
                  variant="square"
                  component="span"
                  className={classes.paymentImage}
                  src={content.image}
                />
              </Grid>
              <Grid container item xs={6} lg={4} component="span">
                <Typography
                  variant="body2"
                  color="primary"
                  className={classes.paymentTitle}
                  component="span"
                >
                  {content.title}
                </Typography>
                <Typography
                  variant="caption"
                  component="span"
                  justify="left"
                  className={classes.paymentLink}
                >
                  {content.url}
                </Typography>
              </Grid>
              <Grid
                container
                item
                xs={3}
                justify="center"
                alignItems="center"
                component="span"
              >
                <Typography
                  variant="body2"
                  component="span"
                  color="primary"
                  className={classes.paymentPrice}
                >
                  {content?.amount || 0}€
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </DialogContentText>
        {!userPaymentMethod && (
          <DialogActions style={{ backgroundColor: "#fff" }}>
            <Grid container justify="center">
              <Paper elevation={0} className={classes.paper}>
                <Grid container justify="center">
                  <Grid
                    container
                    xs={12}
                    item
                    justify="center"
                    style={{ paddingTop: "20px" }}
                  >
                    <Typography
                      align="center"
                      variant="h6"
                      className={classes.textInitialPayment}
                    >
                      Add your card
                    </Typography>
                  </Grid>

                  <Grid
                    container
                    item
                    xs={12}
                    justify="center"
                    style={{ marginBottom: "10px" }}
                  >
                    <CardNumberElement
                      options={{
                        showIcon: true,
                        style: elStyle,
                        iconStyle: "solid",
                      }}
                      className="stripe-elements stripe-card"
                    />
                  </Grid>

                  <Grid container item xs={6} justify="center">
                    <CardExpiryElement
                      options={{
                        showIcon: true,
                        style: expiredStyle,
                        iconStyle: "solid",
                      }}
                      className="stripe-elements stripe-expiry"
                    />
                  </Grid>

                  <Grid container item xs={6} justify="center">
                    <CardCvcElement
                      options={{
                        showIcon: true,
                        style: expiredStyle,
                        iconStyle: "solid",
                      }}
                      className="stripe-elements stripe-expiry"
                    />
                  </Grid>
                  {stripeError && (
                    <Grid xs={12}>
                      <Typography
                        color="error"
                        variant="caption"
                        align="center"
                        display="block"
                      >
                        {stripeError}
                      </Typography>
                    </Grid>
                  )}
                  <Grid container item xs={12} justify="center"></Grid>
                </Grid>
              </Paper>
            </Grid>
          </DialogActions>
        )}
        {loading ? <SpinnerPayment /> : null}
        <div className={classes.appBar}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className={classes.buttonBlue} onClick={handleClick}>
              {" "}
              PAY NOW
            </div>

            <div className={classes.buttonBlack} onClick={handleReturn}>
              {" "}
              DENY
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ScanPayment;
