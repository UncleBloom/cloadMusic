import React, {useState} from "react";
import "./base.css";
import Header from "../../components/Head/Head";
import SearchRes from "../Search/SearchRes";
import Footer from "../../components/Footer/Footer";
import BackTop from "../../components/BackTop/BackTop";
import PlayController from "../../components/Play-controller/PlayController";
import {Route, Routes} from "react-router-dom";
import Login from "../../components/Login/Login";
import {playControllerRef} from "../Search/component/SearchSongs";
import Register from "../../components/Register/Register";
import Home from '../Home/Home'

// import "./homepage.css";
// import { BrowserRouter as Router, Route } from "react-router-dom";
// HomePage是网页首页的组件

export const SearchKeyWords = React.createContext<{
  keyWord: string;
  setKeyWord: (str: string) => void;
}>({
  keyWord: "", setKeyWord: () => {
  }
});

function HomePage() {
  const [keyWord, setKeyWord] = useState("");
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
      <>
        <div className = "homepage-body">
          <SearchKeyWords.Provider
              value = {{keyWord: keyWord, setKeyWord: setKeyWord}}
          >
            <Header />
            <Routes>
              {keyWord === "" ? (
                  <></>
              ) : (
                  <Route
                      path = "/search"
                      element = {<SearchRes keywords = {keyWord} />}
                  />
              )}
              <Route path = "/playPage" element = {<></>} />

              {/* <Route path="/login" element={<Login />} /> */}
            </Routes>
          </SearchKeyWords.Provider>
          <Login />
          <Register />
          <BackTop />
          <PlayController ref = {playControllerRef} />
          <Home />
        </div>

        <Footer />
      </>
  );
}

export default HomePage;
