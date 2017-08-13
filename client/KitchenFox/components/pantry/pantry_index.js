import React, { Component } from 'react';
import { View } from 'react-native';
import { Container, Content, List, ListItem, Button,
Card, CardItem, Left, Text } from 'native-base';

import { ACTIVE_TAB } from '../../style/common';
import { screen, pantry } from '../../style/layout';
import { button } from '../../style/button';
import { text, pantryText } from '../../style/text';
import { connect } from 'react-redux';
import { logout } from '../../actions/session_actions';
import { requestItems } from '../../actions/inventory_actions';
import NavFooter from '../nav/footer';

class PantryIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      quantity: 0,
      units: ''
    };

    this.renderItems = this.renderItems.bind(this);
  }

  componentWillMount() {
    // console.warn(JSON.stringify(this.props.session.token));
    if (this.props.session.token) {
      this.props.requestItems(this.props.session.token);
    }
  }

  handleLogout() {
    this.props.logout();
  }

  renderItems() {
    const { navigate } = this.props.navigation;
    const allId = Object.keys(this.props.inventory);
    const allItems = [];
    allId.forEach((id) => {
      let obj = {};
      obj[`${id}`] = this.props.inventory[`${id}`];
      allItems.push(obj);
    });

    // console.warn(JSON.stringify(allItems));
    if (allItems.length > 0) {
      return (
        <View>
        {allItems.map((item, idx) =>
          <View style={pantry.itemContainer} key={idx} onPress={() => {
            navigate('PantryItem', { item });
          }}>
            <Text style={pantryText.item}>{Object.values(item)[0]['name']}</Text>
            <Text style={pantryText.itemDesc}>{Object.values(item)[0]['quantity']}&nbsp;{Object.values(item)[0]['units']}</Text>
          </View>
        )}
      </View>
      );
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    const fullName = `${this.props.session.first_name} ${this.props.session.last_name}`;
    // console.warn(ACTIVE_TAB);
    return (
      <Container>
         <View style={screen.container}> 
              <Text style={text.titleCenter}>
                Your Ingredients
              </Text>

            {this.renderItems()} 
           {/* <Button
            style={button.sessionButton}
            onPress={(e) => this.handleLogout()}>
            <Text>LOGOUT</Text>
          </Button>  */}
           </View> 
        <NavFooter navigate={navigate} />
       </Container> 
    );
  }
}

const mapStateToProps = ({ session, inventory }) => ({
  session,
  inventory
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  requestItems: token => dispatch(requestItems(token))
});

export default connect(mapStateToProps, mapDispatchToProps)(PantryIndex);
