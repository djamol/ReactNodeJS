// Registration.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../actions/authActions';
import { Link } from 'react-router-dom';
import DashboardHeader from '../Dashboard/Header';
import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS


const Registration = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    username: '',
    password: '',
  });

  const [registrationSuccess, setRegistrationSuccess] = useState(false); // State to  successful
  const [error, setError] = useState(null); // State to error
  const [status_msg, setStatus] = useState(null);

  if (registrationSuccess) {
    console.log("success");
  }
  if (error) {
    console.log(error);
  }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData))
      .then((res) => {
        if (res.message) {
          setStatus(res.message); // Set error
          setTimeout(() => {
            setStatus(null);
          }, 2000);
          setRegistrationSuccess(true); // Set
        }
      })
      .catch((error) => {
        setError(error.message); // Set error message if login fails
      });
  };


  return (
    <div>
      <DashboardHeader />
      <div className="container mt-5">
        <h2>Registration</h2>
        {status_msg ? (
          <div className="container mt-5">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="alert alert-danger">
                  <h4 className="alert-heading">{status_msg}</h4>
                </div>
              </div>
            </div>
          </div>) : null}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label">
              First Name
            </label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              name="firstName"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="lastName" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              name="lastName"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phoneNo" className="form-label">
              Phone Number
            </label>
            <input
              type="tel"
              className="form-control"
              id="phoneNo"
              name="phoneNo"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
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
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Register
          </button>
          <p className="mt-3">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Registration;

