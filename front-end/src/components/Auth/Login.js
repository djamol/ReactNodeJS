// Login.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../actions/authActions';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import DashboardHeader from '../Dashboard/Header';
import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS


const Login = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [error_msg, setError] = useState(null);
  const navigate = useNavigate(); // Initialize the useNavigate 
  const { username, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData))
      .then((res) => {
        console.log("token:", res.token);
        if (res.token) {
          Cookies.set('token', res.token, { expires: 20 / (60 * 24) });
          setLoginSuccess(true); // Set login
        } else {
          setError(res.message); // Set error
          setTimeout(() => {
            setError(null);
          }, 5000);
        }
      })
      .catch((error) => {
        setError(error.message); // Set error
        setTimeout(() => {
          setError(null);
        }, 5000);
      });
  };
  if (loginSuccess) {
    navigate('/upload');
  }
  return (
    <div>
      <DashboardHeader />
      <div className="container mt-5">
        <h2>Login</h2>
        {error_msg ? (
          <div className="container mt-5">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="alert alert-danger">
                  <h4 className="alert-heading">{error_msg}</h4>
                  <p>Please check your username and password and try again.</p>
                </div>
              </div>
            </div>
          </div>) : null}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
          <p className="mt-3">
            Dont have an account? <Link to="/registration">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

