/** 
 * @typedef {Object.<string, string>} keys zkp cryptographic key
 * @property {string} credential cryptographic key
 * @example
 * 
    "keys": {
        "credential": "Wqazqj9muBGZLOKWCx3u16IkbIantYapNXXm0xEKqFg="
    }
 */

/** 
 * @typedef {Object.<string, string>} derived_key
 * @description cryptographic keys derivated from {@link keys}
 * @property {string} alpha cryptographic key
 * @property {string} beta cryptographic key 
 * @example
 * 
    "issuer_public_key": {
        "alpha": "Ci3RNr3mQgZ+vdhwEokPnq7djLCyoTotPpqfBRQZoX8VdKdGBhkGoIAKfwGQSZH0CG1ZyssgkjW/SRKElf5sHhOjZWzt9xhfwv70RWy8rZVCxQjlYsq+ziFVPPj/DEbLD+1UzGq3qD0awV5oWOmbP76ogkBobBrLboBT5cTLiLTqBdFo356Y1LwOFrafSeKQFxkZxsFi6TCXrzKqzJDOo7zPSXmbBQgh14cz9JNdKNxt+vc94qVJCbpdJufLjQeE",
        "beta": "C1PrsjE2/BamDZIlMgqs+X26/RzgzKkcG4gL2QhEvubGwwE1+jOEcZlvn/Tv3htxCr/8ytK6o6QNit9ry83btHtKkXaTmeg2DbvX9A5vix9K6s9Y5kcbj0BDsEAePcu0EOdxtJlFsjOcCmOV/DqD+9zq1uVxQvcqSa25PGAtxVOrSOTAuCVX8enZ2mpiNtRZGIF5kROS3KZk98wPz4QtarzbQwV+TWPnE36/R0twjk/S14xYhGMYvjLPKBXr8YpP"
    }
 */

/** 
 * @typedef {Object.<string, string | Object>} credential_request
 * @property {string} commit
 * @property {string} public
 * @property {Object} pi_s
 * @property {Object} sign
 * @example
 * "credential_request": {
        "commit": "AxKluVHA4I86nE9LBr6c/QWz7oBjZT1XQBLv9CEG1cr0e3DOWAyOd+uXxNCknzCFfA==",
        "pi_s": {
        	"commit": "UCZFspfQNI4rysCDIxyKRfRBJ6FUge2VhdXFy4u4APs=",
            "rk": "JlHxeyPgfC83xrYn/SodS6f6AwNALHFxFY/GIV39+IA=",
            "rm": "W7QWHqm/YER4FUtDUx+wAu2C6JwKzN/mzf7XEfI8xlY=",
            "rr": "UOFXIJclPXdhzl9282F3fLt99hwsYw/ItNJIKbE8nJs="
        },
        "public": "AhYCP1Ct2ZapJuTYNTzWMUIlgPwFNweJFTrJ/0UWg9a/UwvY8g/9VPTgRJCV0X1SXA==",
        "sign": {
            "a": "AwHC0gMKZALnZ36DnB18bgNGRcOZU1NZNkCMkJsBdegstZxzfSFMVyar9CncbFa5oA==",
            "b": "AwJKblxB6OHktzgT4GvQMbTNleuuV1JxNpqpu/SSGi+hf2XHC2q6N5kHRMucikVQPA=="
        }
    }
 */

/** 
 * @typedef {Object.<string, string>} credential_signature
 * @property {string} a_tilde
 * @property {string} b_tilde
 * @property {string} h
 * @example
 * 
   "credential_signature": {
      "a_tilde": "AhN3jd6CDAWc1jLyE8ITfySsnNBg9tkwF1ndduGJb5cQTonfL6wYi0TWcY/J+9p+7Q==",
      "b_tilde": "AwW32XvYpMJn6jKeHLBy6gsAaW3cZdP2fPXK717lQeA3faYwCAKhONBntknsAp0neg==",
      "h": "AxcTRhBzHHzouliDOtqeuFAsi/6LOznjxnMWv7EMTrEMVmfj5nH16mt7IDGmAD5sfw=="
   }
 */

