import express from "express";
import { zencode_exec } from "zenroom";
import IssuerModel from '../models/issuer.js';
import CredentialRequestModel,{
  CREDENTIAL_REQUEST_STATUS_PENDING,
  CREDENTIAL_REQUEST_STATUS_DECLINED,
  CREDENTIAL_REQUEST_STATUS_APPROVED
} from "../models/CredentialRequest.js";
import ExampleV1 from "../JsonLDTemplates/ExampleV1.js";
import CredentialsV1 from "../JsonLDTemplates/CredentialsV1.js";
import {
  verifyVC,
  verifyZkp
} from "../services/credentials/contract/contracts.js";

const router = express.Router();

router.post("/w3c-verify", async (req, res) => {
  console.log("/w3c-verify in zenroomRouter");
  console.log("req.query", req.query);
  console.log("req.body", req.body);

  const {did} = req.query;

  const issuer = await IssuerModel.findOne({did})

  if(!issuer){
    return res.status(404).json({error:'issuer not found'})
  }
  
  const public_key = JSON.stringify(
    {
      Issuer:{
        public_key: JSON.parse(issuer.issuer_public_keys)?.w3c?.public_key
      }
    }
  );

  try {
    const credential = req.body.credential;
    const result = await zencode_exec(verifyVC, {
      data: JSON.stringify(credential),
      keys: public_key,
      conf: `color=0, debug=0`,
    });
    res.status(200).json({ verifyVC: true, result: JSON.parse(result.result).output });
  } catch (error) {
    console.log(error);
    res.status(400).json({ verifyVC: false, credential: error });
  }
});

router.post("/zkp-verify", async (req, res) => {
  console.log("/zkp-verify in zenroomRouter");
  console.log("req.query", req.query);
  console.log("req.body", req.body);

  const { did } = req.query;
  const { claim, credential_proof } = req.body 

  const issuer = await IssuerModel.findOne({did})

  if(!issuer){
    return res.status(404).json({error:'issuer not found'})
  }
  
  const public_key = JSON.stringify(
    {
      [did]:{
        issuer_public_key: JSON.parse(issuer.issuer_public_keys)?.zkp[claim]?.issuer_public_key
      }
    }
  );

  const data = JSON.stringify({
    did,
    credential_proof
  })

  try {
    const result = await zencode_exec(verifyZkp, {
      data: data,
      keys: public_key,
      conf: `color=0, debug=0`,
    });

    res.status(200).json({ verifyZkp: true, result: JSON.parse(result.result).output });
  } catch (error) {
    console.log(error);
    res.status(400).json({ verifyZkp: false, result: error });
  }
});

router.get("/public_key", async (req, res) => {
  const {did} = req.query;

  const issuer = await IssuerModel.findOne({did})

  if(issuer){
    return res.status(200).json(JSON.parse(issuer.issuer_public_keys));
  }

  return res.status(404).json({error:'issuer not found'})
});

router.get("/credentials/examples/v1", async (req, res) => {
  res.status(200).json(ExampleV1);
});

router.get("/credentials/v1", async (req, res) => {
  res.status(200).json(CredentialsV1);
});

router.post("/create-credential-request", async (req, res) => {
  console.log("/create-credential-request in zenroomRouter");

  const {credential, userId, data, claim} = req.body;

  if(!credential || !userId || !data || !claim){
    return res.status(400).json(
      {
        error:'you need to send all the necesary information to create the request'
      }
    )
  }

  try {
    const credential_request = await CredentialRequestModel.create({
      credential,
      userId,
      data,
      claim,
      createdAt: Date.now()
    });

    res.status(200).json({credential_request});
  } catch (error) {
    console.log(error);
    res.status(500).json({error:'error creating credential request'});
  }
});

router.post("/check-pending-request", async (req, res) => {
  const {userId} = req.body;
  console.log(req.body);
  try{
    const pendingRequest = await CredentialRequestModel.find(
      {
        userId,
        recived: false,
        $or:[
          {status:CREDENTIAL_REQUEST_STATUS_APPROVED},
          {status:CREDENTIAL_REQUEST_STATUS_DECLINED}
        ]
      }
    )
    console.log('pendingRequest', pendingRequest)
      
    if(!pendingRequest){
      return res.status(200).json({pendingRequest:[]});
    }
    return res.status(200).json({pendingRequest});
  }catch(err){
    console.log(err)
    res.status(500).json({error:'error retrieving non recived credential request'}); 
  }
})

export default router;