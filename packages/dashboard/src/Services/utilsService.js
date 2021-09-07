import { ROLE_ADMIN, ROLE_PUBLISHER } from "../Constants";

export const getRoleFromUserClaims = (claims) =>
  claims.publisher ? ROLE_PUBLISHER : claims.admin ? ROLE_ADMIN : "";

export const getBrowserLocale = () => navigator.language || "en-US";
