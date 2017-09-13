import {API} from 'config';
import {isWeb, getCookie} from 'utility';

const LOGIN = Symbol('LOGIN');
const RELOGIN = Symbol('RELOGIN');
const LOGIN_REFRESH = Symbol('LOGIN_REFRESH');
const LOGIN_SUCCESS = Symbol('LOGIN_SUCCESS');
const LOGIN_ERR = Symbol('LOGIN_ERR');

// timeEnd is in seconds
const LoginSuccess = (timeEnd, userid, authTags, username, firstname, lastname)=>{
  return {
    type: LOGIN_SUCCESS,
    timeEnd,
    userid,
    authTags,
    username,
    firstname,
    lastname,
  };
};

const LoginErr = (err)=>{
  return {
    type: LOGIN_ERR,
    err,
  };
};

const Refresh = ()=>{
  return {
    type: LOGIN_REFRESH,
    time: Date.now() / 1000 + 86400,
  };
};

const Login = (username, password)=>{
  return async (dispatch)=>{
    dispatch({
      type: LOGIN,
    });
    try {
      const response = await fetch(API.u.auth.login, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        //TODO: change to same-origin
        credentials: 'include',
        body: JSON.stringify({username,password}),
      });
      const status = response.status;
      if(status < 200 || status >= 300){
        throw new Error('Incorrect username or password');
      }
      const data = await response.json();
      if(!data.valid){
        throw new Error('Incorrect username or password');
      }
      const time = data.claims.exp;
      const userid = data.claims.userid;
      const authTags = new Set(data.claims.auth_tags.split(','));
      const firstname = data.first_name;
      const lastname = data.last_name;
      dispatch(Refresh());
      dispatch(LoginSuccess(time, userid, authTags, username, firstname, lastname));
    } catch(e){
      dispatch(LoginErr(e.message));
    }
  };
};

const ReLogin = ()=>{
  return async (dispatch, getState)=>{
    dispatch({
      type: RELOGIN,
    });
    try {
      const {loggedIn, timeEnd, timeRefresh} = getState().Auth;
      if(!loggedIn){
        return {
          relogin: true,
        };
      }

      if(timeEnd < Date.now() / 1000 + 15){
        const refreshToken = getCookie('refresh_token');
        if(!refreshToken){
          throw new Error('Unable to refresh authentication');
        }
        if(timeRefresh && timeRefresh < Date.now() / 1000){
          const response = await fetch(API.u.auth.refresh, {
            method: 'POST',
            //TODO: change to same-origin
            credentials: 'include',
          });
          const status = response.status;
          if(status < 200 || status >= 300){
            throw new Error('Unable to refresh authentication');
          }
          const data = await response.json();
          if(!data.valid){
            throw new Error('Unable to refresh authentication');
          }
          dispatch(Refresh());
        }
        const response = await fetch(API.u.auth.exchange, {
          method: 'POST',
          //TODO: change to same-origin
          credentials: 'include',
        });
        const status = response.status;
        if(status < 200 || status >= 300){
          throw new Error('Unable to refresh authentication');
        }
        const data = await response.json();
        if(!data.valid){
          throw new Error('Unable to refresh authentication');
        }
        const time = data.claims.exp;
        const userid = data.claims.userid;
        const authTags = new Set(data.claims.auth_tags.split(','));
        const {username, firstname, lastname} = getState().Auth;
        dispatch(LoginSuccess(time, userid, authTags, username, firstname, lastname));
      }
    } catch(e){
      dispatch(LoginErr(e.message));
      return {
        relogin: true,
      };
    }
    return {
      relogin: false,
    };
  };
};

const defaultState = {
  loading: false,
  loggedIn: false,
  timeEnd: false,
  timeRefresh: false,
  err: false,
  userid: '',
  username: '',
  firstname: '',
  lastname: '',
  authTags: new Set(),
};

const initState = ()=>{
  const k = {};
  if(getCookie('refresh_token')){
    k.loggedIn = true;
  }
  return Object.assign({}, defaultState, k);
};

const Auth = (state=initState(), action)=>{
  switch(action.type){
    case LOGIN:
    case RELOGIN:
      return Object.assign({}, state, {
        loading: true,
      });
    case LOGIN_REFRESH:
      return Object.assign({}, state, {
        timeRefresh: action.time,
      });
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loggedIn: true,
        timeEnd: action.timeEnd,
        err: false,
        userid: action.userid,
        username: action.username,
        firstname: action.firstname,
        lastname: action.lastname,
        authTags: action.authTags,
      });
    case LOGIN_ERR:
      return Object.assign({}, state, {
        loading: false,
        loggedIn: false,
        err: action.err,
      });
    default:
      return state;
  }
};

export {
  Auth, Login, ReLogin,
}