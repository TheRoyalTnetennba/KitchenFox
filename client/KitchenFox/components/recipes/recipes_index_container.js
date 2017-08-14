import { connect } from 'react-redux';
import RecipesIndex from './recipes_index';
import { logout } from '../../actions/session_actions';


const mapStateToProps = ({ session, inventory }) => (
  {
    session,
    inventory
  }
);

const mapDispatchToProps = dispatch => (
  {
    logout: () => dispatch(logout()),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(RecipesIndex);
