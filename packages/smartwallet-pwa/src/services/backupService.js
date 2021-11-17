import { zencode_exec } from 'zenroom';

export const getDataFromLS = () => {
	const keys = Object.keys(localStorage);
	const data = {};
	keys.forEach((key) => {
		data[key] = localStorage.getItem(key);
	});
	return JSON.stringify(data,null,4);
}

/** 
 * @typedef {Object.<string, string>} keypair
 * @property {string} private_key ecdh private key
 * @property {string} public_key ecdh public key
 * @example
 * 
 	"keypair": {
    	"private_key": "yXtHASzOVzwQaKuCpnq20jwwVedBaDNd9h6qEgewhxo=",
    	"public_key": "BAqV0F7EEhddLkATOLR+sXBf6ktmcFEFeqbm1EorhrtTDMr8R8J0dfNmEOYWqaAMh2g4WnHdt7knKEXhIWOb7sE="
    }
 */

/** 
 * Encrypt user data
 * @param {Object} info data to encrypt
 * @param {keypair} keipair user ecdh keypair
 * @return {JSON} encrypted data
 */

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

/** 
 * Decrypt user data
 * @param {JSON} encryptedData json that contains the information
 * @param {keypair} keypair user ecdh keypair
 * @return {Object}
 */

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