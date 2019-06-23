import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import Health from 'reducer/health';
import Settings from 'service/settings';

const store = createStore(
  combineReducers({
    Health,
    Settings,
  }),
  applyMiddleware(thunk),
);

export default store;
