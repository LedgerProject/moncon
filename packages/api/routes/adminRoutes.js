import express from "express";
import didMethod from 'did-method-generic';
import admin from "../services/firebaseService.js";
import IssuerModel from '../models/issuer.js';
import {data} from "../services/credentials/credentialsData/index.js";
import {
  CreateW3cKeyPair,
  CreateZkpPrivateKey,
  CreateZkpPublicKey
} from "../services/credentials/contract/initializeIssuer.js";

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
    //create account on firebase
    const user = await admin.auth().createUser({
      email,
      password,
    });
    
    //set custom role
    const id = user.uid;
    const did = (await didHandler.generate()).id;
    await admin.auth().setCustomUserClaims(user.uid, { issuer: true });
    
    //initialize objects
    let wc3Keypair = {};
    let wc3PublicKey = {};

    let zkpPrivateKeypair = {}
    let zkpPublicKeypair = {}
    
    //create w3c keypair
    try {
      wc3Keypair = await CreateW3cKeyPair(did);
      if(!wc3Keypair){
        return res.status(400).json({error:'Error generating the wc3Keypair'});
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({error:'Error generating the wc3Keypair'});
    }
    wc3PublicKey = {public_key: wc3Keypair.keypair.public_key}

    //create zkp keys
    
    const conditionTypes = Object.keys(data);

    const promises = await conditionTypes.map(async (conditionCategory) => {
      zkpPrivateKeypair[conditionCategory] = {};
      zkpPublicKeypair[conditionCategory] = {};
      const localPomises = await data[conditionCategory].map(async(condition) => {
        let key = {};
        //creating zkp private key
        try{
          zkpPrivateKeypair[conditionCategory][condition] = await CreateZkpPrivateKey(did);
          key = zkpPrivateKeypair[conditionCategory][condition];
        }catch(err){
          console.log(err);
          return res.status(400).json({error:'Error generating the Zkp private key'});
        }
        //creating zkp public key
        try{
          zkpPublicKeypair[conditionCategory][condition] = await CreateZkpPublicKey(did,key);
        }catch(err){
          console.log(err);
          return res.status(400).json({error:'Error generating the Zkp public key'});
        }
        return condition;
      })
      await Promise.all(localPomises);
      return localPomises
    });

    await Promise.all(promises)

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