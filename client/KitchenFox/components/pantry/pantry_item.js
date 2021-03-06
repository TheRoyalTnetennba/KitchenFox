import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';

import { View, TouchableHighlight } from 'react-native';
import { Container, Content, List, Picker, Item, Icon, InputGroup, Input, ListItem, Text, Card, CardItem, Body, Left, Button } from 'native-base';
import { button } from '../../style/button';
import { screen, pantry } from '../../style/layout';
import { text, pantryText } from '../../style/text';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';

import CustomStatusBar from '../misc/status_bar';
import { connect } from 'react-redux';
import { sendItems, requestItems } from '../../actions/inventory_actions';

class PantryItem extends React.Component {
  constructor(props) {
    super(props)

    const item = this.props.navigation.state.params.item;
    this.state = {
      name: Object.values(item)[0]['name'],
      quantity: Object.values(item)[0]['quantity'],
      units: Object.values(item)[0]['units']
    }
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleUpdate(quant = this.state.quantity) {
    dismissKeyboard();
    const { navigate } = this.props.navigation;
    const token = this.props.session.token;
    const item = this.props.navigation.state.params.item;
    const key = Object.keys(item)[0];
    const inventory = {
      inventory: {}
    };
    let obj = {};
    obj.name = this.state.name;
    obj.quantity = quant;
    obj.units = this.state.units;
    inventory['inventory'][`${key}`] = Object.assign(obj);
    this.props.sendItems(token, inventory);
    navigate('PantryIndex');
  }

  static navigationOptions = {
    title: 'Update Inventory',
  };

  render() {
    const item = this.props.navigation.state.params.item;
    const name = this.state.name;
    const qty = this.state.quantity;
    const units = this.state.units;
    return (
      <Container>
        <View style={screen.container}>
          <CustomStatusBar />
          <View style={pantry.updateItem}>
            <Text style={pantryText.updateItem}>
              {name}
            </Text>
          </View>
            <InputGroup style={pantry.updateQuan}>
              <View>
              <Input
                autoFocus={true}
                style={pantryText.updateQuan}
                keyboardType='numeric'
                onChangeText={(num) => {this.setState({quantity: num});}}
              ><Text style={pantryText.updateQuan}>{`${qty}`}</Text></Input>
              </View>
              <Text style={pantryText.updateQuanUnit}>{units}</Text>
            </InputGroup>
          <View style={pantry.groupButtons}>
          <TouchableHighlight
            style={button.negFormButton}
            onPress={() => this.handleUpdate(0)}
            >
            <Text style={text.negButton}>delete</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={button.posFormButton}
            onPress={() => this.handleUpdate()}
            >
            <Text style={text.posButton}>update</Text>
          </TouchableHighlight>
        </View>
        </View>
      </Container>
    );
  }
}

const mapStateToProps = ({ session, inventory }) => ({
  session,
  inventory
});

const mapDispatchToProps = dispatch => ({
  sendItems: (token, inventory) => dispatch(sendItems(token, inventory)),
  requestItems: token => dispatch(requestItems(token))
});

export default connect(mapStateToProps, mapDispatchToProps)(PantryItem);
