import { makeStyles } from "@material-ui/core";
export const useStyles = makeStyles((theme) => ({
root: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    boxSizing: "border-box",
    margin: "0",
    padding: '4px 30px',
    position: 'relative',
    marginBottom: '4rem',
    cursor:'pointer',
    "@media screen and (max-width: 800px)": {
  padding: '10px 10px',
    },
},
  titleHistory:{
    marginLeft: '15px',
    fontWeight: 500,
    fontSize: '2.4rem',
    lineHeight: '24px',
    marginTop: '40px',
    textAlign: 'center',
 "@media screen and (max-width: 800px)": {
   
  fontSize: '1.6rem',
  lineHeight: '24px',
  paddingTop:'10px',
  },},
  price:{
    fontWeight: 500,
    fontSize: '1.6rem',
  },
  titlePrice:{
    fontWeight: 900,
    fontSize: '1.6rem',
    marginRight: '20px',
    "@media screen and (max-width: 800px)": {
    marginRight: '0px',
    },
  },
  check:{
    marginTop: '0px',
    "@media screen and (max-width: 800px)": {
    marginTop: '10px',
    },
  },

  cardContainer: {
    backgroundColor: "rgba(255,255,255,1)",
    padding: "1.25rem",
    height: "auto",
    width: "auto",
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    borderRadius: ".5rem",
    "@media screen and (max-width: 800px)": {
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
    lineHeight: "21px",
    color: 'rgba(0, 0, 0, 0.87) !important',
    fontSize: '1.9rem',
    "@media screen and (max-width: 800px)": {
      fontSize: '1.4rem' 
    },
    textAlign:'left',

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
  },
  historyLink:{
    fontSize: '1.2rem',
    color: '#828282',
    textDecoration: 'underline',
    "@media screen and (max-width: 768px)": {
      fontWeight: 500,
      fontSize: '1rem',
    },
  },

  imageFallback:{
    "@media screen and (max-width: 400px)": {
      textAlign: 'revert',
      marginLeft: '-5px',
      marginRight: theme.spacing(0.5)
    },
  },
}));
