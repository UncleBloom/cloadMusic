import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./searchres.css";
import getSearchDataSong, {
  ISearchSongsProps,
} from "./component/getSearchDataSong";
import getSearchDataSinger, {
  ISearchSingersProps,
} from "./component/getSearchDataSinger";
import getSearchDataAlbum, {
  ISearchAlbumsProps,
} from "./component/getSearchDataAlbum";
import getSearchDataVideo, {
  ISearchVideosProps,
} from "./component/getSearchDataVideo";
import getSearchDataPlaylist, {
  ISearchPlaylistsProps,
} from "./component/getSearchDataPlaylist";
import getSearchDataDjRadio, {
  ISearchDjRadiosProps,
} from "./component/getSearchDataDjRadios";
import getSearchDataUser, {
  ISearchUsersProps,
} from "./component/getSearchDataUser";
import getSearchDataLyric, {
  ISearchLyricsProps,
} from "./component/getSearchDataLyric";
import { AxiosResponse } from "axios";
import SearchSongs from "./component/SearchSongs";
import SearchSingers from "./component/SearchSingers";
import SearchAlbums from "./component/SearchAlbums";
import SearchVideos from "./component/SearchVideos";
import SearchPlaylists from "./component/SearchPlaylists";
import SearchDjRadios from "./component/SearchDjRadios";
import SearchUsers from "./component/SearchUsers";
import SearchLyrics from "./component/SearchLyrics";

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
  singerImgUrl: string;
  singerName: string;
  albumImgUrl: string;
  albumName: string;
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
            className={type == 1009 ? "search-selected" : ""}
            onClick={() => {
              changeType(1009);
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
function BestMatchedSinger(props: IBestMatchedProps) {
  return (
    <div className="matched-singer">
      <img className="singer-img" src={props.singerImgUrl}></img>
      <p>歌手:&nbsp;&nbsp;{props.singerName}</p>
      {props.alia ? <p>({props.alia})</p> : ""}
      <span className={"iconfont"}>&#xe667;</span>
    </div>
  );
}

function BestMatchedAlbum(props: IBestMatchedProps) {
  return (
    <div className="matched-album">
      <img className="album-img" src={props.albumImgUrl}></img>
      <div className="album-com">
        <div className="album-com-square"></div>
        <div className="album-com-circle"></div>
      </div>
      <div className="album-msg">
        <p>专辑:&nbsp;&nbsp;{props.albumName}</p>
        <p>{props.singerName}</p>
      </div>
      <span className={"iconfont"}>&#xe667;</span>
    </div>
  );
}

function BestMatched(props: IBestMatchedProps) {
  return (
    <div className="best-matched">
      <h4>最佳匹配</h4>
      <BestMatchedSinger
        singerImgUrl={props.singerImgUrl}
        singerName={props.singerName}
        albumImgUrl={props.albumImgUrl}
        albumName={props.albumName}
        alia={props.alia}
      />
      <BestMatchedAlbum
        singerImgUrl={props.singerImgUrl}
        singerName={props.singerName}
        albumImgUrl={props.albumImgUrl}
        albumName={props.albumName}
        alia={props.alia}
      />
    </div>
  );
}

//播放全部组件
function PlayAll() {
  return (
    <div className="play-all">
      <button title="播放全部" className="play-all-btn">
        <span className="iconfont">&#xe87c;</span>
        <span>播放全部</span>
      </button>
      <button title="添加所有到播放列表中" className="add-all-to-play-btn">
        <span className="iconfont">&#xe664;</span>
      </button>
    </div>
  );
}

//下载全部组件
function DownLoadAll() {
  return (
    <div className="download-all">
      <button title="下载全部" className="download-all-btn">
        <span className="iconfont">&#xe69a;</span>
        <span>下载全部</span>
      </button>
    </div>
  );
}

function SearchRes(props: ISearchResProps) {
  const [type, setType] = useState(props.type ? props.type : 1);
  const [limit, setLimit] = useState(props.limit ? props.limit : 30);
  const [offset, setOffset] = useState(props.offset ? props.offset : 0);
  const [dataSongs, setDataSongs] = useState<ISearchSongsProps>();
  const [dataSingers, setDataSingers] = useState<ISearchSingersProps>();
  const [dataAlbums, setDataAlbums] = useState<ISearchAlbumsProps>();
  const [dataVideos, setDataVideos] = useState<ISearchVideosProps>();
  const [dataPlaylists, setDataPlaylists] = useState<ISearchPlaylistsProps>();
  const [dataDjRadios, setDataDjRadios] = useState<ISearchDjRadiosProps>();
  const [dataUsers, setDataUsers] = useState<ISearchUsersProps>();
  const [dataLyrics, setDataLyrics] = useState<ISearchLyricsProps>();

  //最佳匹配部分的状态
  const [singerName, setSingerName] = useState("");
  const [albumName, setAlbumName] = useState("");
  const [singerPicUrl, setSingerPicUrl] = useState("");
  const [albumPicUrl, setAlbumPicUrl] = useState("");
  const [singerAlia, setSingerAlia] = useState("");
  const [singerId, setSingerId] = useState(0);
  const [albumId, setAlbumId] = useState(0);

  useEffect(() => {
    if (type === 1) {
      const data = getSearchDataSong({
        host: "http://localhost:3000",
        url: "/search",
        param: {
          keywords: props.keywords,
          limit: limit,
          type: type,
          offset: offset,
        },
      });
      data.then((data) => {
        // setDataSongs(data.result);
        setAlbumId(
          data.result.songs[0].album.id ? data.result.songs[0].album.id : 0
        );
        setSingerId(
          data.result.songs[0].artists[0].id
            ? data.result.songs[0].artists[0].id
            : 0
        );
        getSearchDataSinger({
          host: "http://localhost:3000",
          url: "/search",
          param: {
            keywords: data.result.songs[0].artists[0].name
              ? data.result.songs[0].artists[0].name
              : "",
            type: 100,
          },
        }).then((data) => {
          for (let i = 0; i < 3; i++) {
            if (data.result.artists[i].id === singerId) {
              // console.log("singerId:" + singerId);
              // console.log(
              //   "data.result.artists[i].id:" + data.result.artists[i].id
              // );

              setSingerName(data.result.artists[i].name);
              setSingerPicUrl(data.result.artists[i].picUrl);
              setSingerAlia(data.result.artists[i].alias[i]);
            }
          }
        });
        getSearchDataAlbum({
          host: "http://localhost:3000",
          url: "/search",
          param: {
            keywords: data.result.songs[0].artists[0].name
              ? data.result.songs[0].artists[0].name
              : "",
            type: 10,
          },
        }).then((data) => {
          for (let i = 0; i < 3; i++) {
            // console.log(albumId);
            // console.log(data.result.albums[0].id);

            if (data.result.albums[i].id === albumId) {
              setAlbumName(data.result.albums[i].name);
              setAlbumPicUrl(data.result.albums[i].picUrl);
            }
          }
        });
      });
    }
  });

  useEffect(() => {
    if (type === 1) {
      const data = getSearchDataSong({
        host: "http://localhost:3000",
        url: "/search",
        param: {
          keywords: props.keywords,
          limit: limit,
          type: type,
          offset: offset,
        },
      });
      data.then((data) => {
        setDataSongs(data.result);
        // console.log(data.result.songCount);
      });
    } else if (type === 100) {
      const data = getSearchDataSinger({
        host: "http://localhost:3000",
        url: "/search",
        param: {
          keywords: props.keywords,
          limit: limit,
          type: type,
          offset: offset,
        },
      });
      data.then((data) => {
        setDataSingers(data.result);
        // console.log(data.result);
      });
    } else if (type === 10) {
      const data = getSearchDataAlbum({
        host: "http://localhost:3000",
        url: "/search",
        param: {
          keywords: props.keywords,
          limit: limit,
          type: type,
          offset: offset,
        },
      });
      data.then((data) => {
        setDataAlbums(data.result);
        // console.log(data.result);
      });
    } else if (type === 1014) {
      const data = getSearchDataVideo({
        host: "http://localhost:3000",
        url: "/search",
        param: {
          keywords: props.keywords,
          limit: limit,
          type: type,
          offset: offset,
        },
      });
      data.then((data) => {
        setDataVideos(data.result);
        // console.log(data.result);
      });
    } else if (type === 1000) {
      const data = getSearchDataPlaylist({
        host: "http://localhost:3000",
        url: "/search",
        param: {
          keywords: props.keywords,
          limit: limit,
          type: type,
          offset: offset,
        },
      });
      data.then((data) => {
        setDataPlaylists(data.result);
        // console.log(data.result);
      });
    } else if (type === 1009) {
      const data = getSearchDataDjRadio({
        host: "http://localhost:3000",
        url: "/search",
        param: {
          keywords: props.keywords,
          limit: limit,
          type: type,
          offset: offset,
        },
      });
      data.then((data) => {
        setDataDjRadios(data.result);
        // console.log(data.result);
      });
    } else if (type === 1002) {
      const data = getSearchDataUser({
        host: "http://localhost:3000",
        url: "/search",
        param: {
          keywords: props.keywords,
          limit: limit,
          type: type,
          offset: offset,
        },
      });
      data.then((data) => {
        setDataUsers(data.result);
        // console.log(data.result);
      });
    } else if (type === 1006) {
      const data = getSearchDataLyric({
        host: "http://localhost:3000",
        url: "/search",
        param: {
          keywords: props.keywords,
          limit: limit,
          type: type,
          offset: offset,
        },
      });
      data.then((data) => {
        setDataLyrics(data.result);
        // console.log(data.result);
      });
    }
  }, [type, offset]);

  return (
    <div className="search-page">
      {/* 根据type显示不同的h2 */}
      {type === 1 ? (
        <>
          <h2>
            找到&nbsp;{dataSongs?.songCount ? dataSongs.songCount : 0}
            &nbsp;首单曲
          </h2>
        </>
      ) : type === 10 ? (
        <>
          <h2>
            找到&nbsp;{dataAlbums?.albumCount ? dataAlbums?.albumCount : 0}
            &nbsp;张专辑
          </h2>
        </>
      ) : type === 100 ? (
        <>
          <h2>
            找到&nbsp;{dataSingers?.artistCount ? dataSingers.artistCount : 0}
            &nbsp;位歌手
          </h2>
        </>
      ) : type === 1000 ? (
        <>
          <h2>
            找到&nbsp;
            {dataPlaylists?.playlistCount ? dataPlaylists?.playlistCount : 0}
            &nbsp;个歌单
          </h2>
        </>
      ) : type === 1014 ? (
        <>
          <h2>
            找到&nbsp;{dataVideos?.videoCount ? dataVideos?.videoCount : 0}
            &nbsp;个视频
          </h2>
        </>
      ) : type === 1006 ? (
        <>
          <h2>
            找到&nbsp;{dataLyrics?.songCount ? dataLyrics?.songCount : 0}
            &nbsp;首歌词
          </h2>
        </>
      ) : type === 1002 ? (
        <>
          <h2>
            找到&nbsp;
            {dataUsers?.userprofileCount ? dataUsers?.userprofileCount : 0}
            &nbsp;位用户
          </h2>
        </>
      ) : type === 1009 ? (
        <>
          <h2>
            找到&nbsp;
            {dataDjRadios?.djRadiosCount ? dataDjRadios?.djRadiosCount : 0}
            &nbsp;个播客
          </h2>
        </>
      ) : (
        ""
      )}
      <SelectedPage.Provider value={{ type: type, setType: setType }}>
        <SearchNav />
      </SelectedPage.Provider>
      {type === 1 ? (
        <>
          <BestMatched
            singerImgUrl={singerPicUrl}
            singerName={singerName}
            albumImgUrl={albumPicUrl}
            albumName={albumName}
            alia={singerAlia}
          />
          <div className="play-download-all">
            <PlayAll />
            <DownLoadAll />
          </div>
          <SearchSongs
            value={props.keywords}
            type={type}
            songCount={dataSongs?.songCount ? dataSongs.songCount : 0}
            songs={dataSongs?.songs ? dataSongs?.songs : []}
          />
        </>
      ) : type === 100 ? (
        <>
          <SearchSingers
            value={props.keywords}
            type={type}
            artistCount={dataSingers?.artistCount ? dataSingers.artistCount : 0}
            artists={dataSingers?.artists ? dataSingers.artists : []}
          />
        </>
      ) : type === 10 ? (
        <>
          <SearchAlbums
            value={props.keywords}
            type={type}
            albumCount={dataAlbums?.albumCount ? dataAlbums.albumCount : 0}
            albums={dataAlbums?.albums ? dataAlbums.albums : []}
          />
        </>
      ) : type === 1014 ? (
        <>
          <SearchVideos
            value={props.keywords}
            type={type}
            videoCount={dataVideos?.videoCount ? dataVideos?.videoCount : 0}
            videos={dataVideos?.videos ? dataVideos?.videos : []}
          />
        </>
      ) : type === 1000 ? (
        <>
          <SearchPlaylists
            value={props.keywords}
            type={type}
            playlistCount={
              dataPlaylists?.playlistCount ? dataPlaylists?.playlistCount : 0
            }
            playlists={dataPlaylists?.playlists ? dataPlaylists?.playlists : []}
          />
        </>
      ) : type === 1009 ? (
        <>
          <SearchDjRadios
            value={props.keywords}
            type={type}
            djRadiosCount={
              dataDjRadios?.djRadiosCount ? dataDjRadios?.djRadiosCount : 0
            }
            djRadios={dataDjRadios?.djRadios ? dataDjRadios.djRadios : []}
          />
        </>
      ) : type === 1002 ? (
        <>
          <SearchUsers
            value={props.keywords}
            type={type}
            userprofileCount={
              dataUsers?.userprofileCount ? dataUsers?.userprofileCount : 0
            }
            userprofiles={
              dataUsers?.userprofiles ? dataUsers?.userprofiles : []
            }
          />
        </>
      ) : type === 1006 ? (
        <>
          <SearchLyrics
            value={props.keywords}
            type={type}
            songCount={dataLyrics?.songCount ? dataLyrics?.songCount : 0}
            songs={dataLyrics?.songs ? dataLyrics?.songs : []}
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default SearchRes;
