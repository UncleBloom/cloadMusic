import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./base.css";
import Header from "./component/Header";
import SearchRes from "../search/SearchRes";
import Footer from "./component/Footer";
import ScrollToTop from "./component/ScrollToTop";
import PlayController from "../../components/play-controller";
import { HashRouter as Router, Route, Link, Routes } from "react-router-dom";

// import "./homepage.css";
// import { BrowserRouter as Router, Route } from "react-router-dom";
// HomePage是网页首页的组件

export const SearchKeyWords = React.createContext<{
  keyWord: string;
  setKeyWord: (str: string) => void;
}>({ keyWord: "", setKeyWord: () => {} });

function HomePage() {
  const [keyWord, setKeyWord] = useState("");
  return (
    <>
      <SearchKeyWords.Provider
        value={{ keyWord: keyWord, setKeyWord: setKeyWord }}
      >
        <Header />
        <Routes>
          {keyWord === "" ? (
            <></>
          ) : (
            <Route path="/search" element={<SearchRes keywords={keyWord} />} />
          )}
          <Route path="/playPage" element={<></>} />
        </Routes>
      </SearchKeyWords.Provider>
      <ScrollToTop />
      <PlayController />
      <Footer />
    </>
  );
}

export default HomePage;
