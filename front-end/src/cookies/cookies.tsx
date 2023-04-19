import cookie

export const loadUser = () => {
  return cookie.load('currentUser');
};
export const onLogin = user => {
  if (loadUser('currentUser')) logout('currentUser');
  cookie.save('currentUser', user, { path: '/' });
};

export const logout = () => {
  cookie.remove('currentUser');
};
