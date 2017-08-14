import React, { Component } from 'react';

import { Container, Content, List, ListItem, Button,
  Card, CardItem, Left, Text } from 'native-base';
import { View, TouchableHighlight, ScrollView } from 'react-native';

import { ACTIVE_TAB, ORANGE_LIGHT } from '../../style/common';
import { screen, pantry } from '../../style/layout';
import { button } from '../../style/button';
import { text, pantryText } from '../../style/text';

import { connect } from 'react-redux';
import { logout } from '../../actions/session_actions';
import NavFooter from '../nav/footer';

class PantryIndex extends React.Component {
  constructor(props) {
    super(props);
    const component = Object.keys(this.props.inventory).length ? this.renderItems() : this.renderNoInventory();
    this.state = {
      name: '',
      quantity: 0,
      units: '',
      items: '',
      toRender: component,
    };
    this.renderItems = this.renderItems.bind(this);
    this.renderNoInventory = this.renderNoInventory.bind(this);
  }

  componentWillMount() {
    // this.toRender = Object.keys(this.props.inventory).length ? this.renderItems() : this.renderNoInventory();
  }

  componentWillReceiveProps(newProps) {
    if (Object.keys(newProps.inventory).length !== Object.keys(this.props.inventory).length) {
      this.selectToRender(newProps);
    }
  }

  selectToRender(props = this.props) {
    toRender = Object.keys(this.props.inventory).length ? this.renderItems(props) : this.renderNoInventory();
    this.setState({ toRender: toRender })
  }


  handleLogout() {
    this.props.logout();
  }

  renderNoInventory() {
    const { navigate } = this.props.navigation;
    const items = (
      <Container>
        <ListItem itemDivider>
          <Text>There is nothing in your pantry or fridge</Text>
        </ListItem>
        <Button onPress={() => { navigate('AddItem'); }}>
          <Text>Add Item</Text>
        </Button>
      </Container>
    );
    this.toRender = items;
    return items
  }

  renderItems(props = this.props) {
    const { navigate } = this.props.navigation;
    const allId = Object.keys(props.inventory);
    const allItems = [];
    allId.forEach((id) => {
      let obj = {};
      obj[`${id}`] = props.inventory[`${id}`];
      allItems.push(obj);
    });
    let items;
    if (allItems.length > 0) {
      items = (
        <View>
        {allItems.map((item, idx) =>
          <TouchableHighlight
            key={idx}
            underlayColor={ORANGE_LIGHT}
            onPress={() => {navigate('PantryItem', { item });
          }}>
          <View style={pantry.itemContainer}>
            <Text style={pantryText.item}>{Object.values(item)[0]['name']}</Text>
            <Text style={pantryText.itemDesc}>{Object.values(item)[0]['quantity']}&nbsp;{Object.values(item)[0]['units']}</Text>
          </View>
          </TouchableHighlight>
        )}
      </View>
      );
    } else if (allItems.length === 0) {
      items = this.renderNoInventory();
    }
    this.toRender = items;
    return items
  }

  render() {
    const { navigate } = this.props.navigation;
    const fullName = `${this.props.session.first_name} ${this.props.session.last_name}`;
    const items = this.state.items
    return (
      <Container>
         <View style={screen.container}>
              <Text style={text.titleCenter}>
                Your Ingredients
              </Text>
            <ScrollView>
              {this.state.toRender}
            <Button
              style={button.sessionButton}
              onPress={(e) => this.handleLogout()}>
              <Text>LOGOUT</Text>
            </Button>
            </ScrollView>
           </View>
        <NavFooter navigation={this.props.navigation} />
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
});

export default connect(mapStateToProps, mapDispatchToProps)(PantryIndex);
