import React, {useEffect, useRef, useState} from 'react';
import {Carousel} from 'antd';
import IBannerResponse, {IBannerInfo, LoadingBannerInfo} from '../../types/IBannerResponse'
import axios from 'axios'
import serverHost from '../../../../api/serverHost'
import {CarouselRef} from 'antd/lib/carousel';
import "./Banners.scss";

function Banner() {
  const [bannerContent, setBannerContent] = useState<IBannerInfo[]>([LoadingBannerInfo]);
  const carousel = useRef<CarouselRef>(null);

  /**
   * 在组件挂载时获取首页 banner
   */
  useEffect(() => {
    const getBanners = async (): Promise<IBannerResponse> => {
      const data = await axios.get(serverHost + "/banner");
      return data.data;
    }
    getBanners().then((Response) => {
      setBannerContent(Response.banners);
    });
  }, []);

  return (
    <div className="banners">
      <Carousel autoplay autoplaySpeed={5000} ref={carousel}>
        {bannerContent.map((value, index) => {
          return (
            <div className="bannerContent">
              <div className="bannerImage">
                <img src={value.imageUrl} alt="" loading={'lazy'}/>
              </div>
            </div>)
        })}
      </Carousel>
    </div>
  )

}

export default Banner;