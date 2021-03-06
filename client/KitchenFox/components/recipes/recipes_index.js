import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import { Container, Content, Header, View, DeckSwiper, Card, CardItem, Thumbnail,
Text, Left, Body, Icon, Button, List, ListItem } from 'native-base';
import { getRecipes } from '../../util/api_util';
import  RecipeCard from './recipe_card';
import CheckBox from 'react-native-checkbox';
import { Image, TouchableHighlight, ScrollView } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import EmptyPantry from '../pantry/pantry_empty';
import CustomStatusBar from '../misc/status_bar';
import  { ORANGE, ORANGE_LIGHT, ORANGE_LIGHTER, WHITE, BLUE_LIGHT } from '../../style/common';
import  { button, back } from '../../style/button';
import { screen, pantry, icon } from '../../style/layout';
import { text, pantryText } from '../../style/text';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

class RecipesIndex extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      recipes: "none",
      query: {},
      spinner: false,
    };
    this.fetchRecipes = this.fetchRecipes.bind(this);
    this.renderNoInventory = this.renderNoInventory.bind(this);
  }

  fetchRecipes(query) {
    this.setState({spinner: true});
    if (query === "all") {
    getRecipes(5, null, this.props.session.token).then((res) => {
      if (res.status === 503) {
        let dummy = [{'label': 'Server Error, try this recipe instead!',
          'url':'http://www.grouprecipes.com/40883/tuttu-frutti-ice-cream.html',
          'image':'https://www.edamam.com/web-img/0ab/0ab967ea9b889bd387fbd2d7aff64f83.jpg' }];
        this.setState({recipes: dummy});
        this.setState({spinner: false});
      } else {
        this.setState({recipes: JSON.parse(res._bodyText)});
        this.setState({spinner: false});
      }
    });
    } else {
    getRecipes(5, (Object.values(this.state.query).join("+")), this.props.session.token).then((res) => {
      if (res.status === 503) {
        let dummy = [{'label': 'Server Error, try this recipe instead!', 'url':'https://www.campbells.com/kitchen/recipes/lucky-duck-cupcakes', 'image':'https://www.edamam.com/web-img/007/007643dc0b88f69b82cff6341a7fcfe2.jpg' }];
        this.setState({recipes: dummy});
        this.setState({spinner: false});
      } else {
        this.setState({recipes: JSON.parse(res._bodyText)});
        this.setState({spinner: false});
      }
    });
    }
  }


  checkBoxUpdate(checked, idx, name){
    const newQuery = Object.assign(this.state.query);
    if (checked === true) {
        if (name.includes(",")) {
          newQuery[idx] = (name.split(",")).join("+");
        } else {
          newQuery[idx] = name;
        }
    } else {
      delete newQuery[idx];
    }
    this.setState({query: newQuery});
  }

  renderNoInventory() {
    return(
      <EmptyPantry navigation={this.props.navigation} />
    );
  }

  renderItems() {
    const allId = Object.keys(this.props.inventory);
    const allItems = [];
    allId.forEach((id) => {
      let obj = {};
      obj[`${id}`] = this.props.inventory[`${id}`];
      allItems.push(obj);
    });

    if (allItems.length > 0) {
      return (
        <View>
        {allItems.map((item, idx) =>
          <View key={idx} style={pantry.itemContainer}>
            <CheckBox
              checkboxStyle={{
                backgroundColor: ORANGE_LIGHT,
                tintColor: WHITE,
                width: 18,
                height: 18,
              }}
              underlayColor={ORANGE}
              key={idx}
              label={""}
              checked={Boolean(this.state.query[idx])}
              onChange={(checked) => this.checkBoxUpdate(!checked, idx, Object.values(item)[0]['name'])}
            />
            <Text style={pantryText.itemForRecipe}>{Object.values(item)[0]['name']}</Text>
            <Text style={pantryText.itemDesc}>{Object.values(item)[0]['quantity']}&nbsp;{Object.values(item)[0]['units']}</Text>
          </View>
        )}
      </View>
      );
    } else if (allItems.length === 0) {
      return this.renderNoInventory();
    }
  }

  recipes(){
    let recipes = [];
    const { navigate } = this.props.navigation;
    if (this.state.recipes.length > 0) {
      for (let i = 0; i < this.state.recipes.length; i++) {
        let j = (
          <RecipeCard key={i} recipeInfo={this.state.recipes[i]} />
        );
        recipes.push(j);
      }
      return recipes;
    } else {
      return (
      <View style={{backgroundColor: '#eee', paddingBottom: 30}}>
          <Text style={text.titleDiminishedNeg}>Sorry, no recipes matched with the ingredients you chose</Text>
          <TouchableHighlight style={button.posFormButton}
                              underlayColor={BLUE_LIGHT}
                              onPress={() => {
                              navigate('AddItem');
          }}>
          <Text style={text.posButton}>add Items</Text>
          </TouchableHighlight>
      </View>
    );
    }
  }

  renderButton() {
    if (Object.keys(this.props.inventory).length > 0) {
      return(
      <View style={pantry.groupButtons}>
        <TouchableHighlight style={button.negFormButtonRecipe}
                            underlayColor={BLUE_LIGHT}
                            onPress={() => this.fetchRecipes("all")}>
          <Text style={text.negButtonRecipe}>all my food</Text>
        </TouchableHighlight>

        <TouchableHighlight style={button.posFormButtonRecipe} 
                            underlayColor={BLUE_LIGHT}
                            onPress={() => this.fetchRecipes("none")}>
          <Text style={text.posButtonRecipe}>my selected food</Text>
        </TouchableHighlight>
      </View>
    );
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    const { navigation } = this.props;

    const recipes = this.recipes();
    const items = this.renderItems();
    let spinner;
    if (this.state.spinner) {
        spinner = (<View style={{ flex: 1 }}><Spinner visible={true} textContent={"Loading..."} textStyle={{color: '#FFF'}} /></View>);
    } else {
      spinner = (<View style={{ flex: 1 }}><Spinner visible={false} textContent={"Loading..."} textStyle={{color: '#FFF'}} /></View>);
    }
    if (this.state.recipes === "none") {
      return (
        <View style={screen.container}>
          <CustomStatusBar />
          <ScrollView>
             <View style={back.container}>
            <TouchableHighlight 
              onPress={() => navigation.goBack(null)}
              underlayColor='#fff'>
              <EvilIcons name='arrow-left' style={icon.back} />
            </TouchableHighlight>
            <View>
              <Text style={text.titleDiminished}>I want to cook with...</Text>
            </View>
            <View>
              <EvilIcons name='arrow-left' style={icon.backPadding} />
            </View>
          </View> 
            {items}
          </ScrollView>
            {spinner}
            {this.renderButton()}
        </View>
      );
    } else {
    return (
      <View style={screen.container}>
         <CustomStatusBar /> 
        <ScrollView>
            <View style={back.container}>
            <TouchableHighlight 
              onPress={() => navigation.goBack(null)}
              underlayColor='#fff'>
              <EvilIcons name='arrow-left' style={icon.back} />
            </TouchableHighlight>
            <View>
              <Text style={text.titleDiminished}>Recipes for you</Text>
            </View>
            <View>
              <EvilIcons name='arrow-left' style={icon.backPadding} />
            </View>
          </View>
        <View>
          {recipes}
        </View>
        </ScrollView>
      </View>
    );
    }
  }
}

export default RecipesIndex;
