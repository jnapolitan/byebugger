import React from 'react';
import { Link } from 'react-router-dom';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.logoutUser = this.logoutUser.bind(this);
    this.getLinks = this.getLinks.bind(this);
  }

  logoutUser(e) {
      e.preventDefault();
      this.props.logout();
  }

  // Selectively render links dependent on whether the user is logged in
  getLinks() {
      if (this.props.loggedIn) {
        return (
            <>
                <Link to={'/profile'}>Profile</Link>
                <Link to={'/new_game'}>New Game</Link>
                <button onClick={this.logoutUser}>Quit</button>
            </>
        );
      } else {
        return (
            <>
                <Link to={'/signup'}>Signup</Link>
                <Link to={'/login'}>Login</Link>
            </>
        );
      }
  }

  render() {
      return (
        <>
            <h1>ByeBugger</h1>
            { this.getLinks() }
        </>
      );
  }
}

export default NavBar;
