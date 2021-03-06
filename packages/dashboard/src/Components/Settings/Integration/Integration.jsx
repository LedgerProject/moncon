import { useContext } from "react";
import { Typography, Paper, Button, makeStyles } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import AppContext from "../../../AppContext";

const useStyles = makeStyles(() => ({
  root: {
    padding: 20,
  },
  scripts: {
    width: "100%",
    overflow: "auto",
    marginBottom: 20,
  },
  description: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#e8e8e8",
  },
}));

const Integration = () => {
  const classes = useStyles();
  const { userId } = useContext(AppContext);
  const { addToast } = useToasts();

  const scripts = `<link rel="stylesheet" href="${process.env.REACT_APP_MONCON_CDN_URL}/moncon.css">
    <script src="${process.env.REACT_APP_MONCON_CDN_URL}/moncon.js?id=${userId}" async></script>
<noscript><meta http-equiv="refresh" content="0; URL=${process.env.REACT_APP_MONCON_NOSCRIPT_URL}"/></noscript>
    `;

  const Copy = async () => {
    try {
      const query = { name: "clipboard-write", allowWithoutGesture: false };
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        await navigator.permissions.query(query);
      }
      await navigator.clipboard.writeText(scripts);
    } catch (err) {
      addToast(
        "For copy the scripts is necessary the clipboard permission",
        {
          appearance: "warning",
          autoDismiss: true,
          autoDismissTimeout: 7000,
        } 
      );
    }
  };

  return (
    <Paper className={classes.root}>
      <Typography variant="h6">Setup Moncon in your website</Typography>
      <Typography variant="body2" className={classes.description}>
        Just copy the Moncon script and past it inside your website
      </Typography>
      <Paper variant="outlined" className={classes.scripts}>
        <pre>
          &lt;link rel="stylesheet" href="{process.env.REACT_APP_MONCON_CDN_URL}
          /moncon.css"&gt;
        </pre>
        <pre>
          &lt;script src="{process.env.REACT_APP_MONCON_CDN_URL}/moncon.js?id=
          {userId}" async&gt;&lt;/script&gt;
        </pre>
        <pre>
          &lt;noscript&gt;&lt;meta http-equiv="refresh" content="0; URL={process.env.REACT_APP_MONCON_NOSCRIPT_URL}"/&gt;&lt;/noscript&gt;
        </pre>
        <Button variant="contained" onClick={Copy} className={classes.button}>
          copy
        </Button>
      </Paper>
    </Paper>
  );
};
export default Integration;
