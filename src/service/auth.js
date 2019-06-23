import React, {useEffect, useCallback, useMemo} from 'react';
import {useSelector, useDispatch, useStore} from 'react-redux';
import {getCookie, setCookie} from 'utility';
import {useAPI, useAPICall, useResource} from 'apiclient';
import {URL} from 'config';

// Actions

const LOGIN_SUCCESS = Symbol('LOGIN_SUCCESS');
const LoginSuccess = (userid, authTags, timeEnd) => ({
  type: LOGIN_SUCCESS,
  userid,
  authTags,
  timeEnd, // timeEnd is in seconds
});

const secondsDay = 86400;

const LOGIN_REFRESH = Symbol('LOGIN_REFRESH');
const Refresh = () => ({
  type: LOGIN_REFRESH,
  time: Date.now() / 1000 + secondsDay, // time is in seconds
});

const NOT_LOGGEDIN = Symbol('NOT_LOGGEDIN');
const NotLoggedIn = () => ({type: NOT_LOGGEDIN});

const LOGOUT = Symbol('LOGOUT');
const Logout = () => ({type: LOGOUT});

// Reducer

const defaultState = Object.freeze({
  valid: false,
  loggedIn: false,
  userid: '',
  authTags: '',
  timeEnd: 0,
  timeRefresh: 0,
});

const initState = () => {
  const k = {valid: true};
  if (getCookie('refresh_valid') === 'valid') {
    k.loggedIn = true;
    k.userid = getCookie('userid');
    k.authTags = getCookie('auth_tags').replace(/^"+|"+$/g, '');
  }
  return Object.assign({}, defaultState, k);
};

const Auth = (state = initState(), action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        loggedIn: true,
        userid: action.userid,
        authTags: action.authTags,
        timeEnd: action.timeEnd,
      });
    case LOGIN_REFRESH:
      return Object.assign({}, state, {
        timeRefresh: action.time,
      });
    case NOT_LOGGEDIN:
      return Object.assign({}, state, {
        loggedIn: false,
      });
    case LOGOUT:
      return Object.assign({}, defaultState, {valid: true});
    default:
      return state;
  }
};

// Hooks

const selectReducerAuth = (store) => store.Auth;

const useAuthState = () => useSelector(selectReducerAuth);

const selectAPILogin = (api) => api.u.auth.login;

const useLoginCall = (username, password) => {
  const dispatch = useDispatch();
  const [apiState, execute] = useAPICall(selectAPILogin, [username, password], {
    userid: '',
    authTags: '',
    time: 0,
  });

  const login = useCallback(async () => {
    const [data, status, err] = await execute();
    if (err) {
      return;
    }
    const {userid, authTags, time} = data;
    dispatch(Refresh());
    dispatch(LoginSuccess(userid, authTags, time));
  }, [dispatch, execute]);

  return [apiState, login];
};

const selectAPIExchange = (api) => api.u.auth.exchange;

const selectAPIRefresh = (api) => api.u.auth.refresh;

const useRelogin = () => {
  const dispatch = useDispatch();
  const store = useStore();
  const execEx = useAPI(selectAPIExchange);
  const execRe = useAPI(selectAPIRefresh);

  const relogin = useCallback(async () => {
    const {loggedIn, timeEnd, timeRefresh} = store.getState().Auth;
    if (!loggedIn) {
      return [null, -1, 'Not logged in'];
    }
    if (Date.now() / 1000 + 15 < timeEnd) {
      return [null, 0, null];
    }
    const refreshValid = getCookie('refresh_valid');
    if (refreshValid !== 'valid') {
      dispatch(NotLoggedIn());
      return [null, -1, 'Session expired'];
    }
    if (Date.now() / 1000 > timeRefresh) {
      const [data, status, err] = await execRe();
      if (err) {
        dispatch(NotLoggedIn());
        return [data, status, err];
      }
      dispatch(Refresh());
    }
    const [data, status, err] = await execEx();
    if (err) {
      dispatch(NotLoggedIn());
      return [data, status, err];
    }
    const {userid, authTags, time} = data;
    dispatch(LoginSuccess(userid, authTags, time));
    return [data, status, err];
  }, [dispatch, store, execEx, execRe]);

  return relogin;
};

const useAuth = (callback) => {
  const relogin = useRelogin();
  const store = useStore();

  const exec = useCallback(async () => {
    const [data, status, err] = await relogin();
    if (err) {
      return err;
    }
    return callback(store.getState().Auth);
  }, [relogin, store, callback]);

  return exec;
};

const useAuthResource = (selector, args, initState) => {
  const relogin = useRelogin();

  const prehook = useCallback(async () => {
    const [data, status, err] = await relogin();
    return err;
  }, [relogin]);

  return useResource(selector, args, initState, prehook);
};

const useLogout = () => {
  const dispatch = useDispatch();
  const logout = useCallback(() => {
    setCookie('access_token', 'invalid', '/api', 0);
    setCookie('refresh_token', 'invalid', '/api/u/auth', 0);
    setCookie('refresh_valid', 'invalid', '/', 0);
    setCookie('auth_tags', 'invalid', '/', 0);
    setCookie('userid', 'invalid', '/', 0);
    dispatch(Logout());
  }, [dispatch]);
  return logout;
};

// Higher Order

const Protected = (child, allowedAuth) => (props) => {
  const history = props.history;
  const navigateLogin = useCallback(() => {
    history.replace(URL.login);
  }, [history]);
  const {valid, loggedIn, authTags} = useAuthState();

  useEffect(() => {
    if (valid && !loggedIn) {
      navigateLogin();
    }
  }, [valid, loggedIn]);

  const authorized = useMemo(() => {
    if (!allowedAuth) {
      return true;
    }
    const authTagSet = new Set(authTags.split(','));
    if (!Array.isArray(allowedAuth)) {
      return authTagSet.has(allowedAuth);
    }
    const intersection = new Set(allowedAuth.filter((x) => authTagSet.has(x)));
    return intersection.size > 0;
  }, [allowedAuth, authTags]);

  if (!authorized) {
    return (
      <Section container padded narrow>
        Unauthorized
      </Section>
    );
  }
  return React.createElement(child, props);
};

const AntiProtected = (child) => (props) => {
  const history = props.history;
  const navigateHome = useCallback(() => {
    history.replace(URL.home);
  }, [history]);
  const {loggedIn} = useAuthState();

  useEffect(() => {
    if (loggedIn) {
      navigateHome();
    }
  }, [loggedIn]);

  return React.createElement(child, props);
};

export {
  Auth as default,
  Auth,
  useAuthState,
  useLoginCall,
  useRelogin,
  useAuth,
  useAuthResource,
  useLogout,
  Protected,
  AntiProtected,
};
