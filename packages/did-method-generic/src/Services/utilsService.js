import { ROLE_ADMIN, ROLE_PUBLISHER, ROLE_ISSUER } from "../Constants";

export const getRoleFromUserClaims = (claims) => {
  console.log('claims',claims);
  return claims.publisher ? ROLE_PUBLISHER : claims.admin ? ROLE_ADMIN : claims.issuer ? ROLE_ISSUER : "";
}

export const getBrowserLocale = () => navigator.language || "en-US";
