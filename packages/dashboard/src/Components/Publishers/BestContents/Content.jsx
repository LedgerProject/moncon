import {
    Typography, Avatar, Switch, Paper, Grid, makeStyles, Divider
} from '@material-ui/core'
import IconDocuments from '../../../Assets/svg/IconDocuments';
import { AMOUNT_TO_DISPLAY } from '../../../Constants'; 

const useStyles = makeStyles((theme) => ({
    containerMetrics: {
        padding: 10,
    },
    itemMetrics: {
        textAlign: 'center',
    },
    containerData: {
        padding: 10,
    },
    itemImage: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    imageFallback:{
        marginRight: theme.spacing(1),
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
        },
    },
    price:{
        fontWeight: 500,
        fontSize: '1.6rem',
    },
    space:{
        fontWeight: 900,
        fontSize: '1.6rem',
        marginRight: '20px',
        "@media screen and (max-width: 800px)": {
            marginRight: '0px',
        },
    },

    cardContainer: {
        backgroundColor: "rgba(255,255,255,1)",
        padding: "1.25rem",
        height: "auto",
        width: "auto",
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        display: "flex",
        flexDirection: "row",
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
        cursor: 'pointer',
        wordBreak: 'break-all',
        fontWeight: "600 !important",
        lineHeight: "21px",
        color: 'rgba(0, 0, 0, 0.87) !important',
        fontSize: '21px',
        "@media screen and (max-width: 800px)": {
          fontSize: '1.4rem' 
        }
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
    domainLink:{
        wordBreak: 'break-all',
        fontSize: '16px',
        color: '#828282',
        textDecoration: 'underline',
        "@media screen and (max-width: 768px)": {
            fontWeight: 500,
            fontSize: '1rem',
        },
    },

}));


const Content = ({ content, showMetrics, changeContentStatus }) => {
    const classes = useStyles();
    const handleClick = () => {
        window.open(content.url,'_blank');
    }

    return (
        <>
            <Grid item xs={12}>
                <Paper>
                    { showMetrics && (
                        <>
                            <Grid container spacing={3} className={classes.containerMetrics}>
                                <Grid item xs className={classes.itemMetrics}>
                                    <Typography display="inline"><b>{content.visits}</b> visits</Typography>
                                </Grid>
                                <Grid item xs className={classes.itemMetrics}>
                                    <Typography display="inline"><b>{content.payments}</b> unlocks</Typography>
                                </Grid>
                                <Grid item xs className={classes.itemMetrics}>
                                    <Typography display="inline"><b>{content.conversion}%</b> conversion</Typography>
                                </Grid>
                                <Grid item xs className={classes.itemMetrics}>
                                    <Typography display="inline"><b>{AMOUNT_TO_DISPLAY(content.totalAmount)}€</b> total</Typography>
                                </Grid>
                            </Grid>
                            <Divider variant="middle" />
                        </>
                    )}
                    <Grid  >
            <div className={classes.root} >
          
            <Grid container
              className={classes.cardContainer}
              alignItems="center"
              
            >
                {!!content?.image ? (
                        <Avatar
                            variant="square"
                            src={content.image}
                            className={classes.cardImage}
                        />
                    ):( 
                        <Grid className={classes.imageFallback}>
                            <IconDocuments
                                height={'4em'}
                                width={"3.5em"}
                                color={'#1c1c1c'}
                            />
                        </Grid>
                    )
                }
              <Grid style={{flexGrow: 1}}>
                <Grid>
                  <Grid container direction="column">
                    <Grid item xs={12}>
                      <Typography variant="caption" gutterBottom display="inline" className={classes.domainLink}>
                        {content.domain}                    </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography className={classes.previewtitle} onClick={handleClick} variant="h5">
                       {content.title}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid> 
              </Grid>
   <Grid className={classes.space}>
                            <Typography>{content.age}</Typography>
                        </Grid>
                        <Grid className={classes.space}>
                            <Typography>{AMOUNT_TO_DISPLAY(content.amount)}€</Typography>
                        </Grid>
 <Grid >
                            {(changeContentStatus) && <Switch
                                checked={content.status === 'ACTIVE'}
                                color="primary"
                                onChange={() => changeContentStatus(content)}
                            />}
                                </Grid>
                                </Grid>
                          </div>                                           
                    </Grid>
                </Paper>
            </Grid>
        </>
    );
}

export default Content;
