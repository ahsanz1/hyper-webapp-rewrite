import React, { Component } from 'react'
import { Table } from 'reactstrap'

export class CardDetails extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div>
                <Table>
                    <thead>
                        <tr>
                            <th>Brand</th>
                            <th>Exp Year</th>
                            <th>Card No.</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <img src='images/visa.svg' style={{width: '40px', height:'30px'}}></img>
                            </td>
                            <td>{this.props.card.exp_year}</td>
                            <td>************{this.props.card.last4}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default CardDetails
