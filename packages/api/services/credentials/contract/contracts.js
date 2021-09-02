export const singVC=`
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
	`

export const verifyVC = `
Scenario 'w3c' : verify w3c vc signature
Scenario 'ecdh' : verify
Given I have a 'public key' from 'Issuer' 
Given I have a 'verifiable credential' named 'my-vc'    
When I verify the verifiable credential named 'my-vc'
Then print the string 'YES, the signature matches the public key'
`