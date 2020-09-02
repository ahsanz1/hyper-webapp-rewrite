import { combineReducers } from 'redux';

import authReducer from './authReducer';
import mainReducer from './mainReducer';
import cartReducer from './cartReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  main: mainReducer,
  cart: cartReducer
});

export default rootReducer;
