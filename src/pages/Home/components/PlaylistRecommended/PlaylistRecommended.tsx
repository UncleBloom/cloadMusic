import { useEffect, useState } from "react";
import IListRcmdResponse, {
  IListRcmd,
  LoadingListRcmd,
} from "../../types/IListRcmdResponse";
import axios from "axios";
import serverHost from "../../../../api/serverHost";
import "./PlaylistRecommended.scss";

interface IPlaylistRcmdParams {
  resetPlaylistBySongList: (id: number) => void;
}

function PlaylistRecommended(params: IPlaylistRcmdParams) {
  const [listItems, setListItems] = useState<IListRcmd[]>(
    new Array<IListRcmd>(10).fill(LoadingListRcmd)
  );

  useEffect(() => {
    const getItems = async (): Promise<IListRcmdResponse> => {
      const data = await axios.get(serverHost + "/personalized", {
        params: {
          limit: 10,
        },
      });
      return data.data;
    };

    getItems().then((Response) => {
      setListItems(Response.result);
    });
  }, []);

  return (
    <div className="PlaylistRecommended">
      {listItems.map((value, index) => {
        return (
          <div className="listItem" key={index}>
            <div className="listPic">
              <img
                src={value.picUrl + "?param=200y200"}
                alt={""}
                loading={"lazy"}
              />
              <div className="playCount">
                {formatPlayCount(value.playCount)}
              </div>
              <div
                className="iconContainer"
                onClick={() => {
                  params.resetPlaylistBySongList(value.id);
                }}
              >
                <div className="iconfont">&#xea82;</div>
              </div>
            </div>
            <div className="listName">{value.name}</div>
          </div>
        );
      })}
    </div>
  );
}

export default PlaylistRecommended;

/**
 * 将 number 类型播放量格式化为 string
 * @param value 播放量
 */
function formatPlayCount(value: number): string {
  if (value === -1) {
    return "";
  } else if (value < 10000) {
    return value.toString();
  } else {
    let count: number = Math.floor(value / 1000);
    return `${count / 10}万`;
  }
}
