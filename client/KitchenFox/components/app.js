import React, { Component } from 'react';
import SignupContainer from './auth/signup_container';
import SigninContainer from './auth/signin_container';
import AddItemCard from './pantry/add_item_card';

import Welcome from '../screens/welcome';
import Pantry from '../screens/pantry';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      token: '',
      username: '',
    };
  }

  componentWillMount() {
    this.props.loadLocalUser();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.session.hasOwnProperty('token') &&
      newProps.session.token.length &&
      newProps.inventory &&
      Object.keys(newProps.inventory).length === 0) {
        this.props.requestItems(newProps.session.token);
    }
  }

  render() {
    if (this.props.session.token.length) {
      return (<Pantry />);
    } else {
      return (<Welcome />);
    }
  }
}

export default App;
