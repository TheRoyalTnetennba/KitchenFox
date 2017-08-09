import * as APIUtil from '../util/session_api_util';

export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';
export const RECEIVE_ERRORS = 'RECEIVE_ERRORS';
export const LOGOUT = 'LOGOUT';

export const checkLogin = () => dispatch => (
  APIUtil.getLocalToken().then(token => this.props.setState({ currentUser: token }),
  err => this.props.setState({ currentUser: null })
));

export const receiveCurrentUser = currentUser => ({
  type: RECEIVE_CURRENT_USER,
  errors
});

export const receiveErrors = errors => ({
  type: RECEIVE_ERRORS,
  errors
});
