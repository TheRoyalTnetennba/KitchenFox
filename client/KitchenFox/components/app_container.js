import { connect } from 'react-redux';
import App from './app';
import { loadLocalUser } from '../actions/session_actions';
import { requestItems } from '../actions/inventory_actions';

const mapStateToProps = ({ session, inventory }) => (
  {
    session,
    inventory,
  }
);

const mapDispatchToProps = dispatch => (
  {
    loadLocalUser: () => dispatch(loadLocalUser()),
    requestItems: token => dispatch(requestItems(token)),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(App);
