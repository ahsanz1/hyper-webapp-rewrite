import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import {

    Card,
    CardImg,
    CardBody,
    CardTitle,
    Spinner,
    Button,
    Fade
} from 'reactstrap';
import withRedux from '../redux';
import http from '../services/axios';
import { toastMessages, showToast } from '../constants/toast-messages';
import { saveLocal, removeLocal, getLocal } from '../utils/local-storage-utils';

export class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            qty: 1,
            btnDisabled: false,
            spinner: false,
            qtyFade: false,
            qtyBtnsEnbld: true,
            qtyNotAvailable: this.props.product.stock_quantity == 0 ? true : false
        }
        //console.log('product props=====', props)
    }

    handleMinus = async () => {
        if (this.state.qty <= this.props.product.stock_quantity) {
            this.setState({ qtyNotAvailable: false })
        } else {
            await this.setState({
                qty: this.state.qty > 1 ? this.state.qty - 1 : 1,
            });
            this.handleAddToCart();
        }
    };

    handlePlus = async () => {
        if (this.props.product.stock_quantity < (this.state.qty + 1)) {
            showToast(toastMessages.qtyNotAvailable);
            this.setState({ qtyNotAvailable: true });
        } else {
            await this.setState({
                qty: this.state.qty + 1,
            });
            this.handleAddToCart();
        }
    };

    handleQtyChange = (e) => {
        console.log(e);
        let qty = e.target.value;
        console.log('QTY', qty);
        this.setState({
            qty,
        });
    };

    handleAddToCart = async () => {
        await this.setState({ btnDisabled: true, spinner: true, qtyBtnsEnbld: false });
        try {
            let cartItems = this.props.cart.cartItems;
            let cart = this.props.cart.cart;
            if (cartItems.length > 0) {
                cartItems = [...cartItems];
                console.log('cart items in req====', cartItems);
                let index = cartItems.findIndex(item => item.product_sku == this.props.product.sku);
                if (index > -1) {
                    cartItems[index].quantity = this.state.qty;
                } else {
                    cartItems.push({ product_sku: this.props.product.sku, quantity: this.state.qty });
                }
                const result = await http.post('/order/updateOrderFromCart',
                    { cartId: cart.id, cartItems: cartItems })
                cart = result.data.data.result;

            } else {
                cartItems = [];
                cartItems.push({ product_sku: this.props.product.sku, quantity: this.state.qty });
                const result = await http.post('/order/createOrderFromCart',
                    { location_id: this.props.product.location_id, cartItems: cartItems });
                cart = result.data.data.result;
                saveLocal('x-cart-id', cart.id);
            }
            if (cart.cartItems.length === 0) {
                cart = {};
                cartItems = [];
                removeLocal('x-cart-id');
            }
            saveLocal('x-cart', cart);
            saveLocal('x-cart-items', cart.cartItems);
            this.props.updateCart(cart);
            this.props.updateCartItems(cartItems);
            this.setState({
                btnDisabled: false,
                spinner: false,
                qtyBtnsEnbld: true,
                qtyFade: true
            });
            //this.toggleQtyFade();
        } catch (error) {
            console.log(error)
        }

    }

    toggleQtyFade = () => {
        this.setState({ qtyFade: !this.state.qtyFade })
    }

    render() {
        return (
            <Card style={{ height: '300px', border: 'none' }} className='m-2'>
                <div className='d-flex justify-content-end'>
                    {this.state.spinner ? (
                        <Button style={{ background: 'none', border: 'none' }}>
                            <Spinner size='sm' color='secondary'></Spinner>
                        </Button>
                    ) : (
                            <>
                                <Button disabled={this.state.qtyNotAvailable} style={{ background: 'none', border: 'none' }}
                                    onClick={this.handleAddToCart}>
                                    <FontAwesomeIcon
                                        icon={faPlusCircle}
                                        className='fa-lg add-icon'>
                                    </FontAwesomeIcon>
                                </Button>
                            </>

                        )}
                </div>
                <CardImg
                    top
                    width="100%"
                    src={this.props.product.image_url ? this.props.product.image_url : '/images/grocery.jpg'}
                    alt="Card image cap"
                // onClick={this.toggleQtyFade}
                />
                <CardBody className='pb-1'>
                    <CardTitle className='mb-0'>
                        <div className='d-flex flex-column align-items-left'>
                            <p
                                className='font-weight-bold mb-0'>
                                {`${getLocal('currency')} ${this.props.product.price}`}
                            </p>
                            <p style={{ fontSize: '15px' }}
                                className='text-truncate mb-0'>
                                {this.props.product.name}
                            </p>
                        </div>
                    </CardTitle>
                    {this.props.product.stock_quantity > 0 ? (
                        <div>
                            <Fade
                                in={this.state.qtyFade}
                                className='d-flex flex-row justify-content-between border rounded shadow'>
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

                            </Fade>

                        </div>
                    ) : <div className='d-flex flex-col align-items-center'>
                            <Button block className='out-stock-btn p-0'>
                                Out of stock
                        </Button>
                        </div>}

                </CardBody>
            </Card >
        )
    }
}

export default withRedux(Product)
