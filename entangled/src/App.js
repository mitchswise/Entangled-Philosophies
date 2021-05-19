import './App.css';
import { Component } from 'react';
import { BrowserRouter as Router, Switch, Link, Route} from 'react-router-dom';
import Home from './components/Home.js';
import About from './components/About.js';
import Sidebar from './components/Sidebar.js';
import APITest from './components/APITest.js';
import Register from './components/Register.js';
import Login from './components/Login.js';
import AddUser from './components/AddUser.js';
import Admin from './components/Admin.js';
import Logo from './components/logo.JPG';
import Logo2 from './components/mag_glass.JPG';

function App() {
  return (
    <div className="container" id="outer-container">
      <img src={Logo} id="logo"/>
      <img src={Logo2} id="logo2"/>
      <h1 id="entangledPhilosophies">Entangled Philosophies</h1>
      
      
    <div class="dropdown">
     <button class="dropbtn" id="dropdown">Choose Language</button>
   <div class="dropdown-content">
    <a href="#">English</a>
    <a href="#">German</a>
    </div>
    </div>

      <Router basename={'/~entangledPhilosophy/Entangled-Philosophies/entangled/build'}>
        <Sidebar outerContainerId={'outer-container'} />
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/about" component={About}/>
          <Route exact path="/apitest" component={APITest}/>
          <Route exact path="/register" component={Register}/>
          <Route exact path="/login" component={Login}/>
		  <Route exact path="/adduser" component={AddUser}/>
		  <Route exact path="/admin" component={Admin}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
