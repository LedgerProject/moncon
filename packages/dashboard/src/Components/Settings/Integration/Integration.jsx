import { Typography, Paper, Button, makeStyles } from "@material-ui/core";
import { useContext } from "react";
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

  const scripts = `<link rel="stylesheet" href="${process.env.REACT_APP_MONCON_CDN_URL}/moncon.css">
    <script src="${process.env.REACT_APP_MONCON_CDN_URL}/moncon.js?id=${userId}" async></script>`;

  const Copy = async () => {
    try {
      const query = { name: "clipboard-write", allowWithoutGesture: false };
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        await navigator.permissions.query(query);
      }
      await navigator.clipboard.writeText(scripts);
    } catch (err) {
      alert("For copy the scripts is necessary the clipboard permission");
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
        <Button variant="contained" onClick={Copy} className={classes.button}>
          copy
        </Button>
      </Paper>
    </Paper>
  );
};
export default Integration;
