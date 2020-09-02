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

export class CreatePW extends Component {
    constructor(props) {
        super(props)
    } _
    handleValidations = (values) => {
        const errors = {};
        if (!values.password) {
            errors.password = '* Required';
        }
        return errors;
    };
    render() {
        return (
            <div>
                <Formik
                    initialValues={{ password: '' }}
                    validate={this.handleValidations}
                    onSubmit={this.props.showTerms}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <FormGroup>
                                <Label for='password'>Create Password</Label>
                                <Field
                                    type='password'
                                    className='form-control'
                                    placeholder='password'
                                    name='password'
                                />
                                <ErrorMessage
                                    name='password'
                                    component='small'
                                    className='text-danger'
                                />
                            </FormGroup>
                                <Button
                                    className='bg-color-blue'
                                    type='submit'
                                    disabled={isSubmitting || !this.props.pwCreated}
                                    block>
                                    Create
                                </Button>
                           

                        </Form>
                    )}
                </Formik>
            </div>
        )
    }
}

export default CreatePW
