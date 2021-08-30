import { useState } from 'react';
import { Grid, Typography, Button, TextField, InputAdornment, makeStyles } from '@material-ui/core';
import IconCreditCard from '../../../Assets/svg/IconCreditCard';
import IconLock from '../../../Assets/svg/IconLock';
import IconCalendar from '../../../Assets/svg/IconCalendar';
import apiService from "../../../Services/apiService";
import ButtonSnackbar from '../../ButtonSnackbar';

const useStyles = makeStyles((theme) => ({
	textField:{
		marginBottom: theme.spacing(2),
	},
	ccv:{
		marginBottom: theme.spacing(2),
		marginLeft: theme.spacing(3),
	},
	cancelButton:{
		marginLeft: theme.spacing(2),
	},
	label:{
		marginLeft: theme.spacing(1),
		display: 'inline',
		color: '#7e8484',
	},
	subtitle:{
		marginBottom: theme.spacing(2),
	},
}));

const ChangeCreditCard = ({cancel}) => {
	const [cardNumber, setCardNumber] = useState('');
	const [cardDate, setCardDate] = useState('');
	const [cardCcv, setCardCcv] = useState('');
	const [succes, setSucces] = useState(false);
	const classes = useStyles();

	const handleChangeCardNumber = (event) => {
		setCardNumber(event.target.value)
	};

	const handleChangeCardDate = (event) => {
		setCardDate(event.target.value)
	};

	const handleChangeCardCcv = (event) => {
		setCardCcv(event.target.value)
	};

	const handleCancel = () => {
		cancel(false)
	};

	const handleSave = () => {
		/*
		apiService.post().then((data) => {
			
		});
		*/
		return Promise.resolve()
	};
	return(
		<>	
			<Grid container item xs={12} justify='flex-start' className={classes.subtitle}>
				<Typography variant='body1'>Edit your payment card</Typography>
			</Grid>
			<Grid container item xs={12} justify='flex-start'>
				<Grid container item xs={8} justify='flex-start'>
					<TextField
					className={classes.textField}
			        value={cardNumber}
			        fullWidth
			        onChange={handleChangeCardNumber}
			        InputProps={{
				    	startAdornment: (
				        	<InputAdornment position="start">
				            	<IconCreditCard/> 
				            	<span className={classes.label}>
				            		Nº of card
				            	</span>
				        	</InputAdornment>
				    	),
				    }}
				    />
				</Grid>
			</Grid>
			<Grid container item xs={12} justify='flex-start'>
				<Grid container item xs={4} justify='flex-start'>
			        <TextField
			        className={classes.textField}
			        value={cardDate}
			        fullWidth
			        onChange={handleChangeCardDate}
			        InputProps={{
				    	startAdornment: (
				        	<InputAdornment position="start">
				            	<IconCalendar/> 
				            	<span className={classes.label}>
				            		MM / YY
				            	</span>
				        	</InputAdornment>
				    	),
				    }}
			        />
				</Grid>
		        <Grid container item xs={4} justify='flex-start'>
			        <TextField
			        className={classes.ccv}
			        value={cardCcv}
			        fullWidth
			        onChange={handleChangeCardCcv}
			        InputProps={{
				    	startAdornment: (
				        	<InputAdornment position="start">
				            	<IconLock/> 
				            	<span className={classes.label}>
				            		CCV
				            	</span>
				        	</InputAdornment>
				    	),
				    }}
			        />
				</Grid>
			</Grid>
	        <Grid container item xs={12} justify='flex-start'>
		        <ButtonSnackbar 
		        successMessage='Credit card succesfully updated' 
		        errorMessage='Some error has ocurred
		        , check the credit card information and your internet conection'
		        status={handleSave}>
		        	Save Card
		        </ButtonSnackbar>
		        <Button className={classes.cancelButton} onClick={handleCancel}>
		        	Cancel
		        </Button>
	        </Grid>
        </>
	);
};
export default ChangeCreditCard