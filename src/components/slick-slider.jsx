import React, { Fragment } from "react";
import { ArrowWrapper } from '../js/styles'
import {
    Container,
    Row,
    Col,
    Card,
    CardImg,
    CardBody,
    CardTitle,
    Spinner
} from 'reactstrap';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from "react-slick";
import Product from "./product";
import http from '../services/axios'
import { Link } from "react-router-dom";
//import settings from '../constants/slider-constants'

class SimpleSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: null,
            isLoading: true
        }
        //console.log('slider props========', props);
    }

    fetchCategoryProducts = async () => {
        try {
            const response = await http.get(
                `/product/getProductByCategory?category_id=${this.props.section.category.sub_categories[0].id}`
            )
            const products = response.data.data.products;
            //console.log('products======', response)
            this.setState({ products: products })
        } catch (error) {
            console.log(error);
        }
    }

    componentDidMount() {
        this.fetchCategoryProducts();
    }

    render() {

        let settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 5,
            slidesToScroll: 2,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        infinite: true,
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        initialSlide: 2
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]

        };

        if (this.state.products)
            settings = { ...settings, slidesToShow: this.state.products.length < 5 ? this.state.products.length : 5 }
        return (
            <div ref={this.props.section.ref}>
                {this.state.products ? (
                    <>
                        {this.state.products.length > 0 ? (
                            <div className='bg-white mb-5'>
                                <ArrowWrapper style={{ marginTop: '-20px !important' }}>
                                    <div className='d-flex justify-content-between pt-3 pr-2 pl-2'>
                                        <h3 className='font-weight-bold'>{this.props.section.category.name}</h3>
                                        <Link
                                            to={`${this.props.storePath}/category/${this.props.section.category.name}/${this.props.section.category.id}`}
                                            className='mt-2 color-orng'>See more</Link>
                                    </div>
                                    <Slider {...settings}>
                                        {
                                            this.state.products.map((product, index) => {
                                                return (
                                                    <Product
                                                        locId={this.props.section.category.location_id}
                                                        product={product}>
                                                    </Product>
                                                )
                                            })
                                        }
                                    </Slider>
                                </ArrowWrapper>
                            </div>

                        ) : null}
                    </>
                ) : (
                        <Container style={{ minHeight: '50vh' }} className='d-flex flex-col align-items-center'>
                            <Row className='m-auto'>
                                <Col className='col-12'>
                                    <Spinner className="color-orng" />
                                </Col>
                            </Row>
                        </Container>
                    )
                }

            </div>
        );
    }
}

export default SimpleSlider


    // < div ref = { this.props.section.ref } >
    // {
    //     this.state.products.length > 0 ? (
    //         <div className='bg-white mb-5'>
    //             <ArrowWrapper style={{ marginTop: '-20px !important' }}>
    //                 <div className='d-flex justify-content-between pt-3 pr-2 pl-2'>
    //                     <h3 className='font-weight-bold'>{this.props.section.category.name}</h3>
    //                     <Link
    //                         to={`${this.props.storePath}/category/${this.props.section.category.name}/${this.props.section.category.id}`}
    //                         className='mt-2 color-orng'>See more</Link>
    //                 </div>
    //                 <Slider {...settings}>
    //                     {
    //                         this.state.products.map((product, index) => {
    //                             return (
    //                                 <Product
    //                                     locId={this.props.section.category.location_id}
    //                                     product={product}>
    //                                 </Product>
    //                             )
    //                         })
    //                     }
    //                 </Slider>
    //             </ArrowWrapper>
    //         </div>

    //     ) : null
    // }

    //         </div >