import React, {useState, useEffect} from "react";
import {Route, HashRouter as Router, Routes} from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home"
import SearchRes from "./pages/Search/SearchRes";
import {playControllerRef} from "./pages/Search/component/SearchSongs";
import PlayController from "./components/Play-controller/PlayController";
import BackTop from "./components/BackTop/BackTop";


function App() {

  const [searchKeyword, setSearchKeyword] = useState<string>("");

  useEffect(() => {
    if (searchKeyword !== "") {
      window.location.hash = "/search";
    }
  }, [searchKeyword])

  window.onhashchange = function () {
    if (window.location.hash === "#/Play-page") {
      document.querySelector(".playPage")?.setAttribute("class", "playPage");
    } else {
      document
          .querySelector(".playPage")
          ?.setAttribute("class", "playPage hide");
    }
  };

  return (
      <div className = "App">
        <Header initiateSearchRequest = {(content: string) => {
          setSearchKeyword(content);
        }} />
        <Router>
          <Routes>
            <Route path = "/" element = {<Home />} />
            <Route path = "/search" element = {<SearchRes keywords = {searchKeyword} />} />
          </Routes>
        </Router>
        <PlayController ref = {playControllerRef} />
        <BackTop />
      </div>
  );
}

export default App;
