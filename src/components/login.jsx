import React, { Component } from 'react'
import {

    Button,
    Modal, ModalHeader, ModalBody, ModalFooter, Row, Col,
    FormGroup, Label, Input, FormText, InputGroupAddon, InputGroupText, InputGroup
} from 'reactstrap';

import { Formik, Field, ErrorMessage, Form } from 'formik';
import { Link } from 'react-router-dom';
import withRedux from '../redux'

export class Login extends Component {
    constructor(props) {
        super(props)
        console.log('login props====', props)
    }

    handleLogin = async (values, { setSubmitting }) => {
        console.log('login vals=====', values)
        try {
            let phoneNumber = `1${values.phoneNumber}`;
            const res = await this.props.login(phoneNumber, values.password);
            this.props.history.push('/stores');
            setSubmitting(false);
        } catch (err) {
            console.log(err)
        }
    };

    handleValidations = (values) => {
        console.log('loghoiasnda', values);
        const errors = {};
        if (!values.phoneNumber) {
            errors.phoneNumber = 'Required'
        }
        if (values.phoneNumber.toString().length !== 10) {
            errors.phoneNumber = 'Number must be exactly 10 digits'
        }
        if (!values.password) {
            errors.password = 'Required'
        }
        return errors;
    }

    render() {
        return (
            <div className='min-vh-100 d-flex align-items-center gradient'>
                <Row className='justify-content-center w-100 m-0 p-2'>
                    <Col className='col-xs-3 col-md-6 col-lg-5 rounded' style={{ background: '#ffffff' }}>
                        <ModalHeader className='d-flex justify-content-center'>
                            <img src='/hypr_logo.png' style={{ maxWidth: '100px', maxHeight: '40px' }}></img>
                        </ModalHeader>
                        <ModalBody>
                            <Formik
                                initialValues={{ phoneNumber: '', password: '' }}
                                validate={this.handleValidations}
                                onSubmit={this.handleLogin}
                            >
                                {({ isSubmitting }) => (
                                    <Form className='text-left'>
                                        <FormGroup>
                                            <Label for='phoneNumber'>Phone</Label>
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>+1</InputGroupText>
                                                </InputGroupAddon>
                                                <Field
                                                    type='number'
                                                    className='form-control'
                                                    placeholder='1234567890'
                                                    name='phoneNumber'
                                                />
                                            </InputGroup>
                                            <ErrorMessage
                                                name='phoneNumber'
                                                component='small'
                                                className='text-danger'
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for='password'>Password</Label>
                                            <Field
                                                type='password'
                                                className='form-control'
                                                name='password'
                                                placeholder='********'
                                            />
                                            <ErrorMessage
                                                name='password'
                                                component='small'
                                                className='text-danger'
                                            />
                                        </FormGroup>
                                        <Button
                                            className='btn btn-success'
                                            type='submit'
                                            disabled={isSubmitting}
                                            style={{ background: '#2b2f4c', borderColor: '#2b2f4c' }}
                                            block>
                                            Sign in
                                        </Button>
                                        <br></br>
                                        <div className='text-center'>
                                            <span className='text-faded'>
                                                Don't have an account?
                                                </span>
                                                &nbsp;
                                            <Link to="/auth/signup"
                                                style={{ textDecoration: 'none', fontWeight: '600' }}
                                                className='login-btn'>
                                                Sign up
                                                </Link>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </ModalBody>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default withRedux(Login)
