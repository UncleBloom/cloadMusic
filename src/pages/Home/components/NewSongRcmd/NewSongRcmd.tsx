import { useState, useEffect } from "react";
import ISongInfo from "../../../../api/types/songInfo";
import { LoadingSongInfo } from "../../types/INewSongRcmd";
import INewSongRcmdResponse from "../../types/INewSongRcmd";
import axios from "axios";
import serverHost from "../../../../api/serverHost";

function NewSongRcmd() {
  const [newSongItems, setNewSongItems] = useState<ISongInfo[]>(
    new Array<ISongInfo>(10).fill(LoadingSongInfo)
  );

  useEffect(() => {
    const getItems = async (): Promise<INewSongRcmdResponse> => {
      const data = await axios.get(serverHost + "/personalized");
      return data.data;
    };

    getItems().then((Response) => {
      setNewSongItems(
        Response.result.map((value) => {
          return value.song;
        })
      );
    });
  }, []);

  return (
    <div className="NewSongRcmd">
      {newSongItems.map((value, index) => {
        return (
          <div className="NewSongItem" key={index}>
            <div className="SongPic">
              <img src={value.al.picUrl} alt="" loading="lazy" />
            </div>
            <div className="SongInfo">
              <div className="SongName"></div>
              <div className="ArtistName">
                {formatArtistsName(value.ar.map((value) => value.name))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatArtistsName(names: string[]): string {
  return names.reduce((pre, cur) => {
    return pre + "/" + cur;
  });
}
export default NewSongRcmd;
