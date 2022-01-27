import IUser from "./user";

export default interface IComment {
  user: IUser;
  beReplied: {
    user: IUser;
    content: string;
  }[]; // 回复评论列表
  content: string; // 内容
  likedCount: number; // 点赞数
  time: number; // Unix 时间戳
  commentId: number;
}
