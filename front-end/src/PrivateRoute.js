import React from 'react';
import { Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

const PrivateRoute = ({ element, ...rest }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();
  const token = Cookies.get('token');

  if (isAuthenticated || token) {
    return <Route {...rest} element={element} />;
  } else {
    return (
      <Navigate
        to="/login"
        replace={true}
        state={{ from: location.pathname }}
      />
    );
  }
};

PrivateRoute.propTypes = {
  element: PropTypes.node.isRequired,
};

export default PrivateRoute;
