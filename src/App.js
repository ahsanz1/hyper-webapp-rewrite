import React, { Component } from 'react';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import './App.css';
import Header from './components/header';
import Home from './pages/home';
import Stores from './pages/stores';
import StoreFront from './pages/store-front';
import SubCategories from './pages/sub-categories';
import AllProducts from './pages/all-products';
import Signup from './components/signup';
import Login from './components/login';
import Cart from './components/cart';
import withRedux from './redux'
import Checkout from './pages/checkout';
import CheckoutHeader from './components/checkout-header';


export class App extends Component {
  constructor(props) {
    super(props)
    this.state = { isLoggedIn: true }
  }

  componentDidMount() {

  }

  toggleSidebar() {
    this.setState = ({ sidebarOpen: !this.state.sidebarOpen })
  }

  render() {
    console.log('app render======')
    return (
      <div className="App">

        {this.props.auth.isLoggedIn ? (
          <div >
            <Cart></Cart>
            <Header></Header>
          </div>
        ) : null}


        <Switch>
          {this.props.auth.isLoggedIn ? (
            <div>
              <Route
                path='/'
                exact={true}
                component={Stores}>
              </Route>
              <Route
                path='/home'
                exact={true}
                component={Stores}>
              </Route>
              <Route
                path='/stores'
                exact={true}
                component={Stores}>
              </Route>
              <Route
                path='/storefront/:store_slug/:location_id'
                exact={true}
                component={StoreFront}>
              </Route>
              <Route
                path='/storefront/:store_slug/:location_id/category/:category_name/:category_id'
                exact={true}
                component={SubCategories}>
              </Route>
              <Route
                path='/storefront/:location_id/products/:subcat_name/:subcat_id'
                exact={true}
                component={AllProducts}>
              </Route>
              <Route
                path='/checkout'
                exact={true}
                component={Checkout}>
              </Route>
            </div>
          ) : (
              <div>
                <Route
                  path='/auth/signup'
                  exact={true}
                  component={Signup}>
                </Route>
                <Route
                  path='/auth/login'
                  exact={true}
                  component={Login}>
                </Route>
                <Redirect to='/auth/login'></Redirect>
              </div>
            )}
        </Switch>
      </div>
    )
  };
}

export default withRouter(withRedux(App));
