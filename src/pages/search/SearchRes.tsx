import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./searchres.css";
import getSearchData, { ISearchSongsProps } from "./component/getSearchData";
import { AxiosResponse } from "axios";
import SearchSongs from "./component/SearchSongs";

interface ISearchResProps {
  keywords: string;
  limit?: number;
  offset?: number;
  type?: number;
  //limit : 返回数量 , 默认为 30
  //offset : 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
  //type: 搜索类型；默认为 1 即单曲 ,
  //取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
}

interface IBestMatchedProps {
  imgUrl: string;
  singer: string;
  alia?: string;
}

//index用于表示当前页面是第几个page，并对对应的a添加css效果
const SelectedPage = React.createContext<{
  type: number;
  setType: (num: number) => void;
}>({ type: 1, setType: () => {} });

function SearchNav() {
  const { type, setType } = useContext(SelectedPage);
  const changeType = (type: number) => {
    setType(type);
  };
  return (
    <nav className={"search-nav"}>
      <ul>
        <li>
          <a
            href="#"
            className={type == 1 ? "search-selected" : ""}
            onClick={() => {
              changeType(1);
            }}
          >
            单曲
          </a>
        </li>
        <li>
          <a
            href="#"
            className={type == 100 ? "search-selected" : ""}
            onClick={() => {
              changeType(100);
            }}
          >
            歌手
          </a>
        </li>
        <li>
          <a
            href="#"
            className={type == 10 ? "search-selected" : ""}
            onClick={() => {
              changeType(10);
            }}
          >
            专辑
          </a>
        </li>
        <li>
          <a
            href="#"
            className={type == 1014 ? "search-selected" : ""}
            onClick={() => {
              changeType(1014);
            }}
          >
            视频
          </a>
        </li>
        <li>
          <a
            href="#"
            className={type == 1000 ? "search-selected" : ""}
            onClick={() => {
              changeType(1000);
            }}
          >
            歌单
          </a>
        </li>
        <li>
          <a
            href="#"
            className={type == 1006 ? "search-selected" : ""}
            onClick={() => {
              changeType(1006);
            }}
          >
            歌词
          </a>
        </li>
        <li>
          <a
            href="#"
            className={type == 2 ? "search-selected" : ""}
            onClick={() => {
              changeType(2);
            }}
          >
            播客
          </a>
        </li>
        <li>
          <a
            href="#"
            className={type == 1002 ? "search-selected" : ""}
            onClick={() => {
              changeType(1002);
            }}
          >
            用户
          </a>
        </li>
      </ul>
    </nav>
  );
}

//最佳匹配组件
function BestMatched(props: IBestMatchedProps) {
  return (
    <div className="best-matched">
      <h4>最佳匹配</h4>
      <div className="matched-singer">
        <img className="singer-img" src={props.imgUrl}></img>
        <p>歌手:&nbsp;&nbsp;{props.singer}</p>
        {props.alia ? <p>({props.alia})</p> : ""}
        <span className={"iconfont"}>&#xe667;</span>
      </div>
    </div>
  );
}

function SearchRes(props: ISearchResProps) {
  const [type, setType] = useState(props.type ? props.type : 1);
  const [limit, setLimit] = useState(props.limit ? props.limit : 30);
  const [offset, setOffset] = useState(props.offset ? props.offset : 0);
  const [data, setData] = useState<ISearchSongsProps>();
  useEffect(() => {
    const data = getSearchData({
      host: "http://localhost:3001",
      url: "/search",
      param: {
        keywords: props.keywords,
        limit: limit,
        type: type,
        offset: offset,
      },
    });
    data.then((data) => {
      setData(data.result);
      // console.log(data.result.songCount);
    });
  }, [type]);

  return (
    <div className="search-page">
      <h2>找到&nbsp;{data?.songCount ? data.songCount : 0}&nbsp;首单曲</h2>
      <SelectedPage.Provider value={{ type: type, setType: setType }}>
        <SearchNav />
      </SelectedPage.Provider>
      <BestMatched
        imgUrl={
          "https://p2.music.126.net/EawqbkXCxGmxZ6nnqTKxKw==/109951165566992331.jpg"
        }
        singer={"Beyond"}
        alia={"超越"}
      />
      <SearchSongs
        value={props.keywords}
        type={type}
        songCount={data?.songCount ? data.songCount : 0}
        songs={data?.songs ? data?.songs : []}
      />
    </div>
  );
}

export default SearchRes;
