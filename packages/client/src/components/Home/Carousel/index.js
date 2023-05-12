import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper';
import { v4 as uuidv4 } from 'uuid';
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';

//styles
import CarouselStyles from './Carousel.module.scss';
import './Carousel.scss';

SwiperCore.use([Navigation, Pagination, Autoplay]);

const Carousel = () => {

    const [banners, setBanners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        let mounted = true

        Axios.get('api/carousell-banner')
            .then(res => res.data)
            .then(data => {
                if(mounted){
                    if (!data.error) {
                        setBanners(data.banners);
                    } else {
                        console.log(data.error);
                    }
                    setIsLoading(false);
                }
            })
            .catch(err => {
                console.log(err);
                if(mounted){
                    setIsLoading(false);
                }
            })

        return () => {
            mounted = false;
        }
    }, [])

    return (
        <div>
            {isLoading ? <div className={CarouselStyles.skeletonContainer}>
                <div className={CarouselStyles.leftSkeleton}></div>
                <div className={CarouselStyles.centerSkeleton}></div>
                <div className={CarouselStyles.rightSkeleton}></div>
            </div> : (banners?.length > 0 ? <Swiper
            spaceBetween={50}
            slidesPerView={1}
            autoplay = {{
                delay: 5000,
                disableOnInteraction: false
            }}
            navigation={banners?.length > 1}
            centeredSlides={true}
            pagination={{
                clickable: true,
                bulletClass: `${CarouselStyles.bullet}`,
                bulletActiveClass: `${CarouselStyles.activeBullet}`,
                bulletElement: 'div',
            }}
            loop={banners?.length > 1 ? true : false}
            initialSlide={0}
            breakpoints={{
                992: {
                    slidesPerView: 1.5
                }
            }}
            className={CarouselStyles.swiper}
        >
            {banners?.map(banner => {
                return <SwiperSlide className={CarouselStyles.slide} key={uuidv4()}>{({isActive}) => (
                    banner.linked_url ? <a href={banner.linked_url}><img src={banner.image_url} className={isActive ? CarouselStyles.activeSlide : CarouselStyles.notActiveSlide} alt={`MeLearn.guru Home Banner images`}/></a> :
                    <img src={banner.image_url} className={isActive ? CarouselStyles.activeSlide : CarouselStyles.notActiveSlide} alt={`MeLearn.guru Home Banner images`}/>
                )}</SwiperSlide>
            })}

        </Swiper> : null)}

        </div>
    )
}

export default Carousel
