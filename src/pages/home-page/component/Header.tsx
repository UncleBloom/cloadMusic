import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import "../homepage.css";
// import { Link } from "react-router-dom";
// 首页Header组件，包含Logo组件、Nav组件,Search组件
interface ISearchProps {
  placeHolder: string;
}

//index用于表示当前页面是第几个page，并对对应的a添加css效果
const SelectedPage = React.createContext<{
  index: number;
  setIndex: (num: number) => void;
}>({ index: 1, setIndex: () => {} });

//Logo组件，使用h1提权，进行一定的SEO优化
function Logo() {
  const { index, setIndex } = useContext(SelectedPage);
  const changePage = (index: number) => {
    setIndex(index);
  };
  return (
    <h1
      className={"logo"}
      onClick={() => {
        changePage(1);
      }}
    >
      <a title="网易云音乐" href="#">
        网易云音乐
      </a>
    </h1>
  );
}

//Nav组件，返回一个nav标签
function Nav() {
  const { index, setIndex } = useContext(SelectedPage);
  const changePage = (index: number) => {
    setIndex(index);
  };
  return (
    <nav className={"homepage-nav"}>
      <ul>
        <li>
          <a
            href="#"
            className={index == 1 ? "selected" : ""}
            onClick={() => {
              changePage(1);
            }}
          >
            发现音乐
          </a>
        </li>
        <li>
          <a
            href="#"
            className={index == 2 ? "selected" : ""}
            onClick={() => {
              changePage(2);
            }}
          >
            我的音乐
          </a>
        </li>
        <li>
          <a
            href="#"
            className={index == 3 ? "selected" : ""}
            onClick={() => {
              changePage(3);
            }}
          >
            朋友
          </a>
        </li>
        <li>
          <a
            href="#"
            className={index == 4 ? "selected" : ""}
            onClick={() => {
              changePage(4);
            }}
          >
            商城
          </a>
        </li>
        <li>
          <a
            href="#"
            className={index == 5 ? "selected" : ""}
            onClick={() => {
              changePage(5);
            }}
          >
            音乐人
          </a>
        </li>
        <li>
          <a
            href="#"
            className={index == 6 ? "selected" : ""}
            onClick={() => {
              changePage(6);
            }}
          >
            下载客户端
          </a>
          <sup></sup>
        </li>
      </ul>
    </nav>
  );
}

//Search组件，用一个盒子包含input和span（搜索图标）
//有参数placeHolder（placeholder）
function SearchInput(props: ISearchProps) {
  const [value, setValue] = useState("");
  const [placeHolder, setPlaceHolder] = useState(props.placeHolder);
  return (
    <div className={"homepage-search"}>
      <span></span>
      <input
        placeholder={placeHolder}
        onFocus={(e) => {
          setPlaceHolder("");
        }}
        onBlur={(e) => {
          if (e.target.value === "") {
            setPlaceHolder(props.placeHolder);
          }
        }}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <span
        className={value === "" ? "hide" : ""}
        onClick={() => {
          setValue("");
          setPlaceHolder(props.placeHolder);
        }}
      >
        ×
      </span>
    </div>
  );
}

function Header() {
  const [index, setIndex] = useState(1);
  return (
    <header className={"homepage-header"}>
      <SelectedPage.Provider value={{ index: index, setIndex: setIndex }}>
        <Logo />
        <Nav />
      </SelectedPage.Provider>
      <SearchInput placeHolder={"音乐/视频/电台/用户"} />
      <span className={"writer-center"}>
        <a href="#">创作者中心</a>
      </span>
      <span className={"login"}>
        <a href="#">登录</a>
      </span>
    </header>
  );
}

export default Header;
