import { ProductUi } from "@/types/type";
import { useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

export default function Media({ product }: { product: ProductUi }) {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const images = product.imgUrls;
    return (
        // sử dụng thư viện swiper
        <div className="">

            {/* Main Slider */}
            <div className="relative w-[500px] h-[500px]">
                <Swiper
                    spaceBetween={10}
                    thumbs={{ swiper: thumbsSwiper }}
                    navigation={true}      // 👈 bật Next/Prev
                    modules={[Thumbs, Navigation]}
                    className="h-full"
                >
                    {images.map((img) => (
                        <SwiperSlide key={img}>
                            <img src={img} className="w-full h-full object-cover rounded-xl" />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            {/* Thumbnail */}
            <Swiper
                onSwiper={setThumbsSwiper}
                direction="horizontal"
                slidesPerView={4}
                spaceBetween={10}
                watchSlidesProgress
                className="w-full h-[500px] mt-10"
                modules={[Thumbs]}
            >
                {images.map((img) => (
                    <SwiperSlide key={img}>
                        <img src={img} className="w-full h-24 object-cover cursor-pointer rounded" />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}
