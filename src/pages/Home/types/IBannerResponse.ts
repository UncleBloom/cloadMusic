export interface IBannerInfo {
  imageUrl: string;
  typeTitle: string;
}

export const LoadingBannerInfo: IBannerInfo = {
  imageUrl: "",
  typeTitle: "Loading",
}

export default interface IBannerResponse {
  banners: IBannerInfo[];
}