// Root
const homeRoot = '';
const authRoot = 'auth';
const userRoot = 'user';
const guestRoot = 'guest';
const eventRoot = 'event';
const codeRoot = 'code';
const guestCodeRoot = 'guest-code';

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
    findWithSearch: `${userRoot}/search`,
    delete: `${userRoot}/:id`,
  },
  guest: {
    root: guestRoot,
    create: guestRoot,
    update: `${guestRoot}/:id`,
    findById: `${guestRoot}/:id`,
    findWithSearch: `${guestRoot}/search`,
    delete: `${guestRoot}/:id`,
  },
  event: {
    root: eventRoot,
    create: eventRoot,
    update: `${eventRoot}/:id`,
    findById: `${eventRoot}/:id`,
    findWithSearch: `${eventRoot}/search`,
    delete: `${eventRoot}/:id`,
  },
  code: {
    root: codeRoot,
    create: codeRoot,
    update: `${codeRoot}/:id`,
    updateByEventId: `${codeRoot}/event/:eventId`,
    findById: `${codeRoot}/:id`,
    findByEventId: `${codeRoot}/event/:eventId`,
    delete: `${codeRoot}/:id`,
    findWithSearch: `${codeRoot}/search`,
    findByUuid: `${codeRoot}/uuid/:uuid`,
  },
  guestCode: {
    root: guestCodeRoot,
    create: guestCodeRoot,
    update: `${guestCodeRoot}/:id`,
    updateByUuid: `${guestCodeRoot}/uuid/:uuid`,
  },
};
