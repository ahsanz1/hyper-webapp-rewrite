import React, { Component } from 'react'
import { Container, Row, Col, Spinner } from 'reactstrap'
import Product from '../components/product'
import http from '../services/axios'

export class AllProducts extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            title: '',
            products: []
        }
    }

    fetchAllProducts = async () => {
        try {
            const response = await http.get(
                `/product/getProductByCategory?category_id=${this.props.match.params.subcat_id}`
            )
            const products = response.data.data.products;
            console.log('all products======', response)
            this.setState({
                products: products,
                title: products[0].category_info.name,
                loading: false
            })
        } catch (error) {
            console.log(error);
        }
    }

    componentDidMount() {
        this.fetchAllProducts();
    }

    render() {
        return (
            <div>
                {this.state.loading ? (
                    <Container style={{ minHeight: '100vh' }} className='d-flex flex-col align-items-center'>
                        <Row className='m-auto'>
                            <Col className='col-12'>
                                <Spinner className="color-orng" />
                            </Col>
                        </Row>
                    </Container>
                ) : (
                        <Container className='mt-5'>
                            <Row className='p-3'>
                                <h3 className='font-weight-bold'>{this.state.title}</h3>
                            </Row>
                            <Row>
                                {this.state.products.map((product, index) => {
                                    return (
                                        <Col lg='2' md='4' xs='6' key={index} style={{ marginBottom: '10px' }}>
                                            <Product product={product}></Product>
                                        </Col>
                                    )
                                })}
                            </Row>
                        </Container>
                    )}
            </div>
        )
    }
}

export default AllProducts
