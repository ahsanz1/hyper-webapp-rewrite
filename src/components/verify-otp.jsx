import React, { Component } from 'react'

import { Link } from 'react-router-dom';
import {
    Button,
    Modal, ModalHeader, ModalBody, ModalFooter,
    FormGroup, Label, Input, FormText, InputGroupAddon,
    InputGroupText, InputGroup, Container, Row, Col
} from 'reactstrap';

import { Formik, Field, ErrorMessage, Form } from 'formik';
import http from '../services/axios'

export class VerifyOTP extends Component {
    constructor(props) {
        super(props)
    }
    handleValidations = (values) => {
        const errors = {};
        if (!values.otp) {
            errors.otp = '* Required';
        }
        return errors;
    };
    render() {
        return (
            <div>
                <Formik
                    initialValues={{ otp: '' }}
                    validate={this.handleValidations}
                    onSubmit={this.props.handleVerify}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <FormGroup>
                                <Label for='otp'>Enter OTP</Label>
                                <Field
                                    type='number'
                                    className='form-control'
                                    placeholder='OTP'
                                    name='otp'
                                />
                                <ErrorMessage
                                    name='otp'
                                    component='small'
                                    className='text-danger'
                                />
                            </FormGroup>


                            <Button
                                className='bg-color-blue'
                                type='submit'
                                disabled={isSubmitting || this.props.otpVerified}
                                block>
                                Verify OTP
                                </Button>


                        </Form>
                    )}
                </Formik>
            </div>
        )
    }
}

export default VerifyOTP
