import Product from "@/components/ui/Product";
import Quantity from "@/components/ui/Quantity";
import { Review } from "@/components/ui/Review";
import { ProductUi, VariantDTO } from "@/types/type";
import { useEffect, useState } from "react";

export default function Information({ product }: { product: ProductUi }) {
    const [quantity, setQuantity] = useState<number>(1);
    const [attribute, setAtribute] = useState({});
    // lấy ra variant
    const variant = product.variant;
    const attributeMap: Record<string, Set<string>> = {} // tạo 1 object rỗng để lưu biến thể
    const [currentValuevariant, setCurrentValuevariant] = useState<VariantDTO>(variant[0]); // cho variant mặc định ban đầu
    useEffect(() => {
        variant.forEach(v => {
            Object.entries(v.valuevariant).forEach(([key, value]) => {
                if (!attributeMap[key])
                    attributeMap[key] = new Set();
                attributeMap[key].add(value as string);
            })
        })
        // chuyể từ set về mảng
        //fromEnties: chuyển mảng [[key], [value]] => {key: [value]}
        const attributes = Object.fromEntries(
            Object.entries(attributeMap).map(([key, value]) => [[key], [...value]])
        );
        setAtribute(attributes);
    }, [currentValuevariant]);

    // hàm tìm variant trong varaints product thông qua color, storage...
    const findVariant = (value: VariantDTO) => {
        return variant.find(v => {
            Object.entries(value.valuevariant).every(([key, val]) => (
                v.valuevariant[key] === val
            ));
        })
    }
    const handleOnechangeVariant = (key: string, value: string) => {
        setCurrentValuevariant(prev => {
            const udpated = {
                [key]: value,
                ...prev
            }
            const matchVariant = findVariant(udpated);
            // nếu tìm thấy 
            if (matchVariant)
                return udpated
            // nếu không tìm thấy trả về variant mặc định 
            else
                return variant[0];
        });
    }
    // tìm discount còn có hạn sử dụng 
    const getValidDiscount = (variant: VariantDTO) => {
        const now = new Date();

        if (!variant.discounts || variant.discounts.length === 0)
            return null;

        // tìm discount có hiệu lực, trả về phần tử đầu tiên tìm thấy 
        const active = variant.discounts.find(d => {
            const start = new Date(d.starttime);
            const end = new Date(d.endtime);

            return start <= now && now <= end;
        });

        return active ?? null;
    };
    const discount = getValidDiscount(currentValuevariant);
    return (
        <div>
            {/* review and name product */}
            <div className="flex">
                <Review ratingReviews={product.rating} totalReviews={product.order} />
                <p className="text-[20px] text-[#5F6C72]">{product.order} User feedback</p>
                <p className="text-[20px] text-[#191C1F]">{product.name}</p>
            </div>

            {/* sku brand cate stock */}
            <div>
                <div>
                    <p className="text-[20px] text-[#5F6C72]">Sku</p>
                    <div className="flex gap-1">
                        <p className="text-[20px] text-[#5F6C72]">Brand: </p>
                        <p>{product.brand}</p>
                    </div>
                </div>

                <div>
                    <div className="flex">
                        <p className="text-[20px] text-[#5F6C72]">Availability</p>
                        {currentValuevariant.stock > 0 ? (
                            <p className="text-[20px] text-[#2DB224]">{currentValuevariant.stock}</p>
                        ) : (<p className="text-[20px] text-red-500">Out of stock</p>)
                        }
                    </div>
                    <div>
                        <p className="text-[20px] text-[#5F6C72]">Category</p>
                        <p className="text-[20px] text-[#191C1F]">{product.categoryName}</p>
                    </div>
                </div>
            </div>

            {/* price and quantity*/}
            <div>
                {/* price */}
                <div>
                    {discount && discount.typediscount == 1 ? (
                        <div>
                            <p className="text-[20px] text-[#2EB100]">
                                {currentValuevariant.price -
                                    currentValuevariant.price * (discount?.discount / 100)}
                            </p>

                            <p className="line-through decoration-gray-500">
                                {currentValuevariant.price} VND
                            </p>

                            <p className="text-[20px] text-[#191C1F] text-center p-2">
                                {discount?.discount} %
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-[20px] text-[#2EB100]">
                                {currentValuevariant.price}
                            </p>
                        </div>
                    )}
                </div>
                {/* quantity */}
                <div>
                    <Quantity onchange={(value: number) => setQuantity(value)} />
                </div>
            </div>
        </div>
    )
}
