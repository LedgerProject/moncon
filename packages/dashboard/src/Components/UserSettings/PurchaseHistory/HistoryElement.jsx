import {
    Typography, Grid, Divider, List, makeStyles,
} from '@material-ui/core';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
	root:{
		width: theme.spacing(55),
		marginBottom: theme.spacing(4),
	},
    containerData: {
        padding: 10,
    },
    list:{
    	width: '100%',
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
const HistoryElement = ({content}) => {
	const classes = useStyles();
	return(
		<Grid container className={classes.containerData}>
			<List className={classes.list}>
				<Grid item xs="12">
					<Grid container xs={12}>
					    <Grid item xs={12}>
					        <Grid container >
				                <Grid container item xs={12}>
					                <Grid container item xs={6} justify='flex-start'>
					                <Typography variant="caption" gutterBottom display="inline">{content.premiumContentId.domain}</Typography>
					                </Grid>
					                <Grid container item xs={6} justify='flex-end'>
										<Typography variant='caption' className={classes.floatItem}>
										    <span className={classes.amount}>{content.amount}€</span> on {formatDate(content.createdAt)}
										</Typography>
					                </Grid>
					            </Grid>
					    	</Grid>
					    </Grid>
					</Grid>
				</Grid>
				<Grid item xs={11}>
					<Typography variant="body1" display="inline" className={classes.title}>
						{content.premiumContentId.title}
					</Typography>
				</Grid>
				<Divider/>
			</List>
		</Grid>
		 );
}
export default HistoryElement