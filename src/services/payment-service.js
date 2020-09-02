import http from './axios'

export const getCustomerPaymentMethods = async () => {
    try {
        const storeId = window.localStorage.getItem('storeId');
        const response = await http.post(`/stripe/getCustomerPaymentMethods`,
            JSON.stringify(
                {
                    location_id: storeId
                }));
        const paymentMethods = response.data.data;
        return paymentMethods;
    } catch (error) {
        console.log(error)
        console.log('paymentmethods=====', http.get);
    }
    return {};
}

export const attachPaymentMethodToCustomer = async (paymentMethod) => {
    try {
        const response = await http.post('/stripe/attachPaymentMethodToCustomer',
            JSON.stringify(paymentMethod));
            return response.data;
    } catch (error) {
        console.log(error)
    }
    return {};
}

