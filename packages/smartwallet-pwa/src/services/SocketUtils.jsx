import apiService from './apiService';

export const updateCredential = (data, socketRef, dispatch,toast) => {
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
	localStorage.setItem(data.credential,JSON.stringify({...data.signedCredential}));

	if(!payload.status) {
		const message = `${data.credential} has been declined`; 
		const options = {
			appearance: "error",
			autoDismiss: true,
			autoDismissTimeout: 5000,
		};
		toast(message,options)
	}else{
		const message = `${data.credential} has been approved`; 
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
	response.data.pendingRequest.forEach((data) => {
		console.log('iteration of getPendingResponses forEach loop')
		updateCredential(data, socketRef, dispatch, toast)
	});
}