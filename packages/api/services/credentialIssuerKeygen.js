import { zenroom_exec, zencode_exec } from "zenroom";
import { DateTime } from "luxon";

const zencodeEncrypt = `
# We'll need bowth the 'ecdh' and the 'w3c' scenarios loaded
Scenario 'w3c' : sign
Scenario 'ecdh' : keypair

# Defining the identity of the signer and its keypair
Given that I am 'Issuer'
Given I have my 'keypair'

# the 'verifiable credential' is a schema, meaning its structure is (partly) hardcoded in Zenroom, 
# but the part managed by Zenroom is currently only the 'proof'.
# The unsigned vc can be passed to Zenroom as in the exampple  
Given I have a 'verifiable credential' named 'my-vc'

# the string is the 'verification method' of the vc, in this example it's an endpoint returing a public key
Given I have a 'string' named 'PublicKeyUrl' inside 'Issuer'

# this statement produces the JWS signature and places it in the vc, which is then printed out in output
When I sign the verifiable credential named 'my-vc'

# this statement places the 'verification method' in vc, inside the proof  
When I set the verification method in 'my-vc' to 'PublicKeyUrl'

# this prints out the signed vc
Then print 'my-vc' as 'string'

	`;
const KeyPair = `{
        "Issuer": {
            "keypair": {
                "private_key": "vecVGY7wvbk/6qI8P+BKegsh5pn4Hz6PTDgp5mXzR8I=",
                "public_key": "BL9HozwgM4HKZ9PRxZk5cOd89e5s2OvE2+FY/a2vTlRcKwFg2Gu2r2CRZ3+AmrekfqzM1xuS5MA8sIdHYGGameg="
            },
            "PublicKeyUrl": "https://apiroom.net/api/dyneorg/w3c-public-key"
        }
    }`;
const KeyPairvery = `{
        "Issuer": {            
            
                "public_key": "BL9HozwgM4HKZ9PRxZk5cOd89e5s2OvE2+FY/a2vTlRcKwFg2Gu2r2CRZ3+AmrekfqzM1xuS5MA8sIdHYGGameg="
        }
    }`;
const user_did = "did:example:c276e12ec21ebfeb1f712ebc6f2";

const zenData = {
  "my-vc": {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.w3.org/2018/credentials/examples/v1",
    ],
    id: "http://example.edu/credentials/1872",
    type: ["VerifiableCredential", "AlumniCredential"],
    issuer: "https://moncon.co/",
    issuanceDate: DateTime.now.toString(DateTime.DATETIME_FULL),
    credentialSubject: {
      id: user_did,
      alumniOf: {
        id: "did:example:c276e12ec21ebfeb1f712ebc6f2",
        valueName: [
          {
            value: "Example University",
            lang: "en",
          },
          {
            value: "Exemple d'Université",
            lang: "fr",
          },
          user_did,
        ],
      },
    },
  },
};

const very = `    
    Scenario 'w3c' : verify w3c vc signature
    Scenario 'ecdh' : verify
    Given I have a 'public key' from 'Issuer' 
    Given I have a 'verifiable credential' named 'my-vc'    
    When I verify the verifiable credential named 'my-vc'
    Then print the string 'YES, the signature matches the public key'
    `;

zencode_exec(zencodeEncrypt, {
  data: JSON.stringify(zenData),
  keys: KeyPair,
  conf: `color=0, debug=0`,
})
  .then((result) => {
    console.log(result.result);

    zencode_exec(very, {
      data: result.result,
      keys: KeyPairvery,
      conf: `color=0, debug=0`,
    })
      .then((result2) => {
        console.log(result2);
      })
      .catch((error) => {
        //throw new Error(error);
        console.log(error);
      });
  })
  .catch((error) => {
    throw new Error(error);
  });
