export const ROLE_PUBLISHER = 'publisher';
export const ROLE_USER = 'user';
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
    {
      name: 'Create NFT Content',
      path: '/nfts'
    },
  ],
  [ROLE_USER]: [],
  [ROLE_ADMIN]: [],
}
export const ROLES_DEFAULT_ROUTES = {
  [ROLE_PUBLISHER]: '/publishers',
  [ROLE_USER]: '/users',
  [ROLE_ADMIN]: '/admin',
};

export const LS_KEY_TOKEN = 't';
export const LS_KEY_ROLE = 'r';