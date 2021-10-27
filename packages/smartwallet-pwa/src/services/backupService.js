import { zencode_exec } from 'zenroom';

export const getDataFromLS = () => {
	const keys = Object.keys(localStorage);
	const data = {};
	keys.forEach((key) => {
		data[key] = localStorage.getItem(key);
	});
	return JSON.stringify(data,null,4);
}

export const encrypt = async (info, keypair) => {
	const key = keypair.keypair.private_key;
  	const keys = JSON.stringify({ key });
  	const data = JSON.stringify({ info });
  	const contract = `Scenario 'ecdh': Encrypt a message with a password/secret 
    Given that I have a 'string' named 'key' 
    and that I have a 'string' named 'info' 
    When I encrypt the secret message 'info' with 'key' 
    Then print the 'secret message'`;
  	const { result } = await zencode_exec(contract, { data, keys });
  	return result;
};

export const decrypt = async (encryptedData, keypair) => {
	const key = keypair.keypair.private_key;
  	const keys = JSON.stringify({ key });
  	const data = JSON.stringify(encryptedData);
  	const contract = `Scenario 'ecdh': Decrypt the message with the password 
Given that I have a valid 'secret message' 
Given that I have a 'string' named 'key' 
When I decrypt the text of 'secret message' with 'key' 
Then print the 'text' as 'string'`;
    
    try{
	  	const { result } = await zencode_exec(contract, { data, keys });
	  	const decrypted = JSON.parse(result).text;

	  	return decrypted;
    }catch(err){
    	console.log(err);
    	console.log('key',key)
    	console.log({keys})
    	console.log(data)
		return
    }
};