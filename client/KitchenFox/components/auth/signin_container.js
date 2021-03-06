import { connect } from 'react-redux';
import SignIn from './signin';
import { signin } from '../../actions/session_actions';

const mapStateToProps = ({ session }) => ({
  session,
});

const mapDispatchToProps = dispatch => ({
  signin: user => dispatch(signin(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
