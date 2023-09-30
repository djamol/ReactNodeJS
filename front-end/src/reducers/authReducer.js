// authReducer.js
const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const initialState = {
  isAuthenticated: false,
  token: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      console.log("action", action)
      localStorage.setItem('token', action.payload);
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload,
      };
    // Handle other authentication-related actions here
    default:
      return state;
  }
};

export default authReducer;

