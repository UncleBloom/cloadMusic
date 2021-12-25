import React from "react";
import "./App.css";
import HomePage from "./pages/home-page/HomePage";
import PlayController from './components/play-controller/index';

function App() {
  return (
    <div className="App">
      {/* <HomePage /> */}
      <PlayController/>
    </div>
  );
}

export default App;
