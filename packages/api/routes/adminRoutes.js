import express from "express";
import didMethod from 'did-method-generic';
import { zencode_exec } from "zenroom";
import admin from "../services/firebaseService.js";
import IssuerModel from '../models/issuer.js';

const router = express.Router();

const svc = [
  {
    "id": "#linkedin",
    "type": "linkedin",
    "serviceEndpoint": "https://www.linkedin.com/company/infinitelabs-co"
  },
  {
    "id": "#gitlab",
    "type": "gitlab",
    "serviceEndpoint": "https://gitlab.com/infinite-labs"
  }
]

const didHandler  = didMethod.driver({method:'moncon',service:svc})

router.get("/users", async (req, res) => {
  const response = await admin.auth().listUsers();
  res.status(200).json(response.users);
});

router.post("/create-issuer", async (req, res) => {
  const {password, email} = req.body;
  try{
    const user = await admin.auth().createUser({
      email,
      password,
    });
    const id = user.uid;
    const did = (await didHandler.generate()).id;
    await admin.auth().setCustomUserClaims(user.uid, { issuer: true });
    let wc3Keypair = {};
    let wc3PublicKey = {};
    let zkpPrivateKeypair = {
      underage:{},
      legal_age:{},
    }
    let zkpPublicKeypair = {
      underage:{},
      legal_age:{},
    }
    try {
      const contract = `
      Scenario 'ecdh': Create the keypair
      Given my name is in a 'string' named 'did'
      When I create the keypair
      Then print my data`
      const credentia = req.body;
      const result = await zencode_exec(contract, {
        data: JSON.stringify({did}),
        conf: `color=0, debug=0`,
      });
      wc3Keypair = JSON.parse(result.result)[did];
    } catch (error) {
      console.log(error);
      return res.status(400).json({error:'Error generating the wc3Keypair'});
    }
    wc3PublicKey = {public_key: wc3Keypair.keypair.public_key}
    try {
      const contract = `
        Rule check version 2.0.0
        Scenario 'credential': Credential Issuer private keys
        Given my name is in a 'string' named 'did'
        when I create the issuer key
        Then print my 'keys'`

      const data = JSON.stringify({did});

      let result = await zencode_exec(contract, {data});

      if(result.result.length > 0){
        result = JSON.parse(result.result)[did];
        zkpPrivateKeypair.underage = result
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({error:'Error generating the Zkp private key'});
    }
    try {
      const contract = `
        Rule check version 2.0.0
        Scenario 'credential': Credential Issuer private keys
        Given my name is in a 'string' named 'did'
        when I create the issuer key
        Then print my 'keys'`

      const data = JSON.stringify({did});

      let result = await zencode_exec(contract, {data});

      if(result.result.length > 0){
        result = JSON.parse(result.result)[did];
        zkpPrivateKeypair.legal_age = result
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({error:'Error generating the Zkp private key'});
    }

     try {
      const contract = `
        Rule check version 2.0.0
        Scenario 'credential': Credential Issuer private keys
        Given my name is in a 'string' named 'did'
        Given that I have my 'keys'
        When I create the issuer public key
        Then print my 'issuer public key'`

      const data = JSON.stringify({did});
      const keys = JSON.stringify({[did]:zkpPrivateKeypair.underage})
      console.log(keys)
      let result = await zencode_exec(contract, {data,keys});

      if(result.result.length > 0){
        result = JSON.parse(result.result)[did];
        zkpPublicKeypair.underage = result
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({error:'Error generating the Zkp public key'});
    }

    try {
      const contract = `
        Rule check version 2.0.0
        Scenario 'credential': Credential Issuer private keys
        Given my name is in a 'string' named 'did'
        Given that I have my 'keys'
        when I create the issuer public key
        Then print my 'issuer public key'`

      const data = JSON.stringify({did});
      const keys = JSON.stringify({[did]:zkpPrivateKeypair.legal_age})
      let result = await zencode_exec(contract, {data,keys});

      if(result.result.length > 0){
        result = JSON.parse(result.result)[did];
        zkpPublicKeypair.legal_age = result
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({error:'Error generating the Zkp public key'});
    }

    await IssuerModel.create({
      id,
      did,
      issuer_public_keys:JSON.stringify({
        zkp: zkpPublicKeypair,
        w3c: wc3PublicKey,
      }),
      issuer_private_keys:JSON.stringify({
        zkp: zkpPrivateKeypair,
        w3c: wc3Keypair,
      })
    });

    return res.status(200).json({success:'new issuer created'});
  }catch(err){
    console.log('Error creating the issuer',err)
    return res.status(500).json({error: 'error creating the issuer'})
  }
});

export default router;