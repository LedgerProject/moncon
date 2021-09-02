export const ROLE_PUBLISHER = 'publisher';
export const ROLE_ADMIN = 'admin';
export const ROLES_PAGES = {
  [ROLE_PUBLISHER]: [
    {
      name: 'Dashboard',
      path: '/publishers',
    },
    {
      name: 'My Content',
      path: '/mycontent'
    },
  ],
  [ROLE_ADMIN]: [],
}
export const ROLES_DEFAULT_ROUTES = {
  [ROLE_PUBLISHER]: '/publishers',
  [ROLE_ADMIN]: '/admin',
};

export const LS_KEY_TOKEN = 't';
export const LS_KEY_ROLE = 'r';

export const NORMALIZE_AMOUNT = 100
export const AMOUNT_TO_DISPLAY = (amount) => amount / NORMALIZE_AMOUNT
export const AMOUNT_TO_STORE = (amount) => amount * NORMALIZE_AMOUNT