import { useState, useEffect } from "react";
import { LoadingSongInfo, INewSongRcmdItem } from "../../types/INewSongRcmd";
import INewSongRcmdResponse from "../../types/INewSongRcmd";
import axios from "axios";
import serverHost from "../../../../api/serverHost";
import "./NewSongRcmd.scss";

function NewSongRcmd() {
  const [newSongItems, setNewSongItems] = useState<INewSongRcmdItem[]>(
    new Array<INewSongRcmdItem>(10).fill(LoadingSongInfo)
  );

  useEffect(() => {
    const getItems = async (): Promise<INewSongRcmdResponse> => {
      const data = await axios.get(serverHost + "/personalized/newsong", {
        params: {
          limit: 10,
        },
      });
      return data.data;
    };

    getItems().then((Response) => {
      setNewSongItems(Response.result);
    });
  }, []);

  return (
    <div className="NewSongRcmd">
      {newSongItems.map((value, index) => {
        return (
          <div className="NewSongItem" key={index}>
            <div className="SongPic">
              <img src={value.picUrl} alt="" loading="lazy" />
              <div className="iconContainer">
                <div className="iconfont">&#xea82;</div>
              </div>
            </div>
            <div className="SongIndex">
              {index + 1 < 10
                ? "0" + (index + 1).toString()
                : (index + 1).toString()}
            </div>
            <div className="SongInfo">
              <div className="SongNameAlias">
                <div className="SongName">{value.name}</div>
                {value.song.alias.length !== 0 ? (
                  <div className="SongAlias">
                    {value.song.alias.map((value) => " " + value + " ")}
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className="ArtistName">
                {value.song.artists
                  .map((value) => value.name)
                  .reduce((pre: string, cur: string) => pre + " / " + cur)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default NewSongRcmd;
