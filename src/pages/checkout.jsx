import React, { Component } from 'react'
import {
    Container, Row, Col, FormGroup, Label, Button,
    Collapse, CardHeader, CardBody, Card, Modal, ModalHeader,
    ModalBody, ModalFooter, Input, InputGroup, InputGroupText, Spinner
} from 'reactstrap'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import Datepicker from '../components/datepicker'
import { getCustomerPaymentMethods, attachPaymentMethodToCustomer } from '../services/payment-service'
import withRedux from '../redux';
import StripeCheckout from 'react-stripe-checkout';
import http from '../services/axios'
import { toastMessages, showToast } from '../constants/toast-messages'
import CardDetails from '../components/card-details'
import { getLocal, saveLocal, removeLocal } from '../utils/local-storage-utils'
import { Link, Redirect } from 'react-router-dom'
import ConsentItem from '../components/consent-item'


export class Checkout extends Component {
    constructor(props) {
        super(props)
        this.state = {
            submitDisabled: false,
            addrSec: true,
            delTimeSec: false,
            paySec: false,
            tipChecked: false,
            flatOpened: false,
            orderPercentOpened: false,
            tipType: 'FLAT',
            tipValue: 0,
            paymentMethods: {},
            PUBLISHABLE_KEY: '',
            cardId: null,
            paymentReference: null,
            isNewUser: true,
            formValues: null,
            consentItems: null,
            consentDone: false,
            consentModalOpen: false,
            isRemoving: false,
            cart: null,
            deliveryDate: new Date(),
            quantityReserved: false,
            isPlacingOrder: false,
            orderBody: null,
            orderPlaced: false,
            orderId: null
        }
    }

    handleValidations = (values) => {
        const errors = {};
        if (!values.name) {
            errors.name = 'Required';
        }
        if (!values.address1) {
            errors.address1 = 'Required';
        }
        if (!values.city) {
            errors.city = 'Required';
        }
        if (!values.postal) {
            errors.postal = 'Required';
        }
        return errors;
    }

    toggleAddrSec = () => { this.setState({ addrSec: !this.state.addrSec }) }
    toggleDelTimeSec = () => { this.setState({ delTimeSec: !this.state.delTimeSec }) }
    togglePaySec = () => { this.setState({ paySec: !this.state.paySec }) }


    getCustomerPaymentMethods = async () => {
        const paymentMethods = await getCustomerPaymentMethods();
        //returns list of cards and publishable key
        //if payment method.card length == 0, new user
        if (paymentMethods.cards) {
            if (paymentMethods.cards.length > 0) {
                await this.setState({
                    isNewUser: false,
                    cardId: paymentMethods.cards[0].id
                })
            }
        }
        await this.setState({
            paymentMethods: paymentMethods,
            PUBLISHABLE_KEY: paymentMethods.key
        });

    }

    componentDidMount() {
        if (this.props.cart.cart.cartItems) {
            if (this.props.cart.cart.cartItems.length > 0) {
                this.props.setIsCheckout(true);
                this.getCustomerPaymentMethods();
            }
        }
        //this.fetchCartData();
    }


    //returns credit card info encrypted in a token object,
    //object has tokenid and card object, card object has its
    //own id, we attach payment method to customer by sending
    //an object with token object's id and location id, after attach
    //is successful we set card id in token obj to our state

    onToken = (amount, description) => async (token) => {
        if (token) {
            let body = {
                paymentMethod: token.id,
                location_id: getLocal('storeId'),
            };
            const response = await attachPaymentMethodToCustomer(body);
            const result = await this.getCustomerPaymentMethods();
            this.setState({ cardId: token.card.id, isNewUser: false });
        } else {
            showToast(toastMessages.creditCardProblem);
        }
    };

    onDateSelect = (date) => {
        this.setState({ deliveryDate: date, delTimeSec: false, paySec: true });
    };


    saveFormValues = (values, { setSubmitting }) => {
        this.setState({ formValues: values, addrSec: false, delTimeSec: true });
        setSubmitting(false);
    }

    createOrderBody = () => {
        return {
            customerData: {
                customer_reference: this.props.auth.currentUser.user.phone,
                customer_reference_type: 'phone',
                address: this.state.formValues.address1,
                address_line_1: this.state.formValues.address1,
                address_line_2: this.state.formValues.address2,
                post_code: this.state.formValues.postal,
                city: this.state.formValues.city,
                name: this.props.auth.currentUser.user.name,
                location_cordinates: {
                    latitude: getLocal('latitude'),
                    longitude: getLocal('longitude'),
                },
                phone: this.props.auth.currentUser.user.phone,
            },
            location_id: getLocal('storeId'),
            cart_id: this.props.cart.cart.id,
            payment_type: 'CC',
            payment_reference: this.state.paymentReference,
            deliveryTime: this.state.deliveryDate,
            tip: this.state.tipValue,
            tipType: this.state.tipType
        }
    }

    reserveCart = async () => {
        try {
            const response = await http.post('/order/reservedQuantityByCart',
                JSON.stringify({ cartId: this.props.cart.cart.id }));
            //this.setState({ quantityReserved: true });
        } catch (error) {
            console.log(error)
        }
    }

    createPayment = async (paymentBody) => {
        try {
            const response = await http.post('/stripe/createPayment',
                JSON.stringify(paymentBody));
            //console.log('paymentRefadfafad', response)
            await this.setState({ paymentReference: response.data.data.chargeId });
        } catch (error) {
            console.log(error)
        }
    }
    //formValues, deliveryDate, paymentMethod, order > 10, tipOK

    orderChecks = () => {
        if (!this.state.formValues)
            return toastMessages.deliveryAddressError;
        if (!this.state.deliveryDate)
            return toastMessages.deliveryDateError;
        if (!this.state.cardId)
            return toastMessages.creditCardError;
        if (parseFloat(parseFloat(this.props.cart.cart.grand_total)
            + parseFloat(this.state.tipValue)).toFixed(2) < 10)
            return toastMessages.totalLessThan10;
        if (this.state.tipChecked && this.state.tipValue === 0)
            return toastMessages.tipMissing;
        return 'OK';
    }

    createOrder = async (orderBody) => {
        try {
            const response = await http.post('/order/placeOrderFromCart',
                JSON.stringify(orderBody));
            console.log('placeORder response', response)
            this.setState({ orderId: response.data.data.order.id, orderPlaced: true });
        } catch (error) {
            console.log(error);
        }
    }

    placeOrder = async () => {
        const message = this.orderChecks();
        console.log(message)
        if (message === 'OK') {
            try {
                if (!this.state.consentDone) {
                    const items = this.props.cart.cart.cartItems;
                    const consentItems = [];
                    items.forEach(item => {
                        if (item.consent_required) {
                            consentItems.push({
                                name: item.name,
                                sku: item.product_sku,
                                image_url: item.image_url
                            })
                        }
                    })
                    if (consentItems.length > 0) {
                        await this.setState({ consentItems: consentItems, consentModalOpen: true })
                        return;
                    };
                }

                this.setState({isPlacingOrder: true});
                await this.reserveCart();
                const price = parseFloat(this.props.cart.cart.grand_total).toFixed(2);
                const paymentBody = {
                    card_token: this.state.cardId,
                    location_id: getLocal('storeId'),
                    amount: price,
                }

                await this.createPayment(paymentBody);
                const order = this.createOrderBody();
                this.setState({ orderBody: order });

                await this.createOrder(order);
                showToast(toastMessages.orderSuccessful);
                console.log('ORDERplACED', this.state.orderPlaced);
                this.props.clearCart({
                    cart: {},
                    cartItems: []
                });
                removeLocal('x-cart');
                removeLocal('x-cart-id');
                removeLocal('x-cart-items');
                this.props.setIsCheckout(false);
                this.setState({isPlacingOrder: false});
                //this.props.history.push('/');
            } catch (error) {
                console.log(error);
            }
        } else {
            showToast(message);
        }
    }


    //has errors needs improvement

    handleTipChange = (event) => {
        if (event.target.value < 0) {
            //invalid tip
        } else {
            if (this.state.flatOpened) {
                this.setState({
                    tipValue: isNaN(parseFloat(event.target.value).toFixed(2)) ? 0 :
                        parseFloat(event.target.value).toFixed(2),
                    tipType: 'FLAT'
                })
            } else if (this.state.orderPercentOpened) {
                let total = parseFloat(this.props.cart.cart.grand_total) *
                    (parseFloat(event.target.value) / 100);
                this.setState({
                    tipValue: isNaN(total.toFixed(2)) ? 0 : total.toFixed(2),
                    tipType: 'PERCENTAGE'
                })
            }
        }
    }

    toggleTipSec = () => {
        this.setState({ tipChecked: !this.state.tipChecked, tipValue: 0 });
    }

    toggleFlatInput = () => {
        this.setState({ flatOpened: !this.state.flatOpened, orderPercentOpened: false })
    }

