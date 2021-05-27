import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/Home.js';
import About from './components/About.js';
import Sidebar from './components/Sidebar.js';
import APITest from './components/APITest.js';
import Register from './components/Register.js';
import Login from './components/Login.js';
import AddUser from './components/AddUser.js';
import Admin from './components/Admin.js';
import ForgotPass from './components/ForgotPass.js';
import Tags from './components/Tags.js';
import UploadPaper from './components/UploadPaper.js';
import Search from './components/Search.js';
import Settings from './components/Settings.js';
import Logo from './components/logo.JPG';
import Logo2 from './components/mag_glass.JPG';

function App() {
  return (
    <div className="container" id="outer-container">
      <img src={Logo} id="logo" />
      <img src={Logo2} id="logo2" />
      {/* <h1 id="entangledPhilosophies">Entangled Philosophies</h1> */}


      <div class="dropdown" id="dropdowncontainer">
        <button class="dropbtn" id="dropdown">Choose Language</button>
        <div class="dropdown-content">
          <button type="submit" id="englishButton">English</button>
          <button type="submit" id="germanButton">German</button>
        </div>
      </div>

      <Router basename={'/~entangledPhilosophy/Entangled-Philosophies/entangled/build'}>
        <Sidebar outerContainerId={'outer-container'} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
          <Route exact path="/apitest" component={APITest} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/adduser" component={AddUser} />
          <Route exact path="/admin" component={Admin} />
		  <Route exact path="/uploadpaper" component={UploadPaper}/>
          <Route exact path="/forgotpass" component={ForgotPass} />
          <Route exact path="/tags" component={Tags} />
          <Route exact path="/search" component={Search} />
		  <Route exact path="/settings" component={Settings} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
