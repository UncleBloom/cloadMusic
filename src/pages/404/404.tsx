import React from "react";
import "./404.scss";

export default function Page404() {
  return (
    <div className="Page404">
      <img src={require("./404.png")} alt="" />
      <div className="title">
        <h2>Page lost...</h2>
        <h4>Hello dear! This page is under development...</h4>
      </div>
    </div>
  );
}
