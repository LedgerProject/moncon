import { useState, useEffect } from 'react';
import { Grid, Paper, Typography, makeStyles } from '@material-ui/core';
import apiService from "../../../Services/apiService";
import Receipt from './Receipt';
import ChangeCreditCard from './ChangeCreditCard';
import IconCreditCard from '../../../Assets/svg/IconCreditCard';
import IconPencil from '../../../Assets/svg/IconPencil';
import moment from 'moment';

const nexPayment = '12/04/2021'

const fakeReceipts = [
	{
		receiptNumber: 3,
		amount: 3.20,
		createdAt: '12/02/2021',
	},
	{
		receiptNumber: 2,
		amount: 5,
		createdAt: '12/02/2021',
	},
	{
		receiptNumber: 1,
		amount: 5,
		createdAt: '12/02/2021',
	},
]

const fakeCreditCard = '5784'

const useStyles = makeStyles((theme) => ({
    title:{
      fontSize: '2.26rem',     
      fontWeight: 'bold',
      marginBottom: theme.spacing(5),
    },
    creditCard:{
    	padding: theme.spacing(3),
    	marginBottom: theme.spacing(8),
    	width: '100%',
    },
    editCreditCard:{
    	padding: theme.spacing(3),
    	marginBottom: theme.spacing(8),
    	width: '100%',
    	height: theme.spacing(27),	
    },
    payment:{
    	marginBottom: theme.spacing(3),
    },
    subtitle: {
    	fontWeight: 'bold',
    	marginRight: theme.spacing(5),
    },
    cardNumber:{
    	color: "#7d8383",
    	fontWeight: 'bold',
    },
    cardText:{
    	color: "#7e8484",
    	width: '100%',
    },
    cardTextContainer:{
    	width: '100%',
    },
    nexPayment:{
    	color:'#919595',
    	marginLeft: theme.spacing(-5),
    },
    creditCardText:{
    	marginLeft: theme.spacing(1),
    	marginRight: theme.spacing(.7),
    },
    iconPencil:{
    	cursor: 'pointer'
    },
}));

const PaymentSettings = () => {
	const [receipts, setReceipts] = useState(fakeReceipts);
	const [cardNumber, setCardNumber] = useState(fakeCreditCard);
	const [changeCreditCard,setChangeCreditCard] = useState(false)
	const classes = useStyles();

	const handleChangeCreditCard = () => {
		setChangeCreditCard(true);
	};

	useEffect(() => {
        /*apiService.get('user/endpoint').then((response) => {
	        let data = response.data || [] ;
	        data.sort((a,b) => (moment(b.createdAt).diff(a.createdAt)));
	        setReceipts(data);
    	})*/

    	/*apiService.get('user/endpoint').then((response) => {
	        let data = response.data || '' ;
	        setCardNumber(data);
    	})*/
    },[]);
	return(
			<>
				<Grid container item xs={12} justify='center'>
					<Grid container item xs={7} justify='flex-start'>
						<Typography variant='h4' className={classes.title} >Payment Settings</Typography>
					</Grid>
					<Grid container item xs={8} justify='flex-start' alignItems='flex-start' >
						<Grid container item xs={7} justify='flex-start'>
							<Typography variant='h6' className={classes.subtitle}>Your Payment Card</Typography>
						</Grid>
						<Paper className={!changeCreditCard? classes.creditCard: classes.editCreditCard } elevation={0}>
							<Grid container item xs={12} justify='center' className={classes.cardTextContainer}>
								{!changeCreditCard? 
								<>
									<Grid container item xs={7} justify='flex-start'>
										<Typography variant='body2' className={classes.cardText}>
											<IconCreditCard/>	
											<span className={classes.creditCardText}>
												VISA card number ending on  
											</span>
											<span className={classes.cardNumber}>
												{cardNumber}
											</span>
										</Typography>
									</Grid>
									<Grid container item xs={4} justify='flex-end'
									onClick={handleChangeCreditCard} className={classes.iconPencil} >
										<IconPencil/>
									</Grid>
								</>
								: <ChangeCreditCard cancel={setChangeCreditCard} /> }
							</Grid>
						</Paper>	
					</Grid>
					<Grid container item xs={12} justify='center'>
						<Grid container item xs={12} justify='center' className={classes.payment}>
							<Grid container item xs={8} justify='center'>
								<Typography variant='h6' className={classes.subtitle}>Payment History</Typography>
							</Grid>
							<Grid container item xs={4} justify='flex-start'>
								<Typography variant='caption' className={classes.nexPayment}>next payment on {nexPayment}</Typography>
							</Grid>
						</Grid>
						<Grid container item xs={12} justify='center'>
							{
								receipts.map((receipt) => (
									<Receipt receipt={receipt}/>
								))
							}
						</Grid>
					</Grid>
				</Grid>
			</>
		)
}
export default PaymentSettings