    toggleOrderPercentInput = () => {
        this.setState({ orderPercentOpened: !this.state.orderPercentOpened, flatOpened: false })
    }

    toggleConsentModal = () => {
        this.setState({ consentModalOpen: !this.state.consentModalOpen })
    }

    removeCartItem = async (sku) => {
        try {
            this.setState({ isRemoving: true })
            let cart = this.props.cart.cart;
            let cartItems = cart.cartItems;
            let index = cartItems.findIndex(item => item.product_sku == sku);
            if (index > -1) {
                cartItems.splice(index, 1);
            }

            const result = await http.post('/order/updateOrderFromCart',
                { cartId: cart.id, cartItems: cartItems })
            cart = result.data.data.result;
            saveLocal('x-cart', cart);
            saveLocal('x-cart-items', cartItems);
            this.props.updateCart(cart);
            this.props.updateCartItems(cartItems);
            if (cart.cartItems.length === 0) {
                window.localStorage.removeItem('x-cart-id');
                this.props.history.push('/');
            }
            let consentItems = this.state.consentItems;
            let cIndex = consentItems.findIndex(item => item.sku == sku);
            if (cIndex > -1) {
                consentItems.splice(cIndex, 1);
            }
            this.setState({ consentItems: consentItems, isRemoving: false })
        } catch (error) {
            console.log(error);
            showToast(toastMessages.couldntRemove);
        }
    }

    navigate = () => {
        this.props.history.push('/');
    }

