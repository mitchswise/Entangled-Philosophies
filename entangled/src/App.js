import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useState } from 'react';
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
import Queries from './components/Queries.js';
import Logo from './components/logo.JPG';
import Logo2 from './components/mag_glass.JPG';
import { cookies, getGlobalLanguage, getUserInfo, setGlobalLanguage } from './api.js';
import CookieConsent from "react-cookie-consent";


function App() {
  const publicIp = require('public-ip');
  const [curLanguage, setCurLanguage] = useState(getGlobalLanguage());
  const [cookiesPerms, setCookiesPerms] = useState(false);

  function updateLanguage(newLang) {
    if (cookiesPerms) {
      console.log("Cookies?");
      cookies.set('PrefLang', newLang, { path: '/' });
    }
    setCurLanguage(newLang);
  }

  return (
    <div className="container" id="outer-container">
      <img src={Logo} id="logo" />
      <img src={Logo2} id="logo2" />
      {/* <h1 id="entangledPhilosophies">Entangled Philosophies</h1> */}

      {
        !cookies.get('UserID') ? //only runs if there is no user logged in
          <div class="dropdown" id="dropdowncontainer">
            <button class="dropbtn" id="dropdown">Choose Language</button>
            <div class="dropdown-content">
              <button type="submit" id="englishButton" onClick={() => updateLanguage("eng")} >English</button>
              <button type="submit" id="germanButton" onClick={() => updateLanguage("ger")} >German</button>
            </div>
          </div>
          : <></>
      }


      <CookieConsent
        onAccept={async () => {
          let ip = await publicIp.v4({
            fallbackUrls: ["https://ifconfig.co/ip"]
          });
          console.log(ip + ": Accepted");
          setCookiesPerms(true);
        }}
        enableDeclineButton
        onDecline={async () => {
          let ip = publicIp.v4({
            fallbackUrls: ["https://ifconfig.co/ip"]
          });
          console.log(ip + ": Declined");
          setCookiesPerms(false);
        }}
      >
        This website uses cookies to enhance the user experience.
      </CookieConsent>

      <Router basename={'/~entangledPhilosophy/Entangled-Philosophies/entangled/build'}>
        <Sidebar curLang={curLanguage} outerContainerId={'outer-container'} />
        <Switch>
          <Route exact path="/" render={() => <Home userLang={curLanguage} />} />
          <Route exact path="/about" component={About} />
          <Route exact path="/apitest" component={APITest} />
          <Route exact path="/register" render={() => <Register userLang={curLanguage} />} />
          <Route exact path="/login" render={() => <Login userLang={curLanguage} />} />
          <Route exact path="/adduser" component={AddUser} />
          <Route exact path="/admin" component={Admin} />
          <Route exact path="/uploadpaper" component={UploadPaper} />
          <Route exact path="/forgotpass" component={ForgotPass} />
          <Route exact path="/tags" component={Tags} />
          <Route exact path="/search" render={(props) => <Search userLang={curLanguage} {...props} />} />
          <Route exact path="/settings"render={() => <Settings userLang={curLanguage} />} />
          <Route exact path="/queries" component={Queries} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
