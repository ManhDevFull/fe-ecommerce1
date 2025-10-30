import { ProductUi, timeUnit, valueFilter } from "@/types/type";
import FlashDealBar from "./FlashDealBar";
import ImgProduct from "./ImgProduct";
import { Review } from "./Review";
import BtnBuyNow from "./BtnBuyNow";
import BtnGetDeal from "./BtnGetDeal";
type productProps = {
    product: ProductUi;
    selectedFilter: valueFilter;
}
export default function Product({ product, selectedFilter }: productProps) {
    // tìm ra varaint ở sản phẩm khớp với khi mình chọn 
    var matchedVariant = product.variant.find(v => { // trả về v nếu callback trả về true
        // chuyển oject thành mảng chứa các cặp key, value
        // duyệt qua các cặp key, value
        return Object.entries(selectedFilter).every(([key, value]) => { //every trả về kết quả trong hàm (true hoặc false)
            return value.includes(v.valuevariant[key]); // nếu mọi key và value đều khớp thì trả vể true, ngược lại thì false
        })// chỉ 1 cái false thì kết quả là false
    }) || product.variant[0]; // nếu không có varaint nào khớp thì tự động chọn cái đầu tiên
    var variant = matchedVariant;
    var discount = matchedVariant?.discounts[0];
    var pareEndtime = discount?.endtime ? new Date(discount.endtime) : undefined;
    return (
        <div className="w-full">
            <ImgProduct img={product.imgUrls[0]} isNew={false} />
            {
                pareEndtime && pareEndtime && <FlashDealBar endTime={pareEndtime}></FlashDealBar>
            }
            <p className="text-[20px]">{product.name}</p>
            <Review ratingReviews={product.rating} totalReviews={product.order} />
            <div className="py-2">
                <BtnGetDeal discount={discount?.discount ?? 0} />
            </div>
            <BtnBuyNow price={variant.price ?? 0} />
        </div>
    )
}