import { useState, useEffect } from "react";
import { useStyles } from "./styled";
import Fab from "@material-ui/core/Fab";
import { useToasts } from "react-toast-notifications";

import IconSecurity from "../../Assets/svg/IconSecurity";
import IconCreditCard from "../../Assets/svg/IconCreditCard";
import IconMail from "../../Assets/svg/IconMail";
import IconPrivacy from "../../Assets/svg/IconPrivacy";
import Link from "../Link";
import IconWeb from "../../Assets/svg/IconWeb";
import IconSpeaker from "../../Assets/svg/IconSpeaker";
import apiService from "../../services/apiService";
import { LS_PAYMENT_METHOD_KEY, LS_CUSTOMER_KEY } from "../../Const";

const Settings = () => {
  const classes = useStyles();

  const [card, setCard] = useState(
    window.localStorage.getItem(LS_PAYMENT_METHOD_KEY)
  );
  const { addToast } = useToasts();
  useEffect(() => {
    const paymentMethod = localStorage.getItem(LS_PAYMENT_METHOD_KEY);
    if (paymentMethod) {
      setCard(paymentMethod);
    }
  }, [card]);

  console.log(card);

  const deleteCard = async () => {
    const customer = localStorage.getItem(LS_CUSTOMER_KEY);

    if (!customer) {
      return addToast("Customer does not exist", {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 2000,
      });
    }
    try {
      const response = await apiService.post("/user/card-delete", {
        card,
        customer,
      });
      if (response.status !== 200) {
        return addToast("Somer error has ocurred", {
          appearance: "error",
          autoDismiss: true,
          autoDismissTimeout: 2000,
        });
      }
      localStorage.removeItem(LS_PAYMENT_METHOD_KEY);
      setCard(false);
    } catch (err) {
      console.log(err);
      return addToast("Somer error has ocurred", {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 2000,
      });
    }

    return addToast("Payment card has been successfully removed", {
      appearance: "success",
      autoDismiss: true,
      autoDismissTimeout: 2000,
    });
  };

  return (
    <>
      <div className={classes.root}>
        <h1 className={classes.titleH1}>Security</h1>

        <div className={classes.contentWarning}>
          <Fab
            style={{ background: "#F1A008", marginLeft: "9px" }}
            aria-label="edit"
            className={classes.fab}
          >
            <IconSecurity />
          </Fab>
          <div>
            <h1 className={classes.titleSettings}>Backup Your Identity</h1>
            <p className={classes.settingsP}>Coming Soon</p>
          </div>
        </div>

        <div>
          <h1 className={classes.titleH1}>Payment</h1>
          <div className={classes.contentSetting}>
            <Fab color="secondary" aria-label="edit" className={classes.fab}>
              <IconCreditCard />
            </Fab>
            <div>
              <h1 className={classes.titleSettings}>Credit Card</h1>

              {!!card && (
                <div
                  className={classes.buttonBlue}
                  onClick={() => deleteCard()}
                >
                  Delete
                </div>
              )}
            </div>
          </div>

          <h1 className={classes.titleH1}>Contact</h1>
          <div className={classes.contentSetting}>
            <Link
              to={`mailto:hello@moncon.co`}
              style={{ textDecoration: "none" }}
            >
              <Fab color="secondary" aria-label="edit" className={classes.fab}>
                <IconMail />
              </Fab>
            </Link>
            <div>
              <h1 className={classes.titleSettings}>Send and email</h1>
            </div>
          </div>

          <div className={classes.contentSetting}>
            <Link
              to={`https://moncon.co`}
              target={"_blank"}
              style={{ textDecoration: "none" }}
            >
              <Fab color="secondary" aria-label="edit" className={classes.fab}>
                <IconWeb />
              </Fab>
            </Link>
            <div>
              <h1 className={classes.titleSettings}>Website</h1>
            </div>
          </div>

          <div className={classes.contentSetting}>
            <Link
              to={`https://moncon.co/privacy-policy/`}
              target={"_blank"}
              style={{ textDecoration: "none" }}
            >
              <Fab color="secondary" aria-label="edit" className={classes.fab}>
                <IconPrivacy />
              </Fab>
            </Link>
            <div>
              <h1 className={classes.titleSettings}>Privacy Policy</h1>
            </div>
          </div>

          <div className={classes.contentSetting}>
            <Link
              to={`https://moncon.co/terms-of-services/`}
              target={"_blank"}
              style={{ textDecoration: "none" }}
            >
              <Fab color="secondary" aria-label="edit" className={classes.fab}>
                <IconSpeaker />
              </Fab>
            </Link>
            <div>
              <h1 className={classes.titleSettings}>Terms of service</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Settings;
