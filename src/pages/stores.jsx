import React from 'react'
import http from '../services/axios'
// import grocery from '../grocery.jpg'

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
import { Link } from 'react-router-dom';
import SimpleSlider from '../components/slick-slider';
import { getLocal, saveLocal } from '../utils/local-storage-utils';


class Stores extends React.Component {
    constructor(props) {
        super(props);
        this.state = { stores: [], loading: true }
    }

    fetchAllStores = async () => {
        try {
            const response = await http.get('/location/getStores?company_code=MONT');
            const stores = response.data.data.stores;
            this.setState({ stores: stores, loading: false });
            console.log('stores res=========', stores)
        } catch (error) {
            console.log(error);
        }
    }

    componentDidMount() {
        this.fetchAllStores();
    }

    navigate = (store) => {
        // saveLocal('storeId', store.location_id);
        // saveLocal('compCode', store.companyDetails.company_code);
        // saveLocal('currency', store.companyDetails.currency);
        // saveLocal('storeName', store.name);
        // saveLocal('storeImg', store.image_url);
        // saveLocal('companyName', store.company_name);
        // saveLocal('latitude', store.latitude);
        // saveLocal('longitude', store.longitude);
        this.props.history.push(`/storefront/${store.name.replace(/ +/g, '-')
            .toLowerCase()}/${store.location_id}`);
    }

    createGrid = () => {
        let content = [];
        let rows = [...Array(Math.ceil(this.state.stores.length / 4))];
        let storesRows = rows.map((row, index) => (
            this.state.stores.slice(index * 4, index * 4 + 4)
        ))
        content = storesRows.map((row, index) => (
            <Row className='m-row' key={index} style={{ marginBottom: '10px' }}>
                {
                    row.map((store, i) => (
                        <Col className="col-3" key={i}>
                            <Card
                                className='rounded h-100 d-flex flex-col justify-content-center pt-3 store-card'
                                onClick={() => this.navigate(store)}>
                                <CardImg
                                    top
                                    width="100%"
                                    src={store.image_url ? store.image_url : '/images/grocery.jpg'}
                                    alt="true"
                                    className='rounded-circle store-card-img shadow m-auto' />
                                <CardBody className='d-flex flex-col justify-content-center'>
                                    <CardTitle>
                                        <h5 className='font-weight-bold'>{store.name}</h5>
                                    </CardTitle>
                                </CardBody>
                            </Card>
                        </Col>
                    ))
                }
            </Row>
        ))

        return content;
    }

    render() {
        return (
            <div >
                {this.state.loading ? (
                    <Container style={{ minHeight: '100vh' }} className='d-flex flex-col align-items-center'>
                        <Row className='m-auto'>
                            <Col className='col-12'>
                                <Spinner className="color-orng" />
                            </Col>
                        </Row>
                    </Container>

                ) : (<Container style={{ minHeight: '100vh'}} className='mt-5'>
                    {this.state.stores.length > 0 ? this.createGrid() : null}
                </Container>
                    )}


            </div >
        )
    }
}

export default Stores
