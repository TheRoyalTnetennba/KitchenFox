import merge from 'lodash/merge';
import { RECEIVE_RECIPES } from '../actions/recipe_actions';

const InventoryReducer = (state = {}, action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_RECIPES:
      return Object.assign({}, action.recipes);
    default:
      return state;
  }
};

export default InventoryReducer;
