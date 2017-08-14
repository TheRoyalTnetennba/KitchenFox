import { combineReducers } from 'redux';
import SessionReducer from './session_reducer';
import InventoryReducer from './inventory_reducer';
import RecipeReducer from './recipe_reducer';

const appReducer = combineReducers({
  session: SessionReducer,
  inventory: InventoryReducer,
  recipes: RecipeReducer,
});

const RootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    state = undefined;
  }
  return appReducer(state, action);
};

export default RootReducer;
