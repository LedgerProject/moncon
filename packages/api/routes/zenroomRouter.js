import express from "express";
import { zencode_exec } from "zenroom";
import { DateTime } from "luxon";
import ExampleV1 from "../JsonLDTemplates/ExampleV1.js";
import CredentialsV1 from "../JsonLDTemplates/CredentialsV1.js";
import {
  KeyPair as issuerKeypar,
  public_key,
} from "../services/credentialIssuerKeypar.js";
import {
  singVC,
  verifyVC,
} from "../services/credentials/contract/contracts.js";

const router = express.Router();

router.get("/credentialIssuerVerifier", async (req, res) => {
  console.log("/credentialIssuerVerifier in zenroomRouter");
  console.log("req.body", req.body);
  try {
    const credentia = req.body;
    const result = await zencode_exec(verifyVC, {
      data: JSON.stringify(credentia),
      keys: public_key,
      conf: `color=0, debug=0`,
    });
    res.status(200).send({ verifyVC: true, result: result.result });
  } catch (error) {
    console.log(error);
    res.status(400).send({ verifyVC: false, credentia: error });
  }
});

router.get("/public_key", async (req, res) => {
  res.status(200).send(JSON.parse(public_key).Issuer);
});

router.get("/credentials/examples/v1", async (req, res) => {
  res.status(200).send(ExampleV1);
});

router.get("/credentials/1", async (req, res) => {
  res
    .status(200)
    .send({ id: "did:moncon:6bcccb8b-a828-411d-8c98-b42a81855f74" });
});
router.get("/credentials/v1", async (req, res) => {
  res.status(200).send(CredentialsV1);
});

router.post("/credentialIssuerSignRequest", async (req, res) => {
  try {
    const { credentialSubject } = req.body;
    console.log(credentialSubject, "credentialSubject");
    const zenData = {
      "my-vc": {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://www.w3.org/2018/credentials/examples/v1",
        ],
        id: `${process.env.API_URL_CREDENTIAL}/credentials/1`,
        type: ["VerifiableCredential"],
        issuer: "https://moncon.co/",
        issuanceDate: DateTime.now().toString(DateTime.DATETIME_FULL),
        credentialSubject,
      },
    };

    const result = await zencode_exec(singVC, {
      data: JSON.stringify(zenData),
      keys: issuerKeypar,
      conf: `color=0, debug=0`,
    });
    res.status(200).send(JSON.parse(result.result));
  } catch (error) {
    console.log(error);
    res.status(400).send({ ready: false, error });
  }
});

export default router;
