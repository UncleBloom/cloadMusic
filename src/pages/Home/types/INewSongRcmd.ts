import IArtist from "../../../api/types/artist";
import IAlbumInfo from "../../../api/types/albumInfo";
export interface INewSongRcmdInfo {
  name: string;
  id: number;
  alias: string[];
  artists: IArtist[];
  album: IAlbumInfo;
  duration: number;
}
export interface INewSongRcmdItem {
  id: number;
  name: string;
  picUrl: string;
  song: INewSongRcmdInfo;
}

export const LoadingSongInfo: INewSongRcmdItem = {
  id: 0,
  name: "Loading...",
  picUrl: "",
  song: {
    name: "Loading...",
    id: 0,
    alias: [""],
    duration: 0,
    album: {
      id: 0,
      name: "",
      picUrl: "",
    },
    artists: [
      {
        id: 0,
        name: "Loading",
      },
    ],
  },
};

export default interface INewSongRcmdResponse {
  result: INewSongRcmdItem[];
}
