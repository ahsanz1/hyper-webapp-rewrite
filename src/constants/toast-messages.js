import { getLocal } from "../utils/local-storage-utils";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

export const toastMessages = {
    cartEmpty: 'Cart is empty!',
    deliveryAddressError: 'Delivery address not complete / confirmed',
    deliveryDateError: 'Delivery date not added',
    creditCardError: 'There was some problem processing your payment details',
    totalLessThan10: `Order should be ${getLocal('currency')} 10 or more
                        to pay with card`,
    couldntRemove: 'Could not remove item!',
    tipMissing: 'Please add a tip amount',
    orderError: 'There was some problem placing your order',
    otpWrong: 'OTP verification unsuccessful',
    qtyNotAvailable: 'The specified quantity is not available',
    cdntIncQty: 'Couldnt add specified quantity',
    removeSuccess: 'Item removed successfully',
    orderSuccessful: 'Order placed sucessfully'
}

export const showToast = (message) => {
    toast(message, {
        position: "bottom-left",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: 'toastify-dark'
    });
}