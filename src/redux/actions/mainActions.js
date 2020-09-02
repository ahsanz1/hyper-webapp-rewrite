import { SET_ERROR, IS_CHECKOUT } from '../constants';
import { SET_STORE } from '../constants';

export const setStore = (store = '') => {
  return {
    type: SET_STORE,
    payload: store
  }
}

export const setIsCheckout = (isCheckout = false) => {
  return {
    type: IS_CHECKOUT,
    payload: isCheckout
  }
}


export const setError = (error = '') => {
  return {
    type: SET_ERROR,
    error,
  };
};
