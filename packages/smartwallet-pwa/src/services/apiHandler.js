import apiService from "./apiService";

export const createRequestToIssuer = async (credential, userId, data, claim) => {
  return await apiService.post("/zenroom/create-credential-request",{credential, userId, data, claim});
};