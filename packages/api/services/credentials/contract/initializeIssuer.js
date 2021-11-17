import { zencode_exec } from "zenroom";
import { createZkpPrivateKey, createZkpPublicKey, createW3cKeyPair } from "./contracts.js";

export const CreateW3cKeyPair = async (did) => {
	const result = await zencode_exec(createW3cKeyPair, {
    	data: JSON.stringify({did}),
    	conf: `color=0, debug=0`,
    });
    return JSON.parse(result.result)[did];
}


export const CreateZkpPrivateKey = async (did) => {
	const data = JSON.stringify({did});

	let result = await zencode_exec(createZkpPrivateKey, {data});
	if(result.result.length > 0){
		return result = JSON.parse(result.result)[did];
	}
}

export const CreateZkpPublicKey = async (did,privateKey) => {
	const data = JSON.stringify({did});
	const keys = JSON.stringify({[did]:privateKey})
	let result = await zencode_exec(createZkpPublicKey, {data, keys});
	
	if(result.result.length > 0){
		return result = JSON.parse(result.result)[did];
	}
}