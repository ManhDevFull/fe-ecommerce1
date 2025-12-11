"use client";
import handleAPI from "@/axios/handleAPI";
import Description from "@/components/templates/Detail/Description";
import Information from "@/components/templates/Detail/Information";
import Media from "@/components/templates/Detail/media";
import HamsterWheel from "@/components/ui/HamsterWheel";
import { ProductUi } from "@/types/type";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import Skeleton from "@/components/ui/Skeleton";
import { PiCopy, PiHandbagSimple, PiShoppingCartSimpleLight } from "react-icons/pi";
import { FaFacebook, FaPinterestP, FaRegHeart, FaTwitter } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";
import BtnGetDeal from "@/components/ui/BtnGetDeal";
import { useWishlist } from "@/hooks/useWishlist";
import { toast } from "sonner";
import { addToCart } from "@/axios/cart";
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
                // const res = await axios(`${restApiBase}product/detail-product/${id}`);
                const res = await handleAPI(`Product/detail-product/${id}`) as unknown as ProductUi;
                setProduct(res);
                console.log('res: ', res);
                setProduct(res);
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
    const { has, toggle, loading: wishlistLoading } = useWishlist();

    const isInWishlist = product ? has(product.id) : false;

    const handleAddToCart = async (variantId: number, quantity: number) => {
        try {
            await addToCart(variantId, quantity);
            toast.success("Added to cart");
            // TODO: nếu muốn chuyển sang giỏ: router.push("/my-cart");
        } catch (e: any) {
            toast.error(e?.message || "Add to cart failed");
        }
    };

    const handleToggleWishlist = async () => {
        if (!product) return;
        try {
            await toggle(product.id);
        } catch (e: any) {
            toast.error(e?.message || "Wishlist action failed");
        }
    };
    return (
        isLoading ? (
            // <div className="flex items-center justify-center"><HamsterWheel /></div>
            <div className="w-full flex justify-center items-center">
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
                        <Skeleton type="title" />
                        <Skeleton type="title" className="text-[20px] text-[#5F6C72]" />
                    </div>
                    {/* name */}
                    <div className="pt-[8px]">
                        <Skeleton type="title" className="text-[30px] text-[#191C1F]" />
                    </div>
                    {/* sku brand cate stock */}
                    <div className="flex justify-between items-center">
                        <div>
                            <Skeleton type="title" className="text-[20px] text-[#5F6C72]" />
                            <div className="flex items-center gap-1">
                                <Skeleton type="title" className="text-[20px] text-[#5F6C72]" />
                                <Skeleton type="title" className="text-[20px] text-[#191C1F]" />
                            </div>
                        </div>
                        <div>
                            <div className="flex gap-2">
                                <Skeleton type="title" className="text-[20px] text-[#5F6C72]" />
                                <Skeleton type="title" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton type="title" />
                                <Skeleton type="title" className="text-[20px] text-[#191C1F]" />
                            </div>
                        </div>
                    </div>

                    {/* price and quantity*/}
                    <div className="pt-8 flex justify-between items-center">
                        {/* price */}
                        <div className="">
                            <div>
                                <Skeleton type="title" className="text-[30px] text-[#2EB100]" />

                                <Skeleton type="title" className="line-through decoration-gray-500" />

                                <Skeleton type="title" className="text-[20px] text-[#191C1F] text-center p-2" />
                            </div>
                        </div>
                        {/* quantity */}
                        <div>
                            <Skeleton type="title" />
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
                                <Skeleton type="title" className="text-[#000000] flex flex-nowrap" />
                                <Skeleton type="title" className="font-bold" />
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <Skeleton type="title" />
                                <Skeleton type="title" className="font-bold" />
                            </div>
                        </div>
                        <div className="">
                            <div className="flex justify-between gap-2 items-center py-2">
                                <Skeleton type="title" />

                            </div>
                            <div className="flex justify-between gap-10 items-center py-2">
                                <Skeleton type="title" />
                                <Skeleton type="img" height={40} width={74} />
                            </div>
                        </div>
                    </div>
                    {/* thanh flash deal */}
                    <div>
                        {
                            <Skeleton type="img" width={100} height={20} />
                        }
                    </div>
                    {/* khu vực button  */}
                    <div className={`p-4 flex items-center justify-center gap-20'}`}>
                        {
                            <Skeleton type="img" width={60} height={30} rounded="lg" />
                        }
                        {/* nút add card */}
                        <Skeleton type="img" width={100} height={30} rounded="lg" />
                        {/* nút buy */}
                        <Skeleton type="img" width={100} height={30} rounded="lg" />
                    </div>
                    {/* khu vực wish list, compare, share product */}
                    <div className="flex justify-between">
                        {/* wish list and compare  */}
                        <div className="flex gap-4 items-center">
                            <div className="flex items-center gap-2 cursor-pointer">
                                <Skeleton height={30} width={30} type="img" />
                                <Skeleton type="title" className="text-center text-[#475156]" />
                            </div>
                            <div className="flex gap-2 items-center cursor-pointer">
                                <Skeleton height={30} width={30} type="img" />
                                <Skeleton type="title" className="text-center text-[#475156]" />
                            </div>
                        </div>
                        {/* share */}
                        <div className="flex gap-2">
                            <Skeleton height={30} width={30} type="img" />
                            <Skeleton height={30} width={30} type="img" />
                            <Skeleton height={30} width={30} type="img" />
                            <Skeleton height={30} width={30} type="img" />
                            <Skeleton height={30} width={30} type="img" />
                        </div>
                    </div>
                    {/* khu vực checkout */}
                    <div className="border-[1px] border-[#E4E7E9] p-4 mt-8">
                        <Skeleton type="title" className="text-center text-[#475156]" />
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
                                <Information
                                    product={product}
                                    isInWishlist={isInWishlist}
                                    onToggleWishlist={handleToggleWishlist}
                                    wishlistLoading={wishlistLoading}
                                    onAddToCart={handleAddToCart}
                                />
                            </div>
                            <Description product={product} />
                        </>
                    )

                }
            </div>)
    )
}
