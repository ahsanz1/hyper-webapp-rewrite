import React, { Component } from 'react'
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export class ConsentItem extends Component {
    constructor(props) {
        super(props)
        console.log('Consent Item', props);
    }
    render() {
        return (
            <li className='d-flex flex-row justify-content-between p-0'>
                <div className='d-flex flex-row justify-content-start p-3'>
                    <img
                        style={{ maxHeight: '80px', maxWidth: '100px' }}
                        src={this.props.item.image_url ? this.props.item.image_url : '/images/grocery.jpg'}>
                    </img>
                    <h6 className='w-50'>{this.props.item.name}</h6>
                </div>

                <div className='d-flex flex-column align-items-start'>
                    <Button
                        style={{ background: 'none', border: 'none' }}
                        onClick={() => this.props.remove(this.props.item.sku)}>
                        <FontAwesomeIcon
                            icon={faTimes}
                            className='fa-sm color-blue'>
                        </FontAwesomeIcon>
                    </Button>
                </div>
            </li>
        )
    }
}

export default ConsentItem
