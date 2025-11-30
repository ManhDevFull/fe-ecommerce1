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
        <div className="w-full">

            {/* Main Slider */}
            <div className="relative w-[500px] h-auto flex items-center pt-[20px]">
                <Swiper
                    spaceBetween={10}
                    thumbs={{ swiper: thumbsSwiper }}
                    navigation={true}      // 👈 bật Next/Prev
                    modules={[Thumbs, Navigation]}
                    className="h-full"
                >
                    {images.map((img) => (
                        <SwiperSlide key={img} className="">
                            <div className="flex justify-center">
                                <img src={img} className="w-[250px] h-[300px] object-cover rounded-xl" />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            {/* Thumbnail */}
            <div className="flex items-center justify-center">
                <Swiper
                    onSwiper={setThumbsSwiper}
                    direction="horizontal"
                    slidesPerView={4}
                    spaceBetween={-100}
                    watchSlidesProgress
                    className="w-full h-[400px] mt-10 flex justify-center"
                    modules={[Thumbs]}
                >
                    {images.map((img) => (
                        <SwiperSlide key={img}>
                            <div className="border-[2px] w-[120px] h-[120px] rounded-[4px] border-[#E4E7E9] p-2 flex items-center justify-center hover:border-[#313131]">
                                <img src={img} className="w-[80px] h-[100px] object-cover cursor-pointer rounded" />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}
