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
import ImageWithLoading from "../../ImageWithLoading";
import apiService from "../../../Services/apiService";
import AppContext from "../../../AppContext";
import { CREDENTIAL_SUPPORT_ZKP } from "../../../Constants";
import ArrowLeft from "../../../Assets/svg/ArrowLeft";

const useStyles = makeStyles(() => ({
  media: {
    width: '100%',
  },
}));

const errorOptions = {
	appearance: "error",
	autoDismiss: true,
	autoDismissTimeout: 5000,
}

const successOptions = {
	appearance: "success",
	autoDismiss: true,
	autoDismissTimeout: 5000,
} 

const Request = ({match, history}) => {

	const [request, setRequest] = useState("");
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
			addToast("Error fetching updated data",{
				appearance: "error",
				autoDismiss: true,
				autoDismissTimeout: 5000,
			})
			setRequest(null)
		}
	}

	useEffect(() => {
		update()
	},[]);

	const approve = async () => {
		addToast("Approving, please wait",{...successOptions,appearance:"info"});
		let signedCredentials = {};
		let w3cCredential = {};

		try{
			w3cCredential = await apiService.post('/issuer/w3c-sign',{requestId:request._id});
			signedCredentials = w3cCredential.data;
			
			console.log('w3c result',w3cCredential.data);
			
			if(CREDENTIAL_SUPPORT_ZKP.includes(request.credential)){
				const zkpCredential = await apiService.post('/issuer/zkp-sign',{requestId:request._id});
				
				console.log('zkp result',zkpCredential.data);
				
				signedCredentials = {...signedCredentials,zkp:{...zkpCredential.data.userData}}
			}
	
			console.log('signedCredentials', signedCredentials)
		}catch(err){
			console.log(err)
			let message = 'Error signing credentials';
			return addToast(message,errorOptions);
		}
		
		try{
			
			const result = await apiService.post('/issuer/approve-credential',{
				_id: request._id,
				signedCredentials
			})
			
			addToast("Credential successfully approved",successOptions);

			socket.current.emit('changedCredentialRequestStatus', result.data.request);
			update()
		
		}catch(err){
			console.log(err)
			update()
			let message = 'Error updating credential request status';
			if(err.message.endsWith("400")){
				message = "This credential request already has been approved or declined"
			}
			addToast(message,errorOptions);
		}
	}

	const decline = async () => {
		try{
			const result = await apiService.post('/issuer/decline-credential',{_id: request._id})
			socket.current.emit('changedCredentialRequestStatus', result.data.request);
			addToast("Credential successfully declined",successOptions);
			update()
		}catch(err){
			console.log(err.message)
			update() 
			let message = 'Error updating credential request status';
			if(err.message.endsWith("400")){
				message = "This credential request already has been approved or declined"
			}
			addToast(message,errorOptions);
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
						    <ImageWithLoading
									src={request.data} 
									alt="document"
									className={classes.media}
								/>
							</CardMedia>
							<CardContent>
								<Typography align='center' gutterBottom variant="h5" component="h2">
									Certificate {request.credential.replace("credential_","")}
								</Typography>
								<Typography align='center' variant="h6" component="p">
									claim: {request.claim}
								</Typography>
								<Typography align='center' variant="h6" component="p">
									status: {request.status}
								</Typography>
							</CardContent>
							{
								request.status == "pending" &&
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
							}
						</Card>
					)
				}
			</Grid>
		</Grid>
	)
}
export default Request