import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authactions';


import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

import './App.css';
import { decode } from 'punycode';

//check token
if(localStorage.jwtToken){
  //set auth token header auth
  setAuthToken(localStorage.jwtToken);
  //decode
  const decoded = jwt_decode(localStorage.jwtToken);
  //set user
  store.dispatch(setCurrentUser(decoded));
  //check expired token
  const currentTime = Date.now() /1000;
  if(decode.exp < currentTime){
    store.dispatch(logoutUser());
    window.location.href = '/login';
  }
}


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path = '/' component = {Landing} />
            <div className = "container">
              <Route exact path = "/register" component = {Register}/>
              <Route exact path = "/login" component = {Login}/>
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
