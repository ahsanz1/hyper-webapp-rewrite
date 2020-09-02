import React from 'react'
import { Container } from 'reactstrap'
import Signup from '../components/signup'

const Home = () => {
    return (
        <div>
            <Container className='h-100 w-50 d-flex justify-content-center align-items-center border'>
                <Signup></Signup>
            </Container>
        </div>
    )
}

export default Home
