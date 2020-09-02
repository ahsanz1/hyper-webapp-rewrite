import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    Button,
    Modal, ModalHeader, ModalBody,
    Form, FormGroup, Label, Input, FormText, InputGroupAddon, InputGroupText, InputGroup, Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faDolly } from '@fortawesome/free-solid-svg-icons';
import withRedux from '../redux';

export class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            accDropdown: false
        }
    }

    toggleAccDropdown = () => {
        this.setState({ accDropdown: !this.state.accDropdown })
    };

    toggleNavbar = () => {
        this.setState = {
            isOpen: !this.state.isOpen
        }
    }

    handleLogout = () => {
        window.localStorage.clear();
        this.props.changeLoggedInFlag(false);
        this.props.updateCart({});
        this.props.updateCartItems([]);
        this.props.history.push('/auth/login');
    }

    navigate = () => {
        this.props.setIsCheckout(false);
        this.props.history.push('/');
    }

    render() {

        console.log('header state=====', this.state)

        return (
            <div>
                {this.props.main.isCheckout ? (
                    <Navbar color="faded" light expand="md" fixed='top'
                        style={{ position: 'sticky' }}
                        className="shadow-sm d-flex flex-row justify-content-center bg-white">
                        <NavbarBrand>
                            <img src="/hypr_logo.png" alt="true" onClick={this.navigate}
                                style={{ maxWidth: '100px', maxHeight: '50px', cursor: 'pointer' }} />
                        </NavbarBrand>

                    </Navbar>
                ) : <>
                        <Navbar color="faded" light expand="md" fixed='top'
                            style={{ position: 'sticky' }} className="shadow-sm p-0 bg-white">
                            <NavbarBrand className="ml-5">
                                <Link to='/'>
                                    <img src="/hypr_logo.png" alt="true"
                                        style={{ maxWidth: '100px', maxHeight: '40px' }} />
                                </Link>
                            </NavbarBrand>
                            <NavbarToggler onClick={this.toggleNavbar} />
                            <Collapse isOpen={this.state.isOpen} navbar>
                                <Nav className="mr-auto" navbar>

                                    {/* <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                Options
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem>
                                    Option 1
                                 </DropdownItem>
                                <DropdownItem>
                                    Option 2
                                </DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem>
                                    Reset
                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown> */}
                                </Nav>
                                {/* <ButtonDropdown
                        style={{ backgroundColor: '#f55d2c', borderColor: '#f55d2c' }}
                        className="mr-5 rounded">
                        <DropdownToggle caret size='lg'>
                            Cart
                        </DropdownToggle>
                    </ButtonDropdown> */}

                                <div className='d-flex flex-row justifty-content-end align-items-center mr-4'>
                                    <div className='mr-3'>
                                        <Dropdown isOpen={this.state.accDropdown} toggle={this.toggleAccDropdown}>
                                            <DropdownToggle caret className='dropdown'>
                                                Account
                                    </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem>Your Orders</DropdownItem>
                                                <DropdownItem onClick={this.handleLogout}>Logout</DropdownItem>

                                            </DropdownMenu>
                                        </Dropdown>
                                    </div>
                                    <div className='pull-bs-canvas-left d-flex flex-row align-items-center c-pointer mr-3'>
                                        <FontAwesomeIcon
                                            icon={faShoppingCart}
                                            className='fa-2x mr-2'>
                                        </FontAwesomeIcon>
                                        <div className='pt-4'>
                                            <h6 className='m-0'>Cart</h6>
                                            {this.props.cart.cart.cartItems ? (
                                                <>
                                                    <p>{this.props.cart.cart.cartItems.length} Items</p>
                                                </>
                                            ) : <p>0 Items</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* 
                        
                        {/* <NavbarText className="mr-5 btn btn-link" onClick={this.toggleLoginModal}><h5>Login / Signup</h5></NavbarText> */}
                            </Collapse>

                        </Navbar>
                    </>}
            </div>
        )
    };
}

export default withRouter(withRedux(Header));