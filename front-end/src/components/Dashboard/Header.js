// DashboardHeader.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import Cookies from 'js-cookie';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const token = Cookies.get('token');
  const navigate = useNavigate(); // Initialize useNavigate

  //  const stat = useSelector((state)=>state);
  //console.log("state",stat);
  const handleLogout = () => {
    dispatch(logoutUser());
    Cookies.remove('token');
    navigate('/login'); // Redirect to the home page

  };

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">My App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
          {isAuthenticated || token ? (
            <>
        <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/upload">Upload Files</Nav.Link>
                <Nav.Link href="/dashboard">View Files</Nav.Link>
              </Nav>
              </Navbar.Collapse>
              <Nav className="ml-auto">
                <Nav.Item>
                  <span className="navbar-text mr-3">Welcome, User!</span>
                  <Button variant="danger" onClick={handleLogout}>
                    Logout
                  </Button>
                </Nav.Item>
              </Nav>
            </>
          ) : (
            <>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/registration">Registration</Nav.Link>
              </Nav>
              </Navbar.Collapse>
              <Nav>
                <Nav.Item>You are not logged in.</Nav.Item>
              </Nav>
            </>
          )}
      </Navbar>

    </div>
  );
};

export default DashboardHeader;

