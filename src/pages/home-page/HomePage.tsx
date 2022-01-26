import React, {useState} from "react";
import "./base.css";
import Header from "./component/Header";
import SearchRes from "../search/SearchRes";
import Footer from "./component/Footer";
import ScrollToTop from "./component/ScrollToTop";
import PlayController from "../../components/play-controller/PlayController";
import {Route, Routes} from "react-router-dom";
import Login from "../../components/Login/Login";
import {playControllerRef} from "../search/component/SearchSongs";
import Register from "../../components/Register/Register";

// import "./homepage.css";
// import { BrowserRouter as Router, Route } from "react-router-dom";
// HomePage是网页首页的组件

export const SearchKeyWords = React.createContext<{
  keyWord: string;
  setKeyWord: (str: string) => void;
}>({ keyWord: "", setKeyWord: () => {} });

function HomePage() {
  const [keyWord, setKeyWord] = useState("");
  window.onhashchange = function () {
    if (window.location.hash === "#/play-page") {
      document.querySelector(".playPage")?.setAttribute("class", "playPage");
    } else {
      document
        .querySelector(".playPage")
        ?.setAttribute("class", "playPage hide");
    }
  };
  return (
    <>
      <div className="homepage-body">
        <SearchKeyWords.Provider
          value={{ keyWord: keyWord, setKeyWord: setKeyWord }}
        >
          <Header />
          <Routes>
            {keyWord === "" ? (
              <></>
            ) : (
              <Route
                path="/search"
                element={<SearchRes keywords={keyWord} />}
              />
            )}
            <Route path="/playPage" element={<></>} />

            {/* <Route path="/login" element={<Login />} /> */}
          </Routes>
        </SearchKeyWords.Provider>
        <Login />
        <Register />
        <ScrollToTop />
        <PlayController ref={playControllerRef} />
      </div>

      <Footer />
    </>
  );
}

export default HomePage;
