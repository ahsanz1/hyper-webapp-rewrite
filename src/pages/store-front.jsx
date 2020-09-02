import React, { Component } from 'react'
import grocery from '../grocery.jpg'
import {
    Container,
    Row,
    Col,
    Spinner
} from 'reactstrap'
import SimpleSlider from '../components/slick-slider'
import http from '../services/axios'
import withRedux from '../redux';
import { getLocal, saveLocal, removeLocal } from '../utils/local-storage-utils';

class StoreFront extends Component {
    constructor(props) {
        super(props)
        this.state = {
            categories: [],
            sections: [],
            store: null,
            isLoading: true,
            storeImg: getLocal('storeImg') ? getLocal('storeImg') : '/images/grocery.jpg'
        }
        console.log('storefront props====', props);
    }

    fetchAllCategories = async () => {
        try {
            const result = await http.get(
                `/categories/getAllCategories?location_id=${getLocal('storeId')}`
            );
            const categories = result.data.data;
            const storeName = getLocal('storeName');
            const sections = categories.map((category, index) => {
                return {
                    category: category,
                    ref: React.createRef()
                }
            });
            console.log('SECTIONS', sections);
            this.setState({
                categories: categories,
                sections: sections,
                isLoading: false
            });
            this.props.setStore(storeName);

        } catch (error) {
            console.log(error);
        }
    }

    setCurrentStore = async () => {
        try {
            this.setState({ isLoading: true })
            const response = await http.get('/location/getStores?company_code=MONT');
            const stores = response.data.data.stores;
            let index = stores.findIndex(store => store.location_id ==
                this.props.match.params.location_id);
            if (index > -1) {
                saveLocal('storeId', stores[index].location_id);
                saveLocal('compCode', stores[index].companyDetails.company_code);
                saveLocal('currency', stores[index].companyDetails.currency);
                saveLocal('storeName', stores[index].name);
                saveLocal('storeImg', stores[index].image_url);
                saveLocal('companyName', stores[index].company_name);
                saveLocal('latitude', stores[index].latitude);
                saveLocal('longitude', stores[index].longitude);
                removeLocal('x-cart-id');
                removeLocal('x-cart-items');
                removeLocal('x-cart');
                this.props.clearCart({cart: {}, cartItems: []});
                this.setState({ store: { ...stores[index] } });
            }

        } catch (error) {
            console.log(error);
        }
    }

    async componentDidMount () {
        await this.setCurrentStore();
        this.fetchAllCategories();
    }

    handleScroll = (section) => {
        /* 
            Access the "current element" of this sections ref. 
            Treat this as the element of the div for this section.
            */
        let el = section.ref.current;
        console.log('section clicked', section)


        window.scrollTo({
            behavior: "smooth",
            left: 0,
            top: el.offsetTop
        });

    }

    render() {
        return (
            <div>
                <section className="breadcrumb-section set-bg"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.3),
                        rgba(1,1,1,0.3)), url(${grocery})`, position: 'sticky'
                    }}>
                    <Container>
                        <Row>
                            <Col className='col-sm-12 col-lg-12 text-center'>
                                <div className='breadcrumb__text'>
                                    {this.state.isLoading ? (
                                        <Spinner color='light'></Spinner>
                                    ) : (<>
                                        {this.state.store ? (
                                            <h2 style={{ textTransform: 'capitalize' }}>{this.state.store.name}</h2>

                                        ) : null
                                        }
                                    </>
                                        )}
                                    <div className="breadcrumb__option">
                                        <a href="/">Home</a>
                                        <span>We deliver when others don't.</span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
                <Container className='mt-3'>
                    <Row>
                        <Col className='col-3 p-3'>

                            <Container>
                                {this.state.sections.length > 0 ? (
                                    <div>
                                        <h3 className='font-weight-bold category-text'>Categories</h3>
                                        {this.state.sections.map((section, index) => {
                                            return (
                                                <h6
                                                    className='mt-4 category-text'
                                                    onClick={() => this.handleScroll(section)}>
                                                    {section.category.name}
                                                </h6>
                                            )
                                        })}
                                    </div>
                                ) : null}
                            </Container>


                        </Col>
                        <Col className='col-9'>
                            {this.state.sections.length > 0 ? (
                                this.state.sections.map((section, index) => {
                                    return (

                                        <SimpleSlider
                                            section={section}
                                            storePath={this.props.match.url}
                                            key={index}>
                                        </SimpleSlider>

                                    )
                                })
                            ) : null}
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default withRedux(StoreFront)
