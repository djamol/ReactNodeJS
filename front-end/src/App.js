import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Registration from './components/Auth/Registration';
import Login from './components/Auth/Login';
import FileUpload from './components/Dashboard/FileUpload';
import FileList from './components/Dashboard/FileList';
import Home from './components/Dashboard/Home';
//import PrivateRoute from './PrivateRoute';

const App = () => {
  return (
  
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />

          <Route path="/upload" element={<FileUpload />}  />
          <Route path="/dashboard" element={<FileList />} />
        </Routes>
      </Router>
    </Provider>
	);
};

export default App;


