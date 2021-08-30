import { Grid, Typography, Divider, List, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	root: {
		marginBottom: theme.spacing(1),
	},
    list:{
    	width: '100%',
    },
    container: {
		marginBottom: theme.spacing(2),
	},
	receipt:{
		fontWeight: 'bold',
	},
	amount:{
		fontWeight: 'bold',
	},
}));

const Receipt = ({receipt}) => {
	const classes = useStyles()
	return(
		<Grid container item xs={8} justify='center' className={classes.root}>
			<List className={classes.list} >
				<Grid container item xs={12} justify='center' className={classes.container}>
					<Grid container item xs={5} justify='flex-start'>
						<Typography variant='body2' className={classes.receipt}>
							Receipt #{receipt.receiptNumber}
						</Typography>
					</Grid>
					<Grid container item xs={5} justify='flex-end'>
						<Typography variant='caption'>
							<span className={classes.amount}>{receipt.amount}€</span> on {receipt.createdAt}
						</Typography>
					</Grid>
				</Grid>
				<Divider/>
			</List>
		</Grid>
	)
}
export default Receipt