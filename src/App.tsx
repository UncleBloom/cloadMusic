import React from "react";
import "./App.css";
import HomePage from "./pages/home-page/HomePage";

import {HashRouter as Router} from "react-router-dom";

function App() {
  return (
      <Router>
        <div className = "App">
          <HomePage />
        </div>
      </Router>
  );
}

export default App;
