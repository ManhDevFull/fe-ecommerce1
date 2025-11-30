import BtnGetDeal from "@/components/ui/BtnGetDeal";
import Dropdown from "@/components/ui/Dropdown";
import FlashDealBar from "@/components/ui/FlashDealBar";
import Product from "@/components/ui/Product";
import Quantity from "@/components/ui/Quantity";
import { Review } from "@/components/ui/Review";
import { ProductUi, VariantDTO } from "@/types/type";
import { useEffect, useState } from "react";
import { FaFacebook, FaPinterestP, FaRegHeart, FaTwitter } from "react-icons/fa";
import { IoLogoFacebook } from "react-icons/io";
import { PiCopy, PiHandbagSimple, PiShoppingCartSimpleLight } from "react-icons/pi";
import { TfiReload } from "react-icons/tfi";

export default function Information({ product }: { product: ProductUi }) {
    const [quantity, setQuantity] = useState<number>(1);
    console.log(quantity);
    const [attribute, setAtribute] = useState<Record<string, string[]>>({});
    // lấy ra variant
    const variant = product.variant;
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
        variant[0].valuevariant
    );
    const [currentValuevariant, setCurrentValuevariant] = useState<VariantDTO>(variant[0]); // cho variant mặc định ban đầu
    // hàm kiểm tra cho selectionOption. nếu selectionOption không có đẩy đủ các key và value như atribute
    //=> khi render sẽ bị undefine vd: atribite có ssd, ram, storage nhưng selectionOption chỉ có ssd
    // => active [ram] sẽ không có key là ram ở selectOption
    const fillMissingSelectedOptions =
        (attribute: Record<string, string[]>, selectedOptions: Record<string, string>) => {
            const filled: Record<string, string> = { ...selectedOptions } // lấy ra các thuộc tính từ selectedOptions
            Object.entries(attribute).forEach(([key, value]) => {
                if (!filled[key])
                    filled[key] = value[0]; // với key không có thì tạo key mới với value mặc định là 0 
            })
            return filled; // lúc này đã đầy đủ các key, value như attribute
        }
    useEffect(() => {
        const attributeMap: Record<string, Set<string>> = {} // tạo 1 object rỗng để lưu biến thể
        variant.forEach(v => {
            Object.entries(v.valuevariant).forEach(([key, value]) => {
                if (!attributeMap[key])
                    attributeMap[key] = new Set(); // dùng set để loại bỏ các valude trùng lặp
                attributeMap[key].add(value as string);
            })
        })
        // chuyể từ set về mảng
        //fromEnties: chuyển mảng [[key], [value]] => {key: [value]}
        const attributes = Object.fromEntries(
            Object.entries(attributeMap).map(([key, value]) => [key, [...value]])
        );
        setAtribute(attributes);
        setSelectedOptions(prev => fillMissingSelectedOptions(attributes, prev));
    }, []);
    console.log('atrribut: ', attribute);
    // hàm tìm variant trong varaints product thông qua color, storage...
    const findVariant = (value: VariantDTO) => {
        return variant.find(v => (
            Object.entries(value.valuevariant).every(([key, val]) => (
                v.valuevariant[key] === val
            ))
        ));
    }
    const handleOnechangeVariant = (key: string, value: string) => {
        // luôn chuyển UI theo lựa chọn
        const newSelected = {
            ...selectedOptions,
            [key]: value
        };
        setSelectedOptions(newSelected);

        // tìm variant thật
        const match = variant.find(v =>
            Object.entries(newSelected).every(([k, val]) => v.valuevariant[k] === val)
        );

        // nếu có variant thật → đổi giá
        if (match) {
            setCurrentValuevariant({ ...match });
            // ...match để lấy ra các atribute. {...match} tạo ra object mới nên render lại giao diện
            // nếu set thẳng match thì khi click trùng nó không render lại
            // set lại value thật để gửi về backend và render lại giá tương ứng
        }

        // nếu không có variant → KHÔNG đổi giá nhưng vẫn update dropdown
    };

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
        <div className="w-full">
            {/* review and name product */}
            <div className="flex gap-4">
                <Review ratingReviews={product.rating} totalReviews={product.order} />
                <p className="text-[20px] text-[#5F6C72]">({product.order} User feedback)</p>
            </div>
            {/* name */}
            <div className="pt-[8px]">
                <p className="text-[30px] text-[#191C1F]">{product.name}</p>
            </div>
            {/* sku brand cate stock */}
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-[20px] text-[#5F6C72]">Sku</p>
                    <div className="flex items-center gap-1">
                        <p className="text-[20px] text-[#5F6C72]">Brand: </p>
                        <p className="text-[20px] text-[#191C1F]">{product.brand}</p>
                    </div>
                </div>
                <div>
                    <div className="flex gap-2">
                        <p className="text-[20px] text-[#5F6C72]">Availability: </p>
                        {currentValuevariant.stock > 0 ? (
                            <p className="text-[20px] text-[#2DB224]">Instock</p>
                        ) : (<p className="text-[20px] text-red-500"> Out of stock</p>)
                        }
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-[20px] text-[#5F6C72]">Category:</p>
                        <p className="text-[20px] text-[#191C1F]">{product.categoryName}</p>
                    </div>
                </div>
            </div>

            {/* price and quantity*/}
            <div className="pt-8 flex justify-between items-center">
                {/* price */}
                <div className="">
                    {discount && discount.typediscount == 1 ? (
                        <div>
                            <p className="text-[30px] text-[#2EB100]">
                                {currentValuevariant.price -
                                    currentValuevariant.price * (discount?.discount / 100)} VND
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
                            <p className="text-[30px] text-[#2EB100] font-bold">
                                {currentValuevariant.price} VND
                            </p>
                        </div>
                    )}
                </div>
                {/* quantity */}
                <div>
                    <Quantity onchange={(value: number) => setQuantity(value)} />
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
                    {Object.entries(attribute).map(([key, value]) => (
                        <div key={key}>
                            <p className="font-semibold mb-1 text-[#191C1F]">{key.charAt(0).toUpperCase() + key.slice(1)}</p>

                            <Dropdown active={selectedOptions[key]}>
                                {value.map(v => (
                                    <div
                                        key={v}
                                        className="cursor-pointer"
                                        onClick={() => handleOnechangeVariant(key, v)}
                                    >
                                        <p className="text-[#475156]">{v.charAt(0).toUpperCase() + v.slice(1)}</p>
                                    </div>
                                ))}
                            </Dropdown>
                        </div>
                    ))}
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
                <button className="w-[100px] flex gap-2 border-[2px] border-[#1877F2] rounded-2xl p-2">
                    <PiShoppingCartSimpleLight className="text-[#1877F2]" size={28} />
                    <p className="text-[20px] font-medium text-[#1877F2]">ADD</p>
                </button>
                {/* nút buy */}
                <button className="flex items-center justify-center rounded-2xl gap-2 bg-[#1877F2] w-[100px] p-2">
                    <PiHandbagSimple className="text-[#FFFFFF]" size={28} />
                    <p className="text-[20px] font-medium text-[#FFFFFF]">BUY</p>
                </button>
            </div>
            {/* khu vực wish list, compare, share product */}
            <div className="flex justify-between">
                {/* wish list and compare  */}
                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <FaRegHeart className="text-[#475156]" size={28} />
                        <p className="text-center text-[#475156]">
                            Add to wishlist
                        </p>
                    </div>
                    <div className="flex gap-2 items-center">
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
                    <PiCopy className="text-[#5F6C72]" size={28} />
                    <FaFacebook  className="text-[#FCBD01]" size={28} />
                    <FaTwitter className="text-[#5F6C72]" size={28} />
                    <FaPinterestP className="text-[#5F6C72]" size={28} />
                </div>
            </div>
            {/* khu vực checkout */}
            <div className="border-[1px] border-[#E4E7E9] p-4 mt-8">
                <p className="text-[20px] text-[#191C1F]">100% Guarantee Safe Checkout</p>
            </div>
            
        </div>
    )
}
// {
//     [color]: ['red', 'blue']],
//     storage: ['2gb', '5gb']
// }
