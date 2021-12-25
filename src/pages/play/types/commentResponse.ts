import IComment from "./comment";
export default interface ICommentResponse {
    hotComments: IComment[]; // 热门评论
    comments: IComment[]; // 最新评论
    total: number; // 评论总数
}
