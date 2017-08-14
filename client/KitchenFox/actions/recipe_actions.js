import * as APIUtil from '../util/api_util';

export const RECEIVE_RECIPES = 'RECEIVE_RECIPES';

export const receiveRecipes = recipes => ({
  type: RECEIVE_RECIPES,
  recipes,
});

export const requestRecipes = (number, query, token) => dispatch => {
  APIUtil.getRecipes(number, query, token).then((recipeArr) => {
    const parsedRec = JSON.parse(recipeArr._bodyText);
    dispatch(receiveRecipes(parsedRec[0]));
  })
};
