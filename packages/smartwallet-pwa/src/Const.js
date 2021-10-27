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

export const credential_address = "credential_address";

export const credential_birthday = "credential_birthday";

export const CREDENTIAL_SUPPORT_ZKP = [
  credential_birthday
]; 

export const initialState = {
  name: { id: "name", value: "", status: false, pending:false, },
  lastName: { id: "lastName", value: "", status: false, pending:false, },
  [credential_email]: { id: credential_email, value: "", status: false, pending:false, },
  [credential_mobil]: { id: credential_mobil, value: "", status: false, pending:false, },
  [credential_birthday]: {
    id: credential_birthday,
    value: "",
    status: false,
    pending:false,
  },
  [credential_address]: {
    id: credential_address,
    value: {
      address_line_1: "",
      address_line_2: "",
      postal_code: "",
      city: "",
      country: "",
    },
    status: false,
    pending:false,
  },
  dynamicFields: [],
  articles: [],
};
