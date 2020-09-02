import { SET_ERROR, IS_CHECKOUT } from '../constants';
import { SET_STORE } from '../constants';
import { getLocal } from '../../utils/local-storage-utils';


const initialState = {
  error: null,
  store: '',
  isCheckout: false
};
//getLocal('isCheckout') ? getLocal('isCheckout') : false
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ERROR:
      return { ...state, error: action.error };
    case SET_STORE:
      return { ...state, store: action.payload };
    case IS_CHECKOUT:
      return { ...state, isCheckout: action.payload };
    default:
      return state;
  }
};

export default reducer;