/** 
 * @typedef {Object.<string, string>} aggregated_credentials
 * @property {string} h
 * @property {string} s
 * @example
 * "credentials": {
         "h": "AhPY7CWI4FraIkfdVSFryiqmmhsrMAUQZ2cU9gx8NagElM6EVmvwkquyGvvmNVfPvw==",
         "s": "AhBAe/odrb36r/vxQrY5cosIdDyTTRdTw7AnNK7WdBq/HANKkGZUd+fuIMnCHal2FQ=="
      }
 */

/** 
 * @typedef {Object.<string, string | Object>} proof
 * @property {Object} pi_v
 * @property {Object} sigma_prime
 * @property {string} kappa
 * @property {string} nu
 * @example
 * 
    "credential_proof": {
        "kappa": "GTdiS3buEUkjPyqGNPMc9Mr3kE5bolT0lRgF+S23nS/aplA9XQRQD2mwK6nhYXtDB7CTFkUjQ8OAWdM3qOeH6aoO4cSKIuppZbdgIXy5srn6Rs2QrtGva8JXh8YgovAhD1HUoTCyqaz3L/FkGaPfWJdBW2/gaCYyGQGTJnCM4K4G77tJbStPMF/rhqK6t0EmFUiEjy2kfCR+WUjhjqTXSuELHM5JRn1Gr5VJQsvyRAlJtjNlnDZQru3M87rMyZ3E",
        "nu": "AwmLe0WONv25ih82UmST1u8Lcjm3+rXjP+uQHlAcxRNyK/37hZA6VEFH6nFZgLFP5w==",
        "pi_v": {
            "c": "SCvUZDi260JkRcuVuHcG4wn/UwUQZIWynDJ+BSHM0fw=",
            "rm": "BxPP2u3sfu9HOeEwIR2Aj19sx2IJPT1Lm26fwTV2gcY=",
            "rr": "KpH1KBfSP83DFFfKI4lGhVXjMDifarf4wq7ZTNc4d3Y="
        },
        "sigma_prime": {
            "h_prime": "AgMKaz9wJB6Xapwnluk/My/GBWKZPw10TxU0fKlShP0dtgjpm5s59W0csaALzZXKwA==",
            "s_prime": "AxMW1P/lxg+aHtyyRepv6ImNMMZLpLsA0/tc3C4w589PRkVz/b0tHRohQaZuLOZ/Dw=="
        }
    }
 */


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
 * @typedef {Object.<string, string | Object | number | Date | Array>} vc
 * @example
 * "my-vc": {
      "@context": [
         "https://www.w3.org/2018/credentials/v1",
         "https://www.w3.org/2018/credentials/examples/v1"
      ],
      "credentialSubject": {
         "alumniOf": {
            "id": "did:example:c276e12ec21ebfeb1f712ebc6f1",
            "name": [
               {
                  "lang": "en",
                  "value": "Example University"
               },
               {
                  "lang": "fr",
                  "value": "Exemple d'Université"
               }
            ]
         },
         "id": "did:example:ebfeb1f712ebc6f1c276e12ec21"
      },
      "id": "http://example.edu/credentials/1872",
      "issuanceDate": "2010-01-01T19:73:24Z",
      "issuer": "https://example.edu/issuers/565049",
      "proof": {
         "jws": "eyJhbGciOiJFUzI1NksiLCJiNjQiOnRydWUsImNyaXQiOiJiNjQifQ..yTY9BQQnxJedmnS0Jw71dZD53YPIrwfpfjbXgS8dQtxoymIRC20NbhcGR-YeWl_1zGlWxgzNO2B8UDGbIdGl2Q",
         "proofPurpose": "authenticate",
         "type": "Zenroom",
         "verificationMethod": "https://apiroom.net/api/dyneorg/w3c-public-key"
      },
      "type": [
         "VerifiableCredential",
         "AlumniCredential"
      ]
   }
 */


/** 
 * @param {Object} data dynamic data
 * @param {string} data.did did of the issuer
 * @returns {keypair}
 */
