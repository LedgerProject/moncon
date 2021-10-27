import { useEffect, useState, useContext } from 'react';
import { 
	Grid,
	Typography,
	Button,
	IconButton,
	Card,
	CardActions,
	CardMedia,
	CardContent,
	makeStyles
} from '@material-ui/core';
import { useToasts } from "react-toast-notifications";
import apiService from "../../../Services/apiService";
import AppContext from "../../../AppContext";
import { CREDENTIAL_SUPPORT_ZKP } from "../../../Constants";
import ArrowLeft from "../../../Assets/svg/ArrowLeft";

const useStyles = makeStyles(() => ({
  media: {
    width: '100%',
  },
}));

const Request = ({match, history}) => {
	const [request, setRequest] = useState(false);
	const { socket } = useContext(AppContext);
	const classes = useStyles();
	const { addToast } = useToasts();

	const update = async () => {
		const id = match.params.id
		if(!id){
			return setRequest(null);
		}
		try{
			const response = await apiService.get(`/issuer/unique-request?id=${id}`)
			setRequest(response.data)
		}catch(err){
			console.log(err)
			setRequest(null)
		}
	}

	useEffect(() => {
		update()
	},[]);

	const approve = async () => {
		try{
			let signedCredentials = {};
			
			const w3cCredential = await apiService.post('/issuer/w3c-sign',{requestId:request._id});
			signedCredentials = w3cCredential.data;
			
			console.log('w3c result',w3cCredential.data);
			
			if(CREDENTIAL_SUPPORT_ZKP.includes(request.credential)){
				const zkpCredential = await apiService.post('/issuer/zkp-sign',{requestId:request._id});
				
				console.log('zkp result',zkpCredential.data);
				
				signedCredentials = {...signedCredentials,...zkpCredential.data.userData}
			}
			
			console.log('signedCredentials', signedCredentials)
			
			const result = await apiService.post('/issuer/approve-credential',{
				_id: request._id,
				signedCredentials
			})
			
			socket.current.emit('changedCredentialRequestStatus', result.data.request);
			update()
		
		}catch(err){
			console.log(err)
			update()
			let message = 'Error updating credential request status';
			const options = {
				appearance: "error",
				autoDismiss: true,
				autoDismissTimeout: 5000,
			}
			if(err.message.endsWith("400")){
				message = "This credential request already has been approved or declined"
			}
			addToast(message,options);
		}
	}

	const decline = async () => {
		try{
			const result = await apiService.post('/issuer/decline-credential',{_id: request._id})
			socket.current.emit('changedCredentialRequestStatus', result.data.request);
			update()
		}catch(err){
			console.log(err.message)
			update() 
			let message = 'Error updating credential request status';
			const options = {
				appearance: "error",
				autoDismiss: true,
				autoDismissTimeout: 5000,
			}
			if(err.message.endsWith("400")){
				message = "This credential request already has been approved or declined"
			}
			addToast(message,options);
		}
	}

	const handleReturn = () => {
		history.push('/issuer')
	}

	return (
		<Grid container justify='center' item xs={12}>
			<Grid container justify='flex-start' item xs={12}>
				<IconButton 
					aria-label="return"
					component="span"
					onClick={handleReturn}
				>
					<ArrowLeft/> return	
				</IconButton>
			</Grid>
			<Grid container justify='center' item xs={12} sm={8}>
				{
					request == null? 
						<Grid item xs={12}>
							<Typography variant='h5'>
								This credential request does not exist
							</Typography>
						</Grid>
					: !request?
						<Grid item xs={12}>
							<Typography variant='h6'>
								...Loading
							</Typography>
						</Grid>
					:(
						<Card>
							<CardMedia>
						    	<img 
									src={request.data} 
									alt="document"
									className={classes.media}
								/>
							</CardMedia>
							<CardContent>
								<Typography align='center' gutterBottom variant="h5" component="h2">
									Credential: {request.credential}
								</Typography>
								<Typography align='center' variant="h6" component="p">
									claim: {request.claim}
								</Typography>
								<Typography align='center' variant="h6" component="p">
									status: {request.status}
								</Typography>
							</CardContent>
							<CardActions>
								<Grid container justify="center">
									<Button 
										variant='contained' 
										color='primary'
										onClick={decline}
									>
										decline
									</Button>
								</Grid>
								<Grid container justify="center" >
									<Button 
										variant='contained' 
										color='primary'
										onClick={approve}
									>
										approve
									</Button>
								</Grid>
							</CardActions>
						</Card>
					)
				}
			</Grid>
		</Grid>
	)
}
export default Request