import React from "react";
import "./App.css";
import PlayController from "./components/play-controller";
import HomePage from "./pages/home-page/HomePage";
import { HashRouter as Router, Route, Link, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <HomePage />
      </div>
    </Router>
  );
}

export default App;
