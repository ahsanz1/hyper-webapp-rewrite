import React, { Component } from "react";
import { Container, Col, Button, Row } from "reactstrap";
import withRedux from '../redux'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCross, faWindowClose, faTimes } from "@fortawesome/free-solid-svg-icons";
import http from "../services/axios";
import CartItem from "./cart-item";
import { Link, withRouter } from "react-router-dom";
import { getLocal, saveLocal } from "../utils/local-storage-utils";


class Cart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      plusEnabled: true,
      minusEnabled: false
    }
  }

  safeNum = (num) => {
    if (num)
      return num;
    return 0;
  }

  handleMinus = () => {

  };

  handlePlus = () => {

  };

  navigate = () => {
    console.log('cart props=-=-0-=0', this.props);
    this.props.setIsCheckout(true);
    saveLocal('isCheckout', true);
    this.props.history.push('/checkout');
  }

  render() {
    return (
      <div>
        <div className='bs-canvas bs-canvas-left position-fixed bg-cart h-100'>
          <div className='bs-canvas-header side-cart-header p-3'>
            <div className='d-flex flex-row justify-content-between'>
              <img src={getLocal('storeImg')} className='rounded-circle white-shadow'
                style={{ maxWidth: '20%', maxHeight: '18%' }}>
              </img>
              <div>
                <p className='font-weight-bold mt-2 mb-0' style={{ fontSize: '15px' }}>
                  {getLocal('storeName')}</p>
                <p className='font-weight-bold' style={{ fontSize: '15px' }}>
                  {getLocal('companyName')}</p>
              </div>
              <div style={{ width: '12%' }}></div>
              <div className='mt-3 rounded'>
                <p className='text-center font-weight-bold mb-0 white-shadow'>
                  {`${getLocal('currency')} ${this.safeNum(this.props.cart.cart.grand_total)}`}
                </p>
              </div>
            </div>
            {/* <div className='d-inline-block main-cart-title'>
              My Cart <span>({this.props.cart.cartItems.length} Items)</span>
            </div>
            <button
              type='button'
              className='bs-canvas-close close'
              aria-label='Close'
            >
              <FontAwesomeIcon icon={faTimes} className='fa-sm' ></FontAwesomeIcon>
            </button> */}
          </div>
          {/* <div className='d-flex flex-row justify-content-between border'>
            <img src={getLocal('storeImg')} className='rounded-circle shadow'
              style={{ maxWidth: '20%', maxHeight: '20%' }}></img>
            <div className='w-25 h-25 border'>
              {this.safeNum(this.props.cart.cart.grand_total)}
            </div>
          </div> */}
          {!this.props.cart.cart.cartItems ? (
            <Container className='min-vh-100 d-flex align-items-center justify-content-center'>
              <Row className='d-flex'>
                <Col>
                  <h4>No items to show.</h4>
                </Col>
              </Row>
            </Container>
          ) : (
              <div className='d-flex flex-column'>
                <div className='bs-canvas-body'>
                  {/* <div className='cart-top-total d-flex flex-column'>
                    <div className='d-flex flex-row justify-content-between'>
                      <h6>Gambo Super Market</h6>
                      <span>$34</span>
                    </div>
                    <div className='d-flex flex-row justify-content-between'>
                      <h6>Delivery Charges</h6>
                      <span>$1</span>
                    </div>
                  </div> */}
                  <div>
                    {this.props.cart.cart.cartItems ? (
                      this.props.cart.cart.cartItems.map((item, index) => {
                        return (
                          //item from cart.cart.cartItems
                          <CartItem item={item} key={index}></CartItem>
                        )
                      })

                    ) : null}

                  </div>
                </div>
                {this.props.cart.cart.cartItems.length > 0 ? (
                  <div className='bs-canvas-footer'>
                    {/* <div className='list-group-item d-flex justify-content-between'>
                      <h5>Order Total</h5>
                      <h5>{this.safeNum(this.props.cart.cart.grand_total)}</h5>
                    </div>
                    <div className='list-group-item d-flex justify-content-between'>
                      <h5>Tax</h5>
                      <h5>{this.safeNum(this.props.cart.cart.tax)}</h5>
                    </div>
                    <div className='list-group-item d-flex justify-content-between'>
                      <h5>Sub Total</h5>
                      <h5>{this.safeNum(this.props.cart.cart.sub_total)}</h5>
                    </div>
                    <div className='list-group-item d-flex justify-content-between'>
                      <h5>Service / Delivery Charges</h5>
                      <h5>{this.safeNum(this.props.cart.cart.service_charge) +
                        this.safeNum(this.props.cart.cart.delivery_charge)} </h5>
                    </div>
                    <div className='list-group-item d-flex justify-content-end'>
                      <Link to='/checkout'>
                        <Button className='btn'>Proceed to Checkout</Button>

                      </Link>
                    </div> */}
                    {/* <Link to='/checkout' style={{ textDecoration: 'none' }}> */}
                    <Button onClick={this.navigate} block className='place-order-btn mb-1 d-flex flex-row justify-content-between'>
                      <p className='mb-0 mt-2 text-center' style={{ fontWeight: '600' }}>Go to Checkout</p>
                      <span className='font-weight-bold mt-1 rounded p-2 c-total'>{`${getLocal('currency')} ${this.safeNum(this.props.cart.cart.grand_total)}`}</span>
                    </Button>
                    {/* </Link> */}
                  </div>
                ) : null}

              </div>
            )}

        </div>
      </div>
    );
  }
}

export default withRouter(withRedux(Cart));