    render() {
        //if removed item from cart is the only item and cart becomes empty then redirect
        //to storefront, if cart is empty, redirect to home as well
        return (
            <>
                {this.state.isPlacingOrder ? (
                    <Container style={{ minHeight: '100vh' }} className='d-flex flex-col align-items-center'>
                        <Row className='m-auto'>
                            <Col className='col-12'>
                                <Spinner className="color-orng" />
                            </Col>
                        </Row>
                    </Container>
                ) : (
                        <Container style={{ marginTop: '3rem' }} className='min-vh-100'>
                            {this.state.orderPlaced ? (
                                <Container
                                    className='h-50 w-50 shadow rounded'>
                                    <Row>
                                        <Col className='d-flex flex-column m-auto align-items-center p-5'>
                                            <h3 className='font-weight-bold'>THANK YOU!</h3>
                                            <img className='mt-2' src='/hypr_logo.png' style={{ width: '120px', height: '50px' }}></img>
                                            <h6 className='mt-3 font-weight-bold'>Thank you for placing your order at Hypr. Your order ID is {this.state.orderId}</h6>
                                            <Button onClick={this.navigate} className='continue-shop-btn mt-3'>
                                                Continue Shopping
                                        </Button>
                                        </Col>
                                    </Row>
                                </Container>
                            ) : (
                                    <Container>
                                        <Row>
                                            <Col className='bg-white col-8'>
                                                <Card className='mt-3'>
                                                    <CardHeader className='bg-white'>
                                                        <Button
                                                            color='link'
                                                            className='color-blue'
                                                            onClick={this.toggleAddrSec}>
                                                            <p className='font-weight-bold m-0'>Add delivery address</p>
                                                        </Button>
                                                    </CardHeader>
                                                    <Collapse isOpen={this.state.addrSec}>
                                                        <CardBody>
                                                            <Formik
                                                                initialValues={{
                                                                    name: '', address1: '',
                                                                    address2: '', city: '', postalCode: ''
                                                                }}
                                                                validate={this.handleValidations}
                                                                onSubmit={this.saveFormValues}
                                                            >
                                                                {(formParams) => {
                                                                    return (
                                                                        <Form className='text-left'>

                                                                            <FormGroup>
                                                                                <Label for='name'>Name</Label>

                                                                                <Field
                                                                                    type='text'
                                                                                    className='form-control'
                                                                                    placeholder='Your name'
                                                                                    name='name'
                                                                                />
                                                                                <ErrorMessage
                                                                                    name='name'
                                                                                    component='small'
                                                                                    className='text-danger'
                                                                                />

                                                                            </FormGroup>
                                                                            <FormGroup>
                                                                                <Label for='address1'>Address 1</Label>
                                                                                <Field
                                                                                    type='text'
                                                                                    className='form-control'
                                                                                    name='address1'
                                                                                    placeholder='Address 1'
                                                                                />
                                                                                <ErrorMessage
                                                                                    name='address1'
                                                                                    component='small'
                                                                                    className='text-danger'
                                                                                />
                                                                            </FormGroup>
                                                                            <FormGroup>
                                                                                <Label for='address1'>Address 2 (Optional)</Label>
                                                                                <Field
                                                                                    type='text'
                                                                                    className='form-control'
                                                                                    name='address2'
                                                                                    placeholder='Address 2'
                                                                                />
                                                                                <ErrorMessage
                                                                                    name='address2'
                                                                                    component='small'
                                                                                    className='text-danger'
                                                                                />
                                                                            </FormGroup>
                                                                            <FormGroup>
                                                                                <Label for='city'>City</Label>
                                                                                <Field
                                                                                    type='text'
                                                                                    className='form-control'
                                                                                    name='city'
                                                                                    placeholder='San Francisco'
                                                                                />
                                                                                <ErrorMessage
                                                                                    name='city'
                                                                                    component='small'
                                                                                    className='text-danger'
                                                                                />
                                                                            </FormGroup>
                                                                            <FormGroup>
                                                                                <Label for='postal'>Postal Code</Label>
                                                                                <Field
                                                                                    type='text'
                                                                                    className='form-control'
                                                                                    name='postal'
                                                                                    placeholder='54000'
                                                                                />
                                                                                <ErrorMessage
                                                                                    name='postal'
                                                                                    component='small'
                                                                                    className='text-danger'
                                                                                />
                                                                            </FormGroup>
                                                                            <Button
                                                                                className='btn btn-success'
                                                                                type='submit'
                                                                                disabled={formParams.isSubmitting}
                                                                                style={{ background: '#2b2f4c', borderColor: '#2b2f4c' }}
                                                                                block>
                                                                                Confirm
                                        </Button>
                                                                        </Form>
                                                                    )
                                                                }}
                                                            </Formik>
                                                        </CardBody>
                                                    </Collapse>
                                                </Card>
                                                <Card>
                                                    <CardHeader className='bg-white'>
                                                        <Button
                                                            color='link'
                                                            className='color-blue'
                                                            onClick={this.toggleDelTimeSec}>
                                                            <p className='font-weight-bold m-0'>Delivery time</p>
                                                        </Button>
                                                    </CardHeader>

                                                    <Collapse isOpen={this.state.delTimeSec}>
                                                        <CardBody>
                                                            <Datepicker onDateSelect={this.onDateSelect}></Datepicker>
                                                        </CardBody>
                                                    </Collapse>
                                                </Card>
                                                <Card className='mb-3'>
                                                    <CardHeader className='bg-white'>
                                                        <Button
                                                            color='link'
                                                            className='color-blue'
                                                            onClick={this.togglePaySec}
                                                        >
                                                            <p className='font-weight-bold m-0'>Add a payment method</p>
                                                        </Button>
                                                    </CardHeader>

                                                    <Collapse isOpen={this.state.paySec}>
                                                        <CardBody>
                                                            {this.state.isNewUser ? (
                                                                <>
                                                                    {this.state.PUBLISHABLE_KEY ? (
                                                                        <>
                                                                            <StripeCheckout
                                                                                className='pay-card'
                                                                                name={this.props.auth.currentUser.user.name}
                                                                                description=''
                                                                                amount={(parseFloat(this.props.cart.cart.grand_total) +
                                                                                    parseFloat(this.state.tipValue)) * 100}
                                                                                token={this.onToken((parseFloat(this.props.cart.cart.grand_total) +
                                                                                    parseFloat(this.state.tipValue)) * 100, '')}
                                                                                currency={getLocal(('currency'))}
                                                                                stripeKey={this.state.PUBLISHABLE_KEY}
                                                                                email={this.props.auth.currentUser.user.email}
                                                                                allowRememberMe
                                                                            />
                                                                        </>
                                                                    ) : (
                                                                            <div className='d-flex flex-row justify-content-center'>
                                                                                <Spinner
                                                                                    size='sm'
                                                                                    className='color-orng'>
                                                                                </Spinner>
                                                                            </div>
                                                                        )}

                                                                </>
                                                            ) : (
                                                                    <>
                                                                        {this.state.paymentMethods.cards ? (
                                                                            this.state.paymentMethods.cards.length > 0 ? (
                                                                                <>
                                                                                    <CardDetails card={this.state.paymentMethods.cards[0]}></CardDetails>
                                                                                </>
                                                                            ) : null

                                                                        ) : null}
                                                                    </>
                                                                )}
                                                        </CardBody>
                                                    </Collapse>
                                                </Card>
                                            </Col>

                                            <Col className='bg-white ml-3 col-3'>
                                                {/* <div className='mt-3 d-flex flex-column justify-content-left'>
                                <h6 className='text-left'>Delivery time and date.</h6>
                                <Datepicker></Datepicker>
                            </div> */}
                                                <Button
                                                    className='btn-block mt-3 place-order-btn'
                                                    onClick={this.placeOrder}>
                                                    Place Order
                            </Button>
                                                {/* <p className='mt-3'>Some error about checkout condition checks</p> */}
                                                <div className='border-bottom mt-4'>
                                                    <div className='d-flex flex-row justify-content-between'>
                                                        <h6>Subtotal</h6>
                                                        <p>{getLocal('currency')} {this.props.cart.cart.sub_total}</p>
                                                    </div>
                                                    <div className='d-flex flex-row justify-content-between'>
                                                        <h6>Delivery</h6>
                                                        <p>{getLocal('currency')} {this.props.cart.cart.delivery_charge}</p>
                                                    </div>
                                                    <div className='d-flex flex-row justify-content-between'>
                                                        <h6>Service fee</h6>
                                                        <p>{getLocal('currency')} {this.props.cart.cart.service_charge}</p>
                                                    </div>
                                                    <div className='d-flex flex-row justify-content-between'>
                                                        <h6>Taxes</h6>
                                                        <p>{getLocal('currency')} {parseFloat(this.props.cart.cart.tax).toFixed(2)}</p>
                                                    </div>
                                                </div>

                                                <div className='border-bottom mt-3'>
                                                    <div className='d-flex flex-row justify-content-between'>
                                                        <h5>Delivery tip</h5>
                                                        <Input type="checkbox" className='position-relative' onChange={this.toggleTipSec} />
                                                    </div>

                                                    <Collapse isOpen={this.state.tipChecked}>
                                                        <FormGroup check>
                                                            <Label check>
                                                                <Input type="radio"
                                                                    onChange={this.toggleFlatInput}
                                                                    checked={this.state.flatOpened} />
                                            Flat
                                        </Label>
                                                            <Collapse isOpen={this.state.flatOpened}>
                                                                <Input type="text" className='mb-2' onChange={this.handleTipChange} />
                                                            </Collapse>

                                                        </FormGroup>
                                                        <FormGroup check>
                                                            <Label check>
                                                                <Input type="radio" onChange={this.toggleOrderPercentInput} checked={this.state.orderPercentOpened} />
                                            Order %
                                        </Label>
                                                            <Collapse isOpen={this.state.orderPercentOpened}>
                                                                <Input type="number" className='mb-2' onChange={this.handleTipChange} />
                                                            </Collapse>
                                                        </FormGroup>
                                                    </Collapse>
                                                </div>
                                                <div className='d-flex flex-row justify-content-between mt-3'>
                                                    <h5>Total</h5>
                                                    <h5>{getLocal('currency') + ' '}
                                                        {isNaN(parseFloat(this.state.tipValue)) ? parseFloat(this.props.cart.cart.grand_total).toFixed(2) :
                                                            parseFloat(parseFloat(this.props.cart.cart.grand_total) +
                                                                parseFloat(this.state.tipValue)).toFixed(2)}</h5>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Container>
                                )}

                            <Modal isOpen={this.state.consentModalOpen}>

                                <ModalHeader >
                                    Consent Required
                                    </ModalHeader>

                                <ModalBody>
                                    <p>There are some items in our inventory that require the user to be
                                    18 years or older. If your'e not 18+ then please remove these items.
                        </p>
                                    <ul className='pl-0'>
                                        {this.state.consentItems ? (
                                            <>
                                                {this.state.isRemoving ? (
                                                    <div className='d-flex flex-row justify-content-center'>
                                                        <Spinner className='color-orng'></Spinner>
                                                    </div>
                                                ) : (
                                                        <>
                                                            {this.state.consentItems.map((item, index) => {
                                                                return (
                                                                    <ConsentItem
                                                                        item={item}
                                                                        key={index}
                                                                        remove={this.removeCartItem}>
                                                                    </ConsentItem>
                                                                )
                                                            })}
                                                        </>
                                                    )}
                                            </>
                                        ) : null}

                                    </ul>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        disabled={this.state.isRemoving}
                                        className='continue-shop-btn'
                                        onClick={() => {
                                            this.setState({ consentItems: null, consentDone: true });
                                            this.toggleConsentModal()
                                        }}>
                                        Done
                            </Button>{' '}
                                </ModalFooter>
                            </Modal>
                        </Container >
                    )}
            </>
        )
    }
}

export default withRedux(Checkout)
