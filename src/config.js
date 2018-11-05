const apibase = APIBASE_URL;
const healthzbase = apibase + '/healthz';
const setupzbase = apibase + '/setupz';
const ubase = apibase + '/u';
const userbase = ubase + '/user';
const passwordbase = userbase + '/password';
const authbase = ubase + '/auth';
const profilebase = apibase + '/profile';
const courierbase = apibase + '/courier';
const courierlink = courierbase + '/link';

const API = {
  setupz: setupzbase,
  healthz: {
    check: healthzbase + '/check',
  },
  u: {
    user: {
      new: userbase,
      confirm: userbase + '/confirm',
      password: {
        forgot: passwordbase + '/forgot',
        confirm: passwordbase + '/forgot/reset',
      },
      id: userbase + '/id/{0}',
      name: userbase + '/name/{0}',
      idprivate: userbase + '/id/{0}/private',
      nameprivate: userbase + '/name/{0}/private',
      get: userbase,
      sessions: userbase + '/sessions',
      edit: userbase,
      email: {
        edit: userbase + '/email',
        confirm: userbase + '/email/verify',
      },
      editpassword: userbase + '/password',
      rank: userbase + '/id/{0}/rank',
    },
    auth: {
      login: authbase + '/login',
      exchange: authbase + '/exchange',
      refresh: authbase + '/refresh',
    },
  },
  profile: {
    new: profilebase,
    edit: profilebase,
    get: profilebase,
    image: profilebase + '/image',
    id: profilebase + '/{0}',
    idimage: profilebase + '/{0}/image',
  },
  courier: {
    link: {
      get: courierlink + '?amount={0}&offset={1}',
      new: courierlink,
      id: courierlink + '/{0}',
    },
  },
};

const mountainPreview =
  'data:image/jpeg;base64,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';

const thamesPreview =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA8ADwAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAYACoDAREAAhEBAxEB/8QAGwAAAQQDAAAAAAAAAAAAAAAABQIEBgcACAn/xAAsEAABAwMCAgkFAAAAAAAAAAABAgMEAAUREiEGEwcjMTJBUWGDkSKhwdHw/8QAGQEBAQADAQAAAAAAAAAAAAAAAQIDBAUA/8QAIBEAAgIABwEBAAAAAAAAAAAAAAECEQMEEhMUIUEFUf/aAAwDAQACEQMRAD8AtluVbFuKAuEfOTnrh+6xPPteMFkU/QpDVb1Y0zWD7wqH9BGVZILRmopGRJaPuCjnJjxWh/CbjOpCmpLSwQFbLB2O4quQmGyFYbCUKCtafmjdTHQ0FUuJwN0/NVrQaWc3mrnOfuT7bcheQpZALgT4nzrekklZy4t3RieILskZbcfAT2qydvCpeHH0tTl4WNwmHZUaO9Nel63EB0BErSCN8DG/8a13hGZYgi6XziOx3aQ+yh0xU6BrSSRpA2zv96NiMonnjSjLoMWjpQuKYTjhkkhIOU8zceGcZrXnle+jPDNuuw5E6RLuuIys3VzKm0nt9KNgeSa4TkPx7k+BEd76snQcjeuxSOXbFIlTOQ80mO91iAnuHb6gfxUyinTLhJq0S2FPlNIiDkO6o4CBlJGBjBoSVEtuySQb6tYW28w4pLgAIKTUuIqbIxxJZluSnZVtQtCNjywg49aUv0GxzDNyERkGK9s2kdw+VToRaZ//2Q';

export {API, mountainPreview, thamesPreview};
