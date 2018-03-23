import React, { Component } from 'react';
import { Route } from 'react-router-dom'

import { withAuth } from './Auth';
import ApiDemoPage from './ApiDemoPage';
import Footer from './Footer';
import FrontPage from './FrontPage';
import Header from './Header';
import ProfilePage from './ProfilePage';

class App extends Component {

  render() {

    // this.props has a bunch of stuff in it related to auth0 (from `withAuth` below)
    // console.log('props', this.props);

    return (
      <div className="App">

        <Header {...this.props} />

        <section className="section">
          <div className="content">

            <Route exact path="/" render = {props => <FrontPage {...props} {...this.props}/>}/>

            {/* send in props for router stuff; send in this.props for auth stuff */}

          </div>
        </section>

      </div>
    );
  }
}

export default withAuth(App);
