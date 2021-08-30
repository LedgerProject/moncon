import { ROLE_ADMIN, ROLE_PUBLISHER, ROLE_USER } from '../Constants';

export const getRoleFromUserClaims = (claims) => claims.publisher ? ROLE_PUBLISHER : claims.user ? ROLE_USER : claims.admin ? ROLE_ADMIN : '';

export const getBrowserLocale = () => navigator.language || 'en-US';
