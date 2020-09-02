import { CHANGE_LOGGED_IN_FLAG, SET_CURRENT_USER } from '../constants';
import { setError } from './mainActions';

import http from '../../services/axios';

export const changeLoggedInFlag = (isLoggedIn) => {
  return {
    type: CHANGE_LOGGED_IN_FLAG,
    isLoggedIn,
  };
};

export const setCurrentUser = (user) => {
  return {
    type: SET_CURRENT_USER,
    currentUser: user,
  };
};

export const login = (phone = '', password = '') => {
  console.log('password=======', password);
  return async (dispatch) => {
    
    try {
      let response = await http.post('/auth/signinCustomer', {phone: phone, password: password});
      let userObj = {token: response.data.data.token, user: response.data.data.user};
      //window.localStorage.setItem('x-sd-user', userObj.token);
      window.localStorage.setItem('x-hypr-user', JSON.stringify(userObj));
      console.log('userrr========', userObj)
      dispatch(setCurrentUser(userObj));
      dispatch(changeLoggedInFlag(true));
    } catch (err) {
      console.log('Error in getUserById', err.message);
      dispatch(setError(err.message));
    }
  };
};
