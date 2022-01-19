//import React, { Component, Fragment } from "react";
//import { Router } from "react-router";
import SideBar from "./components/Header";
import Home from "./components/Home";


import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

//import SideBar from "./components/sidebar/SideBar";
//import Content from "./components/content";
import "./App.css";

const App = () => {
  const [sidebarIsOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarIsOpen);

  return (
    <Router>
      <div className="App wrapper">
        <SideBar toggle={toggleSidebar} isOpen={sidebarIsOpen} />
        
        <Home />
      </div>
    </Router>
  );
};

export default App;
