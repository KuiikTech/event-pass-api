// Root
const homeRoot = '';
const authRoot = 'auth';
const userRoot = 'user';
const guestRoot = 'guest';
const eventRoot = 'event';

// Api versions
const v1 = 'v1';

// Routes
export const routesV1 = {
  version: v1,
  home: {
    root: homeRoot,
  },
  auth: {
    root: authRoot,
    register: `${authRoot}/register`,
    login: `${authRoot}/login`,
  },
  user: {
    root: userRoot,
    create: userRoot,
    update: `${userRoot}/:id`,
    findById: `${userRoot}/:id`,
    delete: `${userRoot}/:id`,
  },
  guest: {
    root: guestRoot,
    create: guestRoot,
    update: `${guestRoot}/:id`,
    findById: `${guestRoot}/:id`,
    delete: `${guestRoot}/:id`,
  },
  event: {
    root: eventRoot,
    create: eventRoot,
    update: `${eventRoot}/:id`,
    findById: `${eventRoot}/:id`,
    delete: `${eventRoot}/:id`,
  },
};
