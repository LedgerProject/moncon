export const NOT_DISPAY_HEADER_IN = [
  "/identity/edit/name",
  "/identity/edit/email",
  "/identity/edit/mobile",
  "/identity/edit/postal",
  "/identity/edit/add",
  "/scan/recive",
  "/scan/auth",
  "/scan/share",
  "/scan/payment",
  "/scan",
];


export const LS_USER_KEY = "smartwallet-pwa-provitional-key";

export const LS_PAYMENT_METHOD_KEY = "pmid";

export const LS_CUSTOMER_KEY = "cid";

export const LS_DID_KEY = "did";

export const LS_PBKDF_KEY = "smartwallet-pwa-provitional-PBKDF-key";

export const LS_KEY_PAIR = "encryption-key";

export const credential_mobil = "credential_mobile";

export const credential_email = "credential_email";

export const credential_country = "credential_country";

export const credential_region = "credential_region";

export const credential_birthday = "credential_birthday";

export const CREDENTIAL_SUPPORT_ZKP = [
  credential_birthday,
  credential_country,
]; 

export const initialState = {
  name: { id: "name", value: "", status: false, pending:false, },
  lastName: { id: "lastName", value: "", status: false, pending:false, },
  [credential_email]: { id: credential_email, value: "", status: false, pending:false, },
  [credential_mobil]: { id: credential_mobil, value: "", status: false, pending:false, },
  [credential_birthday]: { id: credential_birthday, value: "", status: false, pending:false,},
  [credential_country]: { id: credential_country, value: "", status: false, pending:false,},
  [credential_region]: { id: credential_region, value: "", status: false, pending:false,},
  dynamicFields: [],
  articles: [],
};

const MB_IN_BYTES = 1048576//1.548.576
export const BYTES_TO_MB = (bytes) => (bytes / MB_IN_BYTES);
export const MAX_IMAGE_SIZE = 21 * MB_IN_BYTES;