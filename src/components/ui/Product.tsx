import { ProductUi, timeUnit, valueFilter } from "@/types/type";
import FlashDealBar from "./FlashDealBar";
import ImgProduct from "./ImgProduct";
import { Review } from "./Review";
import BtnBuyNow from "./BtnBuyNow";
import BtnGetDeal from "./BtnGetDeal";
import { CiHeart } from "react-icons/ci";
import { FiShoppingCart } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";
import { FaHeart, FaStar } from "react-icons/fa";
type productProps = {
    product: ProductUi;
    type: boolean;
    selectedFilter: valueFilter;
}
export default function Product({ product, selectedFilter, type }: productProps) {
    // tìm ra varaint ở sản phẩm khớp với khi mình chọn 
    const matchedVariant = product.variant.find(v => { // trả về v nếu callback trả về true
        // chuyển oject thành mảng chứa các cặp key, value
        // duyệt qua các cặp key, value
        return Object.entries(selectedFilter).every(([key, value]) => { //every trả về kết quả trong hàm (true hoặc false)
            return value.includes(v.valuevariant[key]); // nếu mọi key và value đều khớp thì trả vể true, ngược lại thì false
        })// chỉ 1 cái false thì kết quả là false
    }) || product.variant[0]; // nếu không có varaint nào khớp thì tự động chọn cái đầu tiên
    const variant = matchedVariant ?? { price: 0 };
    const discount = matchedVariant?.discounts.find(d => d.typediscount == 1);
    const pareEndtime = discount?.endtime ? new Date(discount.endtime) : null;
    const averageRating = product.order > 0 ? product.rating / product.order : 0;
    return (
        <div className={`${type ? 'col-span-1' : ''} xl:py-2`}>
            {type ? (
                <>
                    {/* Dạng GRID */}
                    <div className=" flex flex-col justify-between bg-white rounded-3xl p-4">
                        <div className="flex items-center p-2 bg-[#FAFAFA] rounded-3xl">
                            <ImgProduct type={type} img={product.imgUrls[0]} isNew={false} />
                        </div>
                        <div className="h-[40px] mt-2">
                            {pareEndtime && <FlashDealBar endTime={pareEndtime} />}
                        </div>
                        <p
                            className="text-[20px] text-start font-medium overflow-hidden whitespace-nowrap text-ellipsis"
                            title={product.name}
                        >
                            {product.name}
                        </p>
                        {/* <Review ratingReviews={product.rating} totalReviews={product.order} /> */}
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2 items-center">
                                <p className="text-[#5F6C72]">{averageRating}</p>
                                <FaStar className="text-[#EBC80C]" size={20} />
                            </div>
                            <p className="text-[20px] text-[#5F6C72]">{`(${product.order}) Ratings`}</p>
                        </div>
                        <div className="py-2 w-full">
                            <BtnGetDeal discount={discount?.discount ?? 0} />
                        </div>
                        <BtnBuyNow price={variant.price ?? 0} />
                    </div>
                </>
            ) : (
                /* Dạng LIST */
                <div className="flex h-[200px] items-center justify-between gap-[20px] px-[20px] rounded-3xl bg-white shadow-sm">
                    <div className="flex-shrink-0">
                        <ImgProduct type={type} img={product.imgUrls[0]} isNew={false} />
                    </div>
                    <div className="flex-1">
                        <p className="text-[20px] font-bold">{product.name}</p>
                        <p className="text-[#474747]">{product.description}</p>
                        <p className="py-[10px] text-lg font-medium">${variant.price}</p>
                        <div className="flex items-center gap-10">
                            <div className="flex gap-2 items-center">
                                <p className="text-[#5F6C72] text-[20px]">{averageRating}</p>
                                <FaStar className="text-[#EBC80C]" size={20} />
                            </div>
                            <p className="text-[20px] text-[#5F6C72]">{`(${product.order}) Ratings`}</p>
                        </div>
                        {/* <Review ratingReviews={product.rating} totalReviews={product.order} /> */}
                    </div>
                    <div className="h-full flex items-center">
                        <div className="flex flex-col gap-3">
                            <button className="w-[100px] p-2 bg-[#677685] rounded-xl hover:cursor-pointer">
                                <p className="text-[20px] text-white">Order</p>
                            </button>
                            <button className="w-[100px] p-2 bg-[#677685] rounded-xl hover:cursor-pointer">
                                <p className="text-[20px] text-white">Wishlist</p>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

}