// authActions.js
import axiosInstance from '../api';

// Action Types
const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

// Action Creators
export const registerUser = (formData) => async (dispatch) => {
  try {
    const response = await axiosInstance.post('/register', formData);
    // Dispatch REGISTER_SUCCESS action
    if (response.data.status == 200) {
      dispatch({ type: REGISTER_SUCCESS, payload: response.data });
    }
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    return error.response.data;
  }
};

export const loginUser = (formData) => async (dispatch) => {
  try {
    const response = await axiosInstance.post('/login', formData);
    // Dispatch LOGIN_SUCCESS action
    dispatch({ type: LOGIN_SUCCESS, payload: response.data.token });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    return error.response.data;
  }
};
export const logoutUser = () => async (dispatch) => {
  dispatch({ type: LOGOUT_SUCCESS, payload: 'success' });
}
