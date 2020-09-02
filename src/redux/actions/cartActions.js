import { ADD_TO_CART, CLEAR_CART } from '../constants';
import { REMOVE_FROM_CART } from '../constants';
import { UPDATE_CART } from '../constants'
import { UPDATE_CART_ITEMS } from '../constants'
import http from '../../services/axios';

// export const addToLocalCart = (product) => {
//     return {
//         type: ADD_TO_CART,
//         payload: product
//     }
// }

export const updateCart = (cart) => {
    return {
        type: UPDATE_CART,
        payload: cart
    }
}

export const updateCartItems = (cartItems) => {
    return {
        type: UPDATE_CART_ITEMS,
        payload: cartItems
    }
}

export const clearCart = (args) => {
    return {
        type: CLEAR_CART,
        payload: args
    }
}


// export const removeFromCart = (product) => {
//     return {
//         type: REMOVE_FROM_CART,
//         payload: product
//     }
// }

// export const addToCart = (locationId, product) => {
//     return async (dispatch) => {
//         let items = window.localStorage.getItem('x-cart-items');
//         //items = items ? items.push(product) : [];
//         if (items) {
//             let cart = window.localStorage.getItem('x-cart');
//             const result = await http.post('/order/updateOrderFromCart',
//                 { cartId: cart.id, cartItems: items })
//             console.log('result from update order========', result);
//         } else {
//             items = [];
//             items.push(product);
//             const result = http.post('/order/createOrderFromCart',
//                 { location_id: locationId, cartItems: items });
//             window.localStorage.setItem('x-cart', JSON.stringify(result.data));
//             dispatch(addToLocalCart(result.data.result.cartItems));

//         }
//     }
// }