import { Review } from "@/components/ui/Review";
import { ProductUi } from "@/types/type";

export default function Information({ product }: { product: ProductUi }) {
    return (
        <div>
            {/* review and name product */}
            <div className="flex">
                <Review ratingReviews={product.rating} totalReviews={product.order} />
                <p className="text-[20px] text-[#5F6C72]">{product.order} User feedback</p>
                <p className="text-[20px] text-[#191C1F]">{product.name}</p>
            </div>
{/* sky brand cate stock*/}
            <div>
                <div>
                    <p className="#text-[20px] text-[#5F6C72]">Sku</p>
                    <div className="flex gap-1">
                        <p className="text-[20px] text-[#5F6C72]">Brand: </p>
                        <p>{product.brand}</p>
                    </div>
                </div>
                <div>
                    <div className="flex">
                        <p className="text-[20px] text-[#5F6C72]">Availability</p>
                        <p className="text-[20px] text-[#191C1F]">{product.variant[0].stock}</p>
                    </div>
                    <div>
                        <p className="text-[20px] text-[#5F6C72]">Category</p>
                        <p className="text-[20px] text-[#191C1F]">{product.categoryName}</p>
                    </div>
                </div>
            </div>

            {/* price */}
            
        </div>
    )
}