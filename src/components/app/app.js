import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import axios from 'axios';
import LoginPage from "../login-page/login-page";
import ProfilePage from "../profile-page/profile-page";
import { AuthContext } from '../../context/auth';

const checkIfTokenInStorage = (token) => token !== 'null' && token !== null;

const App = () => {
  const authToken = localStorage.getItem('authToken');
  const userFromStorage = localStorage.getItem('user');
  const isTokenInStorage = checkIfTokenInStorage(authToken);
  const isAuthenticated = userFromStorage !== null && isTokenInStorage;

  const [token, setToken] = useState(isAuthenticated ? authToken : null);
  const [user, setUser] = useState(isAuthenticated ? JSON.parse(userFromStorage) : null);

  axios.defaults.headers.common.Authorization = token ? `Bearer ${token}` : null;

  const setAuthInfo = (encodedJwt) => {
    localStorage.setItem('authToken', encodedJwt);
    setToken(encodedJwt);
  };
  const setUserInfo = (userInfo) => {
    localStorage.setItem('user', JSON.stringify(userInfo));
    setUser(userInfo);
  };
  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated, user, logout, setAuthInfo, setUserInfo,
    }}>
      <Router>
        <Route exact path="/" component={LoginPage}/>
        <Route exact path="/profile" component={ProfilePage}/>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
