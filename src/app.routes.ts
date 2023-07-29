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
    searchExact: userRoot,
    searchById: `${userRoot}/:id`,
    search: `${userRoot}/search`,
    delete: `${userRoot}/:id`,
  },
  guest: {
    root: guestRoot,
    create: guestRoot,
    update: `${guestRoot}/:id`,
    searchExact: guestRoot,
    searchById: `${guestRoot}/:id`,
    search: `${guestRoot}/search`,
    delete: `${guestRoot}/:id`,
  },
  event: {
    root: eventRoot,
    create: eventRoot,
    update: `${eventRoot}/:id`,
    searchExact: eventRoot,
    searchById: `${eventRoot}/:id`,
    search: `${eventRoot}/search`,
    delete: `${eventRoot}/:id`,
  },
  code: {
    root: codeRoot,
    create: codeRoot,
    update: `${codeRoot}/:id`,
    updateByEventId: `${codeRoot}/event/:eventId`,
    searchExact: codeRoot,
    searchById: `${codeRoot}/:id`,
    searchByEventId: `${codeRoot}/event/:eventId`,
    delete: `${codeRoot}/:id`,
    findWithSearch: `${codeRoot}/search`,
    findByUuid: `${codeRoot}/uuid/:uuid`,
  },
  guestCode: {
    root: guestCodeRoot,
    create: guestCodeRoot,
    searchExact: guestCodeRoot,
    search: `${guestCodeRoot}/search`,
    searchById: `${guestCodeRoot}/:id`,
    update: `${guestCodeRoot}/:id`,
    updateByUuid: `${guestCodeRoot}/uuid/:uuid`,
  },
};
