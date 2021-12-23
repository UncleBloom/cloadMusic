import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import "../homepage.css";

function Footer() {
  return (
    <footer className="homepage-footer">
      <div className="footer-msg">
        <div className="copy">
          <ul>
            <li>
              <a href="#">服务条款</a>
            </li>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <li>
              <a href="#">隐私政策</a>
            </li>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <li>
              <a href="#">儿童隐私政策</a>
            </li>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <li>
              <a href="#">版权投诉指引</a>
            </li>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <li>
              <a href="#">意见反馈</a>
            </li>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <li>
              <a href="#">广告合作</a>
            </li>
          </ul>
          <p>
            网易公司版权所有©1997-2021&nbsp;&nbsp;&nbsp;&nbsp;杭州乐读科技有限公司运营:&nbsp;&nbsp;
            <a>浙网文[2021] 1186-054号</a>
          </p>
          <p>
            违法和不良信息举报电话:0571-89853516&nbsp;&nbsp;&nbsp;&nbsp;举报邮箱:&nbsp;&nbsp;
            <a>ncm5990@163.com</a>
          </p>
          <p>
            <a>粤B2-20090191-18 工业和信息化部备案管理系统网站</a>&nbsp;&nbsp;
            <span></span>&nbsp;<a>浙公网安备 33010902002564号</a>
          </p>
        </div>
        <div className="enter-new">
          <ul>
            <li>
              <a href="#"></a>
              <span></span>
            </li>
            <li>
              <a href="#"></a>
              <span></span>
            </li>
            <li>
              <a href="#"></a>
              <span></span>
            </li>
            <li>
              <a href="#"></a>
              <span></span>
            </li>
            <li>
              <a href="#"></a>
              <span></span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
