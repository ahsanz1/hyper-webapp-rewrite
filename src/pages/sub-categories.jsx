import React, { Component } from 'react'
import { Container, Row, Spinner, Col, Card, CardImg, CardBody, CardTitle } from 'reactstrap'
import http from '../services/axios'
import Product from '../components/product'
import { Link } from 'react-router-dom'

export class SubCategories extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            title: '',
            subCategories: []
        }
        //console.log('subcategories props======', props)
    }

    fetchSubCatgories = async () => {
        try {
            const result = await http.get(
                `/categories/getAllCategories?location_id=${this.props.match.params.location_id}`
            );
            const categories = result.data.data;
            let categoryId = this.props.match.params.category_id;
            let currentCategory = categories
                .find(category => category.id == categoryId);
            let subCategories = currentCategory.sub_categories;
            this.setState(
                {
                    loading: false,
                    title: currentCategory.name,
                    subCategories: subCategories
                });
        } catch (error) {
            console.log(error);
        }
    }

    componentDidMount() {
        this.fetchSubCatgories();
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
                        <Container>
                            <Row className='p-3'>
                                <h3 className='font-weight-bold'>{this.state.title}</h3>
                            </Row>
                            <Row>
                                {this.state.subCategories.map((subCat, index) => {
                                    return (
                                        <Col key={index} className='align-items-stretch' style={{ marginBottom: '10px' }}>
                                            <Link to={`/storefront/${this.props.match.params.location_id}/products/${subCat.name.replace(/ +/g, '-').toLowerCase()}/${subCat.id}`}>
                                                <Card className='h-100 border-0'>
                                                    <CardImg top width="100%" height="60%" src={subCat.image_url} alt="Card image cap" />
                                                    <CardBody>
                                                        <CardTitle>{subCat.name}</CardTitle>
                                                    </CardBody>
                                                </Card>
                                            </Link>
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

export default SubCategories
