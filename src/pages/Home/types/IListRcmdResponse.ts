interface IListRcmd {
  id: number;
  name: string;
  copywriter: string;
  picUrl: string;
  playCount: number;
}

const LoadingListRcmd: IListRcmd = {
  id: 0,
  name: "Loading...",
  copywriter: "",
  picUrl: "",
  playCount: -1,
};

export default interface IListRcmdResponse {
  result: IListRcmd[];
}

export { LoadingListRcmd };
export type { IListRcmd };
