import React, { Component } from 'react'
import { Navbar, NavbarBrand } from 'reactstrap'

export class CheckoutHeader extends Component {
    render() {
        return (
            <div>
                <Navbar color="faded" light expand="md" fixed='top'
                    style={{ position: 'sticky' }} className="shadow-sm p-0 bg-white">
                    <NavbarBrand className="ml-5">

                        <img src="/hypr_logo.png" alt="true"
                            style={{ maxWidth: '100px', maxHeight: '30px' }} />

                    </NavbarBrand>
                </Navbar>
            </div>
        )
    }
}

export default CheckoutHeader
