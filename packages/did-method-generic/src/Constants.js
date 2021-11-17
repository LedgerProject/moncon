export const ROLE_PUBLISHER = "publisher";
export const ROLE_ADMIN = "admin";
export const ROLE_ISSUER = 'issuer';
export const ROLES_PAGES = {
  [ROLE_PUBLISHER]: [
    {
      name: "Dashboard",
      path: "/publishers",
    },
    {
      name: "My Content",
      path: "/mycontent",
    },
  ],
  [ROLE_ADMIN]: [],
  [ROLE_ISSUER]:[]
};
export const ROLES_DEFAULT_ROUTES = {
  [ROLE_PUBLISHER]: "/publishers",
  [ROLE_ADMIN]: "/admin",
  [ROLE_ISSUER]: "/issuer",
};

export const LS_KEY_TOKEN = "t";
export const LS_KEY_ROLE = "r";

export const credential_mobile = "credential_mobile";

export const credential_email = "credential_email";

export const credential_country = "credential_country";

export const credential_region = "credential_region";

export const credential_birthday = "credential_birthday";

export const CREDENTIAL_SUPPORT_ZKP = [
  credential_birthday,
  credential_country,
];

export const CONDITION_TYPE_TO_CREDENTIAL = {
  age: credential_birthday,
  nationality: credential_country,
};

export const NORMALIZE_AMOUNT = 100;
export const AMOUNT_TO_DISPLAY = (amount) => amount / NORMALIZE_AMOUNT;
export const AMOUNT_TO_STORE = (amount) => amount * NORMALIZE_AMOUNT;
