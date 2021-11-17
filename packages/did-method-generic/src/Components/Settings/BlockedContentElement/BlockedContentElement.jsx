import { useEffect, useState } from "react";
import {
  InputAdornment,
  Grid,
  Typography,
  makeStyles,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Button,
  Paper,
} from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import apiService from "../../../Services/apiService.js";

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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 170,
    background: "#fff",
    padding: "0px 10px",
    borderColor: "#fff",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    justifyContent: "center",
    justifySelf: "center",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    "@media screen and (max-width: 800px)": {
      gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
    },
  },
  buttonBlocked: {
    paddingTop: "20px",
    display: "flex",
    justifyContent: "center",
    justifySelf: "center",
  },
}));

const BlockedContentElement = () => {
  const { addToast } = useToasts();
  const classes = useStyles();
  const [elementType, setElementType] = useState("");
  const [elementName, setElementName] = useState("");
  const [open, setOpen] = useState(false);
  const TAGS = "tag";
  const CLASS = "class";
  const ID = "id";
  const DEFAULT = "default";

  const handleSelect = (event) => {
    setElementType(event.target.value);
  };

  const handleTextField = (event) => {
    setElementName(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    const getInfo = async () => {
      const response = await apiService.get("/publisher/contentId");
      console.log(response);
      const { contentIdType, contentIdValue } = response?.data || {};
      setElementName(contentIdValue || "");
      setElementType(contentIdType || "");
    };
    getInfo();
  }, []);

  const handleClick = async () => {
    try {
      const response = await apiService.put(
        `/publisher/contentId/?contentIdType=${elementType}&contentIdValue=${elementName}`
      );
      addToast(
        `Has been placed correctly ${elementType} and element ${elementName}`,
        {
          appearance: "success",
          autoDismiss: true,
          autoDismissTimeout: 7000,
        }
      );
    } catch (err) {
      console.log(err);
      addToast(`${err}`, {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 7000,
      });
    }
  };

  return (
    <Paper className={classes.root} elevation={0}>
      <Grid className={classes.description}>
        <Typography variant="h6">Blocked Content based on a css tag</Typography>
        <Typography variant="subtitle2">
          To block specific content you must add an id, css or html tag element
        </Typography>
      </Grid>
      <Grid className={classes.grid}>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-controlled-open-select-label"></InputLabel>
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            value={elementType}
            onChange={handleSelect}
          >
            <MenuItem value={DEFAULT}>
              <em>Select</em>
            </MenuItem>
            <MenuItem value={TAGS}>Tags</MenuItem>
            <MenuItem value={ID}>id</MenuItem>
            <MenuItem value={CLASS}>class</MenuItem>
          </Select>
        </FormControl>
        <form
          className={classes.root}
          noValidate
          autoComplete="off"
          style={{ paddingTop: "10px" }}
        >
          <TextField
            value={elementName}
            id="standard-basic"
            label="Element"
            onChange={handleTextField}
          />
        </form>
      </Grid>
      <Grid className={classes.buttonBlocked}>
        <Button
          variant="contained"
          color="primary"
          component="span"
          onClick={handleClick}
        >
          Blocked
        </Button>
      </Grid>
    </Paper>
  );
};
export default BlockedContentElement;
