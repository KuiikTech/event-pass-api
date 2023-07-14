// Root
const homeRoot = '';
const authRoot = 'auth';

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
};
