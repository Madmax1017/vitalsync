const TOKEN_KEY = 'vitalsync_auth_token';
const ROLE_KEY = 'vitalsync_auth_role';
const EMAIL_KEY = 'vitalsync_auth_email';

export const setAuthSession = ({ token, role, email }) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
  localStorage.setItem(EMAIL_KEY, email || '');
};

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

export const getAuthRole = () => localStorage.getItem(ROLE_KEY);

export const isAuthenticatedForRole = (requiredRole) => {
  const token = getAuthToken();
  const role = getAuthRole();

  if (!token || !role) {
    return false;
  }

  if (!requiredRole) {
    return true;
  }

  return role === requiredRole;
};

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(EMAIL_KEY);
};