export const createW3cKeyPair = `
   Scenario 'ecdh': Create the keypair
   Given my name is in a 'string' named 'did'
   When I create the keypair
   Then print my data`

/** 
 * Zenroom contract that signs a w3c vc
 * @param {Object} data dynamic data
 * @param {vc} data.my-vc any non-signed wc3 vc
 * @param {string} data.PublicKeyUrl the endpoint url to get the isssuer publick key
 * @param {Object} keys object that holds cryptographics keys
 * @param {Object} keys.Issuer object that holds issuer info
 * @param {Object} Issuer object that holds the keypair
 * @param {keypair} Issuer.keypair any ecdh keypair
 * @returns {vc} signed vc 
 */

export const singVC = `
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

/** 
 * Zenroom contract that verify a w3c vc
 * @param {Object} data dynamic data
 * @param {vc} data.my-vc signed vc
 * @param {Object} keys object that holds cryptographics keys  
 * @param {Object} keys.Issuer object that holds issuer info
 * @param {Object} Issuer issuer object inside of keys
 * @param {keypair.public_key} Issuer.public_key ecdh public key
 * @returns {string}
 */
export const verifyVC = `

Rule check version 2.0.0

# We'll need bowth the 'ecdh' and the 'w3c' scenarios loaded
Scenario 'w3c' : verify w3c vc signature
Scenario 'ecdh' : verify

# The public key is extracted from the 'verification method'
Given I have a 'public key' from 'Issuer'

# The vc is passed as a parameter
Given I have a 'verifiable credential' named 'my-vc'


# This statements checks that the vc's signature and the public key from issuer match
When I verify the verifiable credential named 'my-vc'

# this is printed if the verification succeeds, else the script stops
Then print the string 'YES, the signature matches the public key'
`;

/** 
 * @param {Object} data dynamic data
 * @param {string} data.did did of the issuer
 * @returns {keys} issuer private key
 */

export const createZkpPrivateKey = `
   Rule check version 2.0.0
   Scenario 'credential': Credential Issuer private keys
   Given my name is in a 'string' named 'did'
   when I create the issuer key
   Then print my 'keys'`

/** 
 * @param {Object} data dynamic data
 * @param {string} data.did did of the issuer
 * @param {Object} keys cryptpgraphic keys
 * @param {Object} keys.did where did is the value of data.did
 * @param {Object} did this is the did Object inside keys
 * @param {keys} did.keys issuer private key
 * @returns {derived_key} issuer public key
 */

export const createZkpPublicKey = `
   Rule check version 2.0.0
   Scenario 'credential': Credential Issuer private keys
   Given my name is in a 'string' named 'did'
   Given that I have my 'keys'
   When I create the issuer public key
   Then print my 'issuer public key'`

/** 
 * Zenroom contract that sign a credential request
 * @param {Object} data dynamic data
 * @param {string} data.did issuer did
 * @param {derived_key} data.issuer_public_key is the public key
 * @param {credential_request} data.credential_request user credential request
 * @param {Object} did where did is the value of the did string
 * @param {keys} did.keys issuer private key
 * @returns {credential_signature} signed credential request
 */
export const signZkp =`
Rule check version 2.0.0
Scenario 'credential': issuer create the credential signature
Given my name is in a 'string' named 'did'
Given I have my 'keys'
Given that I have a 'issuer public key'
Given I have a 'credential request'
when I create the credential signature
Then print data` 

/** 
 * Zenroom contract that verify a zkp proof
 * @param {Object} data dynamic data
 * @param {string} data.did issuer did
 * @param {proof} data.credential_proof zkp proof
 * @param {Object} did where did is the value of the did string
 * @param {derived_key} did.issuer_public_key  public key
 * @returns {string}
 */

export const verifyZkp = `
Rule check version 2.0.0
Scenario 'credential': anyone verifies the proof
Given my name is in a 'string' named 'did'
Given that I have my 'issuer public key'
Given I have a 'credential proof'
When I aggregate all the issuer public keys
When I verify the credential proof
Then print the string 'The proof matches the public_key!'`