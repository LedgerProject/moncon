import apiService from "./apiService";
import {CREDENTIAL_SUPPORT_ZKP} from "../Const";
import {createZkpRequest} from "./zkpService";

export const createRequestToIssuer = async (credential, userId, data, claim) => {
  let sendData = {credential, userId, data, claim };
  if(CREDENTIAL_SUPPORT_ZKP.includes(credential)){
    const response = await createZkpRequest();
    sendData.credential_request = response.credential_request;
    localStorage.setItem(credential,JSON.stringify(response));
  }
  return await apiService.post("/zenroom/create-credential-request",sendData);
};