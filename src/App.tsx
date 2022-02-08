import React, { useState, useEffect, createRef } from "react";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import SearchRes from "./pages/Search/SearchRes";
import PlayController from "./components/Play-controller/PlayController";
import BackTop from "./components/BackTop/BackTop";
import Play from "./pages/Play/Play";

export const playControllerRef = createRef<PlayController>();

function App() {
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  useEffect(() => {
    if (searchKeyword !== "") {
      window.location.hash = "/search";
    }
  }, [searchKeyword]);

  return (
    <div className="App">
      <Header
        initiateSearchRequest={(content: string) => {
          setSearchKeyword(content);
        }}
      />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/search"
            element={<SearchRes keywords={searchKeyword} />}
          />
          <Route path="/play" element={<Play />} />
        </Routes>
      </Router>
      <PlayController ref={playControllerRef} />
      <BackTop />
    </div>
  );
}

export default App;
