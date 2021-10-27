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
#print the did hash
	`;

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

export const hashData = `
Rule check version 2.0.0
Scenario 'ecdh' : verify
#hashing data
Given I have a 'string' named 'info'
When I create the hash of 'info' using 'sha256' 
then I print the 'hash'

`
export const userZkpKeys = `
Rule check version 2.0.0
Scenario credential: credential keygen
Given my name is in a 'string' named 'userId'
When I create the credential key
and I create the credential request
Then print data`

export const signZkp =`
Rule check version 2.0.0
Scenario 'credential': issuer create the credential signature
Given my name is in a 'string' named 'did'
Given I have my 'keys'
Given that I have a 'issuer public key'
Given I have a 'credential request'
when I create the credential signature
Then print data` 

export const aggregatesSignature = `
Rule check version 2.0.0
Scenario 'credential': participant aggregates credential signature(s)
Given my name is in a 'string' named 'userId'
Given I have my 'keys'
Given I have a 'credential signature'
When I create the credentials
Then print my 'credentials'`

export const verifyZkp = `
Rule check version 2.0.0
Scenario 'credential': anyone verifies the proof
Given my name is in a 'string' named 'did'
Given that I have my 'issuer public key'
Given I have a 'credential proof'
When I aggregate all the issuer public keys
When I verify the credential proof
Then print the string 'The proof matches the public_key!'`