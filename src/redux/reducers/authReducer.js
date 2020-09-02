import { CHANGE_LOGGED_IN_FLAG, SET_CURRENT_USER } from '../constants';

const initialState = {
  isLoggedIn: false,
  currentUser: null,
};

let user = window.localStorage.getItem('x-hypr-user');

if (user) {
  initialState.isLoggedIn = true;
  initialState.currentUser = JSON.parse(user);
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_LOGGED_IN_FLAG:
      return { ...state, isLoggedIn: action.isLoggedIn };
    case SET_CURRENT_USER:
      return { ...state, isLoggedIn: true, currentUser: action.currentUser };
    default:
      return state;
  }
};

export default reducer;
