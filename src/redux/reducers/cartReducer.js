import { ADD_TO_CART, CLEAR_CART } from '../constants';
import { REMOVE_FROM_CART } from '../constants';
import { UPDATE_CART } from '../constants'
import { UPDATE_CART_ITEMS } from '../constants'
import { act } from 'react-dom/test-utils';

const initialState = {
    cart: {},
    cartItems: []
};

let cart = window.localStorage.getItem('x-cart');
let cartItems = window.localStorage.getItem('x-cart-items');

if (cart && cartItems) {
    initialState.cart = JSON.parse(cart);
    initialState.cartItems = JSON.parse(cartItems);
}

const reducer = (state = initialState, action) => {
    if (action.type === UPDATE_CART) {
        return { ...state, cart: action.payload }
    } else if (action.type === UPDATE_CART_ITEMS) {
        return {
            ...state, cartItems: action.payload
        }
    } else if (action.type === CLEAR_CART){
        return {
            ...state, cart: action.payload.cart, cartItems: action.payload.cartItems
        }
    }
    return state;
};

export default reducer;