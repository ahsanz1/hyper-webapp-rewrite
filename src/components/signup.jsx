import React, { Component } from 'react'
import {
    Button,
    Modal, ModalHeader, ModalBody, ModalFooter, Input, Row, Col, Spinner
} from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {toastMessages} from '../constants/toast-messages';

import withRedux from '../redux'
import http from '../services/axios'
import GenerateOTP from './generate-otp';
import VerifyOTP from './verify-otp';
import CreatePW from './create-pw';

toast.configure();

export class Signup extends Component {

    constructor(props) {
        super(props);
        console.log('signup props====', props)
        this.state = {
            isLoading: false,
            otpSent: false,
            phone: '',
            otpVerified: false,
            password: '',
            showTerms: false,
            termsAccepted: false,
            pwCreated: false
        }
    }

    handleGenerateOTP = async (values, { setSubmitting }) => {
        try {
            this.toggleIsLoading();
            const phoneNumber = `1${values.number}`
            const result = await http.post('/auth/registerCustomer', {
                company_code: 'MONT', phone: phoneNumber
            });

            this.setState({
                otpSent: true,
                phone: phoneNumber
            });
            console.log('OTP sent========', result)
            setSubmitting(false);
            this.toggleIsLoading();

        } catch (error) {
            console.log(error);
        }

    }

    handleVerifyOTP = async (values, { setSubmitting }) => {
        try {
            this.toggleIsLoading();
            const result = await http.post('/auth/verifyUser', {
                code: values.otp, phone: this.state.phone
            });

            console.log('Number registered========', result)
            this.setState({ otpVerified: true, pwCreated: !this.state.pwCreated });
            setSubmitting(false);
            this.toggleIsLoading();

        } catch (error) {
            console.log(error);
            this.showToast(toastMessages.otpWrong);
            this.toggleIsLoading();
        }
    }

    handleCreatePw = async () => {
        try {
            this.toggleIsLoading();
            const result = await http.post('/auth/createPassword', {
                code: this.state.password.password, phone: this.state.phone
            });

            console.log('Password Created========', result)
            this.setState({ showTerms: false });
            await this.props.login(this.state.phone, this.state.password.password);
            const response = http.post('/customer/setTermsAccepted', { phone: this.state.phone });
            console.log('set terms accepted', response);
            this.props.history.push('/stores')

        } catch (error) {
            console.log(error)
        }
    }

    showTermsModal = (pw) => {
        console.log(pw)
        this.setState({ showTerms: true, password: pw });
    }

    toggleTermsCB = () => {
        this.setState({ termsAccepted: !this.state.termsAccepted })
    }

    toggleIsLoading = () => {
        this.setState({ isLoading: !this.state.isLoading });
    }

    showToast = (message) => {
        toast(message, {
            position: "bottom-left",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: 'toastify-dark'
        });
    }


    render() {
        console.log('signup state====', this.state);
        return (
            <div className='min-vh-100 d-flex align-items-center gradient'>
                <Row className='justify-content-center w-100 m-0 p-2'>
                    <Col className='col-xs-3 col-md-6 col-lg-5 rounded' style={{ background: '#ffffff' }}>
                        <ModalHeader className='d-flex justify-content-center'>
                            <img src='/hypr_logo.png' style={{ maxWidth: '100px', maxHeight: '40px' }}></img>
                        </ModalHeader>
                        <ModalBody style={{ minHeight: '25vh' }}>
                            {this.state.isLoading ? (
                                <div className='d-flex flex-row justify-content-center mt-4'>
                                    <Spinner className='color-orng'></Spinner>
                                </div>
                            ) : (
                                    <>
                                        {!this.state.otpSent ? (
                                            <GenerateOTP
                                                handleOTP={this.handleGenerateOTP}
                                                otpSent={this.state.otpSent}
                                                toggleIsLoading={this.toggleIsLoading}>
                                            </GenerateOTP>
                                        ) : (<> {!this.state.otpVerified ? (
                                            <VerifyOTP
                                                handleVerify={this.handleVerifyOTP}
                                                otpVerified={this.state.otpVerified}
                                                toggleIsLoading={this.toggleIsLoading}>
                                            </VerifyOTP>
                                        ) : (
                                                <CreatePW showTerms={this.showTermsModal}
                                                    pwCreated={this.state.pwCreated}
                                                    toggleIsLoading={this.toggleIsLoading}>
                                                </CreatePW>
                                            )} </>

                                            )}
                                    </>
                                )}
                        </ModalBody>
                    </Col>
                </Row>
                <Modal isOpen={this.state.showTerms}>
                    <ModalHeader><h3>Terms and Conditions</h3></ModalHeader>
                    <ModalBody>
                        The prices reflected in each Purchase Order shall be fixed, firm and definitive. Each Purchase Order shall clearly delineate those purchases which are for a fixed fee and those which are payable based on time and materials, which in the latter case shall include hourly rates and an estimate of total and not to exceed hours to complete performance. Buyer and Supplier hereby acknowledge that there is no index or formula pricing. The price stated in the Purchase Order shall be understood as including all items which make up the cost of the Goods or Services subject to the Purchase Order including, without limitation fees, insurance, consumable goods, Supplier's raw materials or third-party costs, transport, packing and labelling, accessories, devices, necessary tools, any type of expenses, payments for intellectual property, costs deriving from inspections, tests and other certificates specified in the Purchase Order, exchange rates, sales, use or excise tax, duties or import fees or tariffs. The prices reflected in each Purchase Order shall be fixed, firm and definitive. Each Purchase Order shall clearly delineate those purchases which are for a fixed fee and those which are payable based on time and materials, which in the latter case shall include hourly rates and an estimate of total and not to exceed hours to complete performance. Buyer and Supplier hereby acknowledge that there is no index or formula pricing.                                </ModalBody>
                    <ModalFooter className='d-flex flex-row justify-content-between'>
                        <Input
                            addon
                            type="checkbox"
                            checked={this.state.termsAccepted}
                            onChange={this.toggleTermsCB}
                        />

                        <Button
                            style={{ background: '#f55d2c', borderColor: '#f55d2c' }}
                            disabled={!this.state.termsAccepted}
                            onClick={this.handleCreatePw}
                            className='btn-sm'>
                            Accept
                        </Button>{' '}

                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default withRedux(Signup)
