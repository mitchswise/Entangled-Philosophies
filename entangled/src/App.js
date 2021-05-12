import './App.css';
import { Component } from 'react';
import { BrowserRouter as Router, Switch, Link, Route} from 'react-router-dom';
import Home from './components/Home.js';
import About from './components/About.js';
import Sidebar from './components/Sidebar.js';
import APITest from './components/APITest.js';
import AddUser from './components/AddUser.js';

function App() {
  return (
    <div className="container" id="outer-container">
      
      <Router basename={'/~entangledPhilosophy/Entangled-Philosophies/entangled/build'}>
        <Sidebar outerContainerId={'outer-container'} />
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/about" component={About}/>
          <Route exact path="/apitest" component={APITest}/>
          <Route exact path="/adduser" component={AddUser}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
