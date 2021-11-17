import apiService from './apiService';
import {aggregatesSignature} from "./zkpService";
import {LS_USER_KEY} from "../Const"

export const updateCredential = async (data, socketRef, dispatch,toast) => {
	const socket = socketRef.current
	const payload = { id: `${data.credential}`, value: `${data.claim}`, pending:false };
	
	payload.status = data.status === 'approved';
	if(!data.signedCredential){
		data.signedCredential= {}
	}

	console.log(payload)

	dispatch({
		type: "update",
		payload,
	});

	let lsData = {}

	if(data?.signedCredential?.zkp){
		let ls = JSON.parse(localStorage.getItem(data.credential));
		const aggregated_credentials = await aggregatesSignature(data.signedCredential.zkp.credential_signature, ls.keys);
		const zkp = {...data.signedCredential.zkp, ...ls, aggregated_credentials};
		lsData = JSON.stringify({...data.signedCredential, zkp});
	}else{
		lsData = JSON.stringify({...data.signedCredential});
	}


	localStorage.setItem(data.credential,lsData);

	if(!payload.status) {
		const message = `Credential ${data.credential.replace("credential_")} has been declined`; 
		const options = {
			appearance: "error",
			autoDismiss: true,
			autoDismissTimeout: 5000,
		};
		toast(message,options)
	}else{
		const message = `Credential ${data.credential.replace("credential_")} has been approved`; 
		const options = {
			appearance: "success",
			autoDismiss: true,
			autoDismissTimeout: 5000,
		}
		toast(message,options);
	}
	console.log('emiting changeCredentialRequestRecived event')
	socket.emit("changeCredentialRequestRecived",{_id: data._id});
}

export const getPendingResponses = async (userId, socketRef, dispatch,toast) => {
	console.log('getPendingResponses')
	
	const response = await apiService.post("/zenroom/check-pending-request",{userId});
	
	console.log(response.data)

	const promises = await response.data.pendingRequest.map(async (data) => {
		console.log('iteration of getPendingResponses forEach loop')
		await updateCredential(data, socketRef, dispatch, toast)
	});

	await Promise.all(promises);
}