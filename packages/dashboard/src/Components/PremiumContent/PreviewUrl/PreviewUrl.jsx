import { InputAdornment, Grid, Typography, makeStyles, Avatar, TextField, Box, InputLabel, MenuItem, FormControl, Select } from "@material-ui/core";
import { useState } from "react";
import Spinner from "./Spinner";
import { useHistory } from 'react-router';
import { useToasts } from 'react-toast-notifications';

const useStyles = makeStyles(theme => ({
  containerAddUrl: {
    padding: 20,
    marginBottom: 30
  },
  input: {
    textAlign: "center",
    borderRadius: "99px",
    background: "#fff",
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    borderColor: "#fff",
    padding: "12px 21px 14px",
    "&&&:before": {
      borderBottom: "none"
    },
    "&&:after": {
      borderBottom: "none"
    },
    width: theme.spacing(17),
    height: theme.spacing(8)
  },
  cardContainer: {
    backgroundColor: "rgba(255,255,255,1)",
    padding: "1.25rem",
    height: "auto",
    width: "auto",
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    display: "flex",
    flexDirection: "row",
    textAlign: "left",
    margin: "0 14em",
    borderRadius: ".5rem",

    "@media screen and (max-width: 800px)": {
      flexDirection: "column",
      textAlign: "center",
      margin: "0 40px"
    }
  },
  container: {
    marginTop: "50px",
    padding: "0 80px",
    display: "flex",

    alignSelf: "center",
    justifySelf: "center"
  },
  cardImage: {
    width: "5rem",
    display: "block",
    flexShrink: 0,
    paddingTop: "4px",
    height: theme.spacing(5),
    marginRight: "10px",
    "@media screen and (max-width: 800px)": {
      marginBottom: "10px"
    }
  },
  buttonLook: {
    margin: "0px 0px 0px 12px",
    borderRadius: "99em",
    fontSize: "14px",
    fontWeight: 600,
    padding: "12px 41px 14px",
    background: "rgb(25, 25, 25)",
    color: "#fff",
    cursor: "pointer",
'&:hover': {
            backgroundColor: 'rgba(51,51,51,1)',
            boxShadow: 'none',
          },
  },
  previewtitle: {
    fontWeight: "600 !important",

    lineHeight: "21px"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 170,
    background: "#fff",
    padding: "0px 10px",
    borderColor: "#fff",
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },
  textField: {
    fontSize: "16px",
    borderRadius: "99px",

    height: "5em",
    width: "5em"
  },
  boxSelect: {
    marginRight: "10px",
    "@media screen and (max-width: 800px)": {
      marginRight: "0em"
    }
  },
  itemImage: {
    width: theme.spacing(7),
    height: theme.spacing(7)
  },
  priceSpace: {
    display: "flex",
    justifySelf: "right",
    marginRight: "27em",
    "@media screen and (max-width: 800px)": {
      marginRight: "10em"
    }
  }
}));

const PreviewUrl = ({ previewUrl, addUrl, loading,stripeAccountId }) => {
  const classes = useStyles();
  const [amount, setAmount] = useState("0");
  const [age, setAge] = useState('');
  const [open, setOpen] = useState(false);
  const LEGAL_AGE = 'LEGAL_AGE';
  const MINOR = 'MINOR';
  const history = useHistory();
  const { addToast } = useToasts()
   

  const handleAmountChange = event => {
    setAmount(event.target.value);
  };
  const handleBlockClick = () => {

    if(!stripeAccountId){
      addToast('You must create a stripe account to be able to loock content',
        {
          appearance: 'error',
          autoDismiss:true,
          autoDismissTimeout:7000
        }
      ) 
      return history.push('/publishers/settings')
    }
    if (isNaN(amount.replace(',','.'))) {
      return addToast("The price should contain only numbers",
        {
          appearance: 'error',
          autoDismiss:true,
          autoDismissTimeout:2500
        }
      );
    }
    if(amount == 0 && (age === '' || age === MINOR)){
      addToast("you should have a price greater than 0 or ask a credential to block the content",
        {
          appearance: 'error',
          autoDismiss:true,
          autoDismissTimeout:2500
        }
      );
      return 
    }
    
    let info = Object(previewUrl);
    
    info.amount = parseFloat(amount.replace(',','.'));
    info.age = age;
    addUrl(info);
    setAmount(0);
  };

  const handleChange = event => {
    setAge(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Grid container
            className={classes.cardContainer}
            alignItems="center"
            
          >
            <Avatar
              variant="square"
              src={previewUrl.image}
              className={classes.cardImage}
            />
            <Grid>
              <Grid>
                <Grid container direction="column">
                  <Grid item xs={12}>
                    <Typography variant="caption" gutterBottom display="inline">
                      {previewUrl.domain}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} style={{wordBreak: 'break-all'}}>
                    <Typography className={classes.previewtitle} variant="h5">
                      {previewUrl.title}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Box
            className={classes.container}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Box className={classes.priceSpace}>
              <Typography variant="h6">Price</Typography>
            </Box>
            <Box
              style={{
                display: "flex",
                alignSelf: "center",
                justifySelf: "center"
              }}
            >
              <TextField
                disableUnderline={false}
                className={classes.textField}
                placeholder="0"
                InputProps={{
                  disableUnderline: true,
                  className: classes.input,
                  endAdornment: (
                    <InputAdornment position="start">€</InputAdornment>
                  )
                }}
                error={isNaN(amount) || amount < 0}
                value={amount}
                fullWidth
                onChange={handleAmountChange}
              />
            </Box>
          </Box>
          <Box
            className={classes.container}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Box
              className={classes.boxSelect}
              style={{
                display: "flex",
                alignSelf: "center",
                marginLeft: "5em",
                marginRight: "7.90em",
                justifySelf: "end"
              }}
            >
              <Typography variant="h6">Select condition must meet</Typography>
            </Box>
            <Box
              style={{
                display: "flex",
                alignSelf: "center",
                justifySelf: "center"
              }}
            >
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-controlled-open-select-label"></InputLabel>
                <Select
                  labelId="demo-controlled-open-select-label"
                  id="demo-controlled-open-select"
                  open={open}
                  onClose={handleClose}
                  onOpen={handleOpen}
                  value={age}
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  <MenuItem value={LEGAL_AGE}>Legal age</MenuItem>
                  <MenuItem value={MINOR}>Don't require credential</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Grid
            style={{ marginTop: "60px", marginBottom: "20px" }}
            container
            justify="center"
          >
            <div
              variant="contained"
              component="span"
              color="primary"
              onClick={handleBlockClick}
              className={classes.buttonLook}
            >
              Look Content
            </div>
          </Grid>
        </>
      )}
    </>
  );
};
export default PreviewUrl;
