import {
    Typography, Avatar, Switch, Paper, Grid, makeStyles, Divider
} from '@material-ui/core'

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
    }
}));

const Content = ({ content, showMetrics, changeContentStatus }) => {
    const classes = useStyles();

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
                                    <Typography display="inline"><b>{content.totalAmount}€</b> total</Typography>
                                </Grid>
                            </Grid>
                            <Divider variant="middle" />
                        </>
                    )}
                    <Grid container spacing={3} alignItems="center" className={classes.containerData}>
                        <Grid item xs="10">
                            <Grid container spacing={3}>
                                <Grid item xs="1">
                                    <Avatar src={content.image} variant='square' className={classes.itemImage} />
                                </Grid>
                                <Grid item xs={11}>
                                    <Grid container direction="column">
                                        <Grid item xs={12}>
                                            <Typography variant="caption" gutterBottom display="inline">{content.domain}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="h5" display="inline">{content.title}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs="1">
                            <Typography>{content.amount}€</Typography>
                        </Grid>
                        <Grid item xs="1">
                            {(changeContentStatus) && <Switch
                                checked={content.status === 'ACTIVE'}
                                color="primary"
                                onChange={() => changeContentStatus(content)}
                            />}
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </>
    );
}

export default Content;
