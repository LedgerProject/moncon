import { zencode_exec } from 'zenroom';
import { LS_DID_KEY } from '../Const';

export const createProof = async (aggregated_credentials, _keys, issuer_public_key) => {
	const contract = `Rule check version 2.0.0
    Scenario 'credential': participant generates proof 
        Given my name is in a 'string' named 'userId'
        Given I have my 'keys'
        Given I have a 'issuer public key' inside 'issuer'
        Given I have my 'credentials'
        When I aggregate all the issuer public keys
        When I create the credential proof
        Then print the 'credential proof'`

    const userId = localStorage.getItem(LS_DID_KEY);
    const keys = JSON.stringify(
    	{
    		[userId]: {
    			keys:_keys,
    			credentials: aggregated_credentials.credentials
    		}
    	}
    );

    const issuer = {
    	issuer_public_key,
    }
    console.log('issuer data', issuer);

    console.log(`public key`, issuer_public_key)

    const data = JSON.stringify({issuer,userId});

    let result = await zencode_exec(contract, {data, keys});

	if(result.result.length > 0){
		result = JSON.parse(result.result);
		console.log(result)
		return result
	}

}