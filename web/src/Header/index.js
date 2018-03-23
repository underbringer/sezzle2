import React, { Component } from 'react';

import LoginLogout from './LoginLogout';

class Header extends Component {

  render() {
    return (
        <div className="navbar-menu">
          <LoginLogout {...this.props} />
        </div>
    )
  }

}

export default Header;
