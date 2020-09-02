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

export class GenerateOTP extends Component {
    constructor(props) {
        super(props)
    }

    handleValidations = (values) => {
        const errors = {};
        if (values.number && values.number.toString().length !== 10) {
            errors.number = 'Number must be exactly 10 digits'
        }
        if (!values.number) {
            errors.number = '* Required';
        }

        return errors;
    };
    _
    render() {
        return (
            <div>

                <Formik
                    initialValues={{ number: '' }}
                    validate={this.handleValidations}
                    onSubmit={this.props.handleOTP}
                >
                    {({ isSubmitting }) => (
                        <Form className='text-left'>
                            <FormGroup>
                                <Label for='number'>Phone number</Label>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>+1</InputGroupText>
                                    </InputGroupAddon>
                                    <Field
                                        type='number'
                                        className='form-control'
                                        placeholder='your phone number'
                                        name='number'
                                    />
                                </InputGroup>
                                <ErrorMessage
                                    name='number'
                                    component='small'
                                    className='text-danger'
                                />
                            </FormGroup>

                            <Button
                                type='submit'
                                disabled={isSubmitting || this.props.otpSent}
                                block
                                className='bg-color-blue'>
                                Continue
                                </Button>
                        </Form>
                    )}
                </Formik>

            </div>
        )
    }
}

export default GenerateOTP
