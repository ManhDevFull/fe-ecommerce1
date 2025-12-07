"use client";
import handleAPI from "@/axios/handleAPI";
import Description from "@/components/templates/Detail/Description";
import Information from "@/components/templates/Detail/Information";
import Media from "@/components/templates/Detail/media";
import HamsterWheel from "@/components/ui/HamsterWheel";
import { ProductUi } from "@/types/type"
import { restApiBase } from "@/utils/env";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react"
import { AiFillWarning } from "react-icons/ai";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import Skeleton from "@/components/ui/Skeleton";
export default function Detail() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const params = useParams();
    const id = params.id; // lấy id sản phẩm
    console.log("id: ", id);
    // gọi api để lấy danh ra sản phẩm với id tương ứng
    const [product, setProduct] = useState<ProductUi | null>(null);
    useEffect(() => {
        const fetchProduct = async () => {
            setIsLoading(true);
            try {
                // const res = await axios.get(`${restApiBase}`);
                const res = await axios(`${restApiBase}product/detail-product/${id}`);
                // const res = await handleAPI(`${restApiBase}product/detail-product/${id}`, undefined, 'get');
                console.log("product: ", res.data);
                setProduct(res.data);
            }
            catch (error: any) {
                if (error.response)
                    console.log("lỗi từ server");
                if (error.request)
                    console.log("không nhận được phản hồi từ server");
            } finally {
                setIsLoading(false);
            }
        }
        fetchProduct();
    }, [id]);
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const images = product?.imgUrls ?? [];
    return (
        isLoading ? (
            // <div className="flex items-center justify-center"><HamsterWheel /></div>
            <div>
                <div className="w-full flex justify-center">
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
                                        <Skeleton type="img" width={200} height={220} className="w-[200px] h-[220px] object-cover rounded-xl" />
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
                                        <Skeleton type="img" width={80} height={100} className="w-[80px] h-[100px] object-cover cursor-pointer rounded" />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
                {/* information */}
                <div className="w-full">
                    {/* review and name product */}
                    <div className="flex gap-4">
                        {/* <Review ratingReviews={product.rating} totalReviews={product.order} /> */}
                        <Skeleton type="title"/>
                        <Skeleton type="title" className="text-[20px] text-[#5F6C72]"/>
                    </div>
                    {/* name */}
                    <div className="pt-[8px]">
                        <Skeleton type="title" className="text-[30px] text-[#191C1F]"/>
                    </div>
                    {/* sku brand cate stock */}
                    <div className="flex justify-between items-center">
                        <div>
                            <Skeleton type="title" className="text-[20px] text-[#5F6C72]"/>
                            <div className="flex items-center gap-1">
                                <Skeleton type="title" className="text-[20px] text-[#5F6C72]"/>
                                <Skeleton type="title" className="text-[20px] text-[#191C1F]"/>
                            </div>
                        </div>
                        <div>
                            <div className="flex gap-2">
                                <Skeleton type="title" className="text-[20px] text-[#5F6C72]"/>
                                <Skeleton type="title"/>
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton type="title"/>
                                <Skeleton type="title" className="text-[20px] text-[#191C1F]"/>
                            </div>
                        </div>
                    </div>

                    {/* price and quantity*/}
                    <div className="pt-8 flex justify-between items-center">
                        {/* price */}
                        <div className="">
                                <div>
                                    <Skeleton type="title" className="text-[30px] text-[#2EB100]"/>

                                    <Skeleton type="title" className="line-through decoration-gray-500"/>

                                    <Skeleton type="title" className="text-[20px] text-[#191C1F] text-center p-2"/>
                                </div>
                        </div>
                        {/* quantity */}
                        <div>
                          <Skeleton type="title"/>
                        </div>
                    </div>
                    {/* varaint */}
                    <div className="border-t-[2px] border-b-[2px] border-[#E4E7E9] py-4 mt-4">
                        <div
                            className="grid gap-6"
                            style={{
                                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" // tự động chia cột
                            }}
                        >
                            <Skeleton type="img" width={30} height={80} />
                        </div>
                    </div>
                    {/* Deal member Filled */}
                    <div className="flex gap-30 items-center mt-2 bg-green-200 p-4">
                        <div className="">
                            <div className="flex justify-between gap-2 items-center py-2">
                                <p className="text-[#000000] flex flex-nowrap">Deal Members Filled</p>
                                <p className="font-bold">700/1000</p>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <p>Current Deal Price</p>
                                <p className="font-bold">Rs {currentValuevariant.price}</p>
                            </div>
                        </div>
                        <div className="">
                            <div className="flex justify-between gap-2 items-center py-2">
                                <p>No. Of Buyers In Deal</p>
                                <p className="font-bold">{product.order}</p>
                            </div>
                            <div className="flex justify-between gap-10 items-center py-2">
                                <p>Deal Tread Indicator</p>
                                <svg width="74" height="40" viewBox="0 0 74 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M73.6832 38.7983C73.6832 28.5083 69.8017 18.6398 62.8925 11.3638C55.9834 4.08766 46.6126 7.86025e-07 36.8416 9.15627e-09C27.0706 -7.67713e-07 17.6998 4.08766 10.7907 11.3637C3.88152 18.6398 1.52537e-06 28.5083 4.99864e-08 38.7983H9.2104C9.2104 31.0808 12.1215 23.6794 17.3034 18.2224C22.4852 12.7653 29.5133 9.69957 36.8416 9.69957C44.1698 9.69957 51.1979 12.7653 56.3798 18.2224C61.5616 23.6794 64.4728 31.0808 64.4728 38.7983H73.6832Z" fill="#7C3AED" />
                                    <path d="M18.9985 4.85398C13.2257 8.21938 8.41713 13.1557 5.07514 19.1472C1.73316 25.1387 -0.0195481 31.9655 0.000164462 38.9142L9.21052 38.8852C9.19573 33.6737 10.5103 28.5536 13.0168 24.06C15.5232 19.5664 19.1297 15.8641 23.4593 13.3401L18.9985 4.85398Z" fill="#DDD6FE" />
                                    <path d="M55.2624 5.19798C49.6757 1.80121 43.34 0.00879824 36.8891 3.23079e-05C30.4382 -0.00873362 24.0982 1.76645 18.5032 5.14803L23.0878 13.5606C27.284 11.0244 32.039 9.69302 36.8772 9.69959C41.7154 9.70617 46.4672 11.0505 50.6572 13.5981L55.2624 5.19798Z" fill="#A78BFA" />
                                    <path d="M37.5433 5.09741L39.4267 37.7167H35.66L37.5433 5.09741Z" fill="#272525" />
                                    <path d="M39.5901 36.9982C39.5901 38.1886 38.6737 39.1537 37.5433 39.1537C36.4129 39.1537 35.4966 38.1886 35.4966 36.9982C35.4966 35.8078 36.4129 34.8428 37.5433 34.8428C38.6737 34.8428 39.5901 35.8078 39.5901 36.9982Z" fill="#272525" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    {/* thanh flash deal */}
                    <div>
                        {
                            discount && (<FlashDealBar endTime={discount.endtime} />)
                        }
                    </div>
                    {/* khu vực button  */}
                    <div className={`p-4 flex items-center ${discount ? 'justify-between' : 'justify-center gap-20'}`}>
                        {
                            discount && <BtnGetDeal discount={discount.discount} />
                        }
                        {/* nút add card */}
                        <button className="w-[100px] flex gap-2 border-[2px] cursor-pointer border-[#1877F2] rounded-2xl p-2">
                            <PiShoppingCartSimpleLight className="text-[#1877F2]" size={28} />
                            <p className="text-[20px] font-medium text-[#1877F2]">ADD</p>
                        </button>
                        {/* nút buy */}
                        <button className="flex items-center justify-center cursor-pointer rounded-2xl gap-2 bg-[#1877F2] w-[100px] p-2">
                            <PiHandbagSimple className="text-[#FFFFFF]" size={28} />
                            <p className="text-[20px] font-medium text-[#FFFFFF]">BUY</p>
                        </button>
                    </div>
                    {/* khu vực wish list, compare, share product */}
                    <div className="flex justify-between">
                        {/* wish list and compare  */}
                        <div className="flex gap-4 items-center">
                            <div className="flex items-center gap-2 cursor-pointer">
                                <FaRegHeart className="text-[#475156]" size={28} />
                                <p className="text-center text-[#475156]">
                                    Add to wishlist
                                </p>
                            </div>
                            <div className="flex gap-2 items-center cursor-pointer">
                                <TfiReload size={28} />
                                <p className="text-center text-[#475156]">
                                    Add to compare
                                </p>
                            </div>
                        </div>
                        {/* share */}
                        <div className="flex gap-2">
                            <p className="text-center text-[#475156]">
                                Share product:
                            </p>
                            <PiCopy className="text-[#5F6C72] cursor-pointer" size={28} />
                            <FaFacebook className="text-[#FCBD01] cursor-pointer" size={28} />
                            <FaTwitter className="text-[#5F6C72] cursor-pointer" size={28} />
                            <FaPinterestP className="text-[#5F6C72] cursor-pointer" size={28} />
                        </div>
                    </div>
                    {/* khu vực checkout */}
                    <div className="border-[1px] border-[#E4E7E9] p-4 mt-8">
                        <p className="text-[20px] text-[#191C1F]">100% Guarantee Safe Checkout</p>
                    </div>
                </div>

            </div>
        ) : (
            <div className="px-20 pt-8">
                {
                    // media and information
                    product && (
                        <>
                            <div className="flex justify-center">
                                <Media product={product} />
                                <Information product={product} />
                            </div>
                            // Descrip tion
                            <Description product={product} />
                        </>
                    )
                }
            </div>)
    )
}