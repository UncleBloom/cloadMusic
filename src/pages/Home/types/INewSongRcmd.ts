import ISongInfo from "../../../api/types/songInfo";

interface INewSongRcmdInfo {
  song: ISongInfo;
}

export const LoadingSongInfo: ISongInfo = {
  name: "Loading...",
  id: 0,
  dt: 0,
  al: {
    id: 0,
    name: "",
    picUrl: "",
  },
  ar: [
    {
      id: 0,
      name: "Loading",
    },
  ],
};

export default interface INewSongRcmdResponse {
  result: INewSongRcmdInfo[];
}
