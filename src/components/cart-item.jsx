import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Container, Row, Col } from 'reactstrap'
import { faTimes, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import withRedux from '../redux'
import http from '../services/axios'
import { getLocal } from '../utils/local-storage-utils'
import { showToast, toastMessages } from '../constants/toast-messages'

export class CartItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            qty: props.item.quantity,
            qtyBtnsEnbld: true,
            btnDisabled: false
        }
    }

    handleMinus = async () => {
        if ((this.state.qty - 1) !== 0) {
            await this.setState({
                qty: this.state.qty > 1 ? this.state.qty - 1 : 1,
            });
            await this.handleQtyChange();
        } else {
            showToast(toastMessages.couldntRemove);
        }
    };

    handlePlus = async () => {
        await this.setState({
            qty: this.state.qty + 1,
        });
        await this.handleQtyChange();
    };

    handleRemove = async () => {
        await this.setState({ btnDisabled: true });
        try {
            let cartItems = this.props.cart.cartItems;
            let cart = this.props.cart.cart;
            if (cartItems.length > 0) {
                cartItems = [...cartItems];
                let index = cartItems.findIndex(item => item.product_sku ==
                    this.props.item.product_sku);

                if (index > -1)
                    cartItems.splice(index, 1);
                console.log('cart items splice====', cartItems)

                const result = await http.post('/order/updateOrderFromCart',
                    { cartId: cart.id, cartItems: cartItems })
                cart = result.data.data.result;
                // const response = await http.post(`/order/getCartData?id=${cart.id}`);
                // cart = response.data;
                if (cart.cartItems.length === 0) {
                    cart = {};
                    cartItems = [];
                    window.localStorage.removeItem('x-cart-id');
                }
                window.localStorage.setItem('x-cart', JSON.stringify(cart));
                window.localStorage.setItem('x-cart-items', JSON.stringify(cartItems));
                this.props.updateCart(cart);
                this.props.updateCartItems(cartItems);
                showToast(toastMessages.removeSuccess);
            }
        } catch (error) {
            console.log(error)
            showToast(toastMessages.couldntRemove);
        }
    }

    handleQtyChange = async () => {
        this.setState({ btnDisabled: true, qtyBtnsEnbld: false });
        try {
            let cartItems = this.props.cart.cartItems;
            let cart = this.props.cart.cart;
            if (cartItems.length > 0) {
                cartItems = [...cartItems];
                console.log('cart items in req====', cartItems);
                let index = cartItems.findIndex(item => item.product_sku ==
                    this.props.item.product_sku);
                console.log('index====', this.state);
                cartItems[index].quantity = index > -1 ? this.state.qty : cartItems[index].quantity;

                const result = await http.post('/order/updateOrderFromCart',
                    { cartId: cart.id, cartItems: cartItems })
                cart = result.data.data.result;
                this.props.updateCart(cart);
                this.props.updateCartItems(cartItems);
                this.setState({
                    btnDisabled: false,
                    qty: cartItems[index].quantity,
                    qtyBtnsEnbld: true
                })
            }
        } catch (error) {
            console.log(error)
            showToast(toastMessages.cdntIncQty);
        }
    };

    render() {
        return (
            <Container className='p-0 mt-3 border-bottom'>
                <Row >
                    <Col className='col-4'>
                        <div className='pl-2'>
                            <img
                                className='rounded shadow'
                                src={this.props.item.image_url ? this.props.item.image_url
                                    : 'images/grocery.jpg'} style={{ maxWidth: '90%', maxHeight: '90%' }}>
                            </img>
                        </div>
                    </Col>
                    <Col className='col-6'>
                        <h6 className='text-truncate'>{this.props.item.name}</h6>
                        <div className='mt-3 d-flex flex-row justify-content-between border rounded shadow'>
                            <Button
                                disabled={!this.state.qtyBtnsEnbld}
                                block
                                className='btn-sm update-qty-btn'
                                onClick={this.handleMinus}>
                                <FontAwesomeIcon icon={faMinus} className='color-blue'>
                                </FontAwesomeIcon>
                            </Button>

                            <Button block className='btn-sm mt-0 update-qty-btn'>
                                {this.state.qty}
                            </Button>
                            <Button
                                disabled={!this.state.qtyBtnsEnbld}
                                block
                                className='btn-sm mt-0 update-qty-btn'
                                onClick={this.handlePlus}>
                                <FontAwesomeIcon icon={faPlus} className='color-blue'>
                                </FontAwesomeIcon>
                            </Button>
                        </div>
                    </Col>
                    <Col className='col-1' style={{ padding: '0' }}>
                        <FontAwesomeIcon
                            onClick={this.handleRemove}
                            icon={faTimes}
                            className='fa-xs cart-close-btn'>
                        </FontAwesomeIcon>
                        <div className='d-flex flex-row justify-content-center mt-5'>
                            <p style={{ fontSize: '15px' }}
                                className='text-center font-weight-bold pl-3'>{`${getLocal('currency')} 
                            ${this.props.item.price}`}
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default withRedux(CartItem)
