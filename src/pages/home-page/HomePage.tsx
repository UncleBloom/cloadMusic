import React from "react";
import ReactDOM from "react-dom";
import "./base.css";
import Header from "./component/Header";
import SearchRes from "../search/SearchRes";
// import "./homepage.css";
// import { BrowserRouter as Router, Route } from "react-router-dom";
// HomePage是网页首页的组件

function HomePage() {
  return (
    <>
      <Header />
      <SearchRes keywords={"海阔天空"} />
    </>
  );
}

export default HomePage;
