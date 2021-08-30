import {
    Typography, Grid, makeStyles, Card, CardMedia, CardContent
} from '@material-ui/core';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
	root:{
		width: theme.spacing(55),
		marginBottom: theme.spacing(3),
		cursor:'pointer',
	},
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
        width: theme.spacing(55),
        height: theme.spacing(35),
    },
    title:{
    	fontWeight: 'bold',    	
    },
    amount:{
    	marginLeft: 15,
    	display: 'contents',
    	fontWeight: 600,
    	fontSize: '.85rem',
    },
    floatItem:{
    	float: 'right'
    },
}));

const formatDate = (date) => {
	return moment(date).format('DD/MM/YYYY')
};


const Purchases = ({content}) => {
	const classes = useStyles();
	const handleClick = () => {
	    window.open(content.premiumContentId.url,'_blank')
	  }
	return(
		<>
			<Grid container item justify='center'>
	            <Card className={classes.root} onClick={handleClick}>
	                {content.premiumContentId.image && <CardMedia image={content.premiumContentId.image} className={classes.itemImage} />}
	                <CardContent>
		                <Grid container alignItems="center" className={classes.containerData}>
		                    <Grid item xs="12">
		                        <Grid container spacing={3}>
		                            <Grid item xs={12}>
		                                <Grid container >
	                                        <Grid container item xs={12}>
		                                        <Grid item xs={6} justify='flex-start'>
		                                        	<Typography variant="caption" gutterBottom display="inline">{content.premiumContentId.domain}</Typography>
		                                        </Grid>
		                                        <Grid item xs={6} justify='flex-end'>
							                        <Typography variant='caption' className={classes.floatItem}>
							                        	<span className={classes.amount}>{content.amount}€</span> on {formatDate(content.createdAt)}
							                        </Typography>
		                                        </Grid>
		                                    </Grid>
		                                </Grid>
		                            </Grid>
		                        </Grid>
		                    </Grid>
		                    <Grid item xs={12}>
		                        <Typography variant="h6" display="inline" className={classes.title}>
		                            {content.premiumContentId.title}
		                        </Typography>
		                    </Grid>
		                </Grid>
	                </CardContent>
	            </Card>
			</Grid>
        </>
	);
} 

export default Purchases
