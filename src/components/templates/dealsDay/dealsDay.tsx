"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import axios from "axios";

// Components
import BtnBuyNow from "@/components/ui/BtnBuyNow";
import FlashDealBar from "@/components/ui/FlashDealBar";
import Product from "@/components/ui/ImgProduct";
import { BtnViewAll } from "@/components/ui/BtnViewAll";

// Types & Utils
import { ProductUi } from "@/types/type";
import { restApiBase } from "@/utils/env";

// --- 1. SỬ DỤNG DYNAMIC IMPORT ĐỂ FIX LỖI HYDRATION ---
const TimeLeft = dynamic(() => import("@/components/ui/TimeLeft"), { 
  ssr: false, // Tắt render phía server cho đồng hồ
  loading: () => (
    // Loading skeleton màu vàng để không bị giật layout
    <div className="w-[120px] h-[40px] bg-yellow-400 rounded-[10px] animate-pulse"></div>
  ) 
});

export default function DealsDay() {
    const [newProduct, setNewProduct] = useState<ProductUi[]>([]);
    const router = useRouter();

    // Gọi api để lấy ra những sản phẩm có giảm giá
    useEffect(() => {
        const fetchNewProduct = async () => {
            try {
                const res = await axios.get(`${restApiBase}product/discount`);
                // console.log('sản phẩm có discount', res.data);
                setNewProduct(res.data);
            }
            catch(error : any){
                console.error('Lỗi lấy sản phẩm giảm giá:', error);
            }
        }
        fetchNewProduct();
    }, []);

    type DiscountInfor = {
        price: number;
        discount: any | null;
    }

    // Hàm xử lý lấy ra giá trị discount hợp lệ
    const getValidDiscount = (product: ProductUi): DiscountInfor | null => {
        const now = new Date();
        // Kiểm tra an toàn để tránh lỗi nếu product.variant bị null/undefined
        if (!product.variant) return null;

        for (const variant of product.variant) {
            if (variant.discounts && variant.discounts.length > 0) {
                const discount = variant.discounts.find(dis =>
                    new Date(dis.endtime) > now
                );
                if (discount)
                    return {
                        price: variant.price,
                        discount: discount
                    }; // trả về discount còn hạn đầu tiên;
            }
        }
        return null;
    }

    return (
        // ✏️ Đã sửa lỗi chính tả: w-ful -> w-full
        <div className="w-full px-4 sm:px-16 py-4">
            <div className="w-full sm:flex sm:justify-between sm:items-center gap-2">
                <div className="flex items-center">
                    <h2 className="sm:text-[18px] md:text-[24px] font-bold">TODAY'S DEALS OF THE DAY</h2>
                </div>
                <div className="sm:flex sm:pt-0 sm:gap-2 sm:justify-between items-center">
                    <p className="font-medium hidden lg:block">Deals ends in</p>
                    <div className=" flex justify-between items-center gap-1 lg:gap-4">
                        
                        {/* Component đồng hồ đã fix lỗi Hydration */}
                        <TimeLeft />

                        <BtnViewAll className={'sm:px-6 !p-2'} />
                    </div>
                </div>
            </div>

            <div className="w-full grid grid-cols-2 justify-items-center gap-1 sm:grid-cols-2 sm:gap-2 sm:items-center lg:flex lg:gap-4 lg:justify-around lg:flex-nowrap pt-8">
                {
                    newProduct.map((product, index) => {
                        const deal = getValidDiscount(product);
                        return (
                            <div key={index}
                                className={`cursor-pointer w-[160px] sm:w-[250px] md:w-[300px]`}
                                // Lưu ý: Bạn cần điền đường dẫn chi tiết sản phẩm vào đây, ví dụ: /product/${product.id}
                                onClick={() => router.push(`/product/${product.id}`)} 
                            >
                                {/* Kiểm tra mảng imgUrls trước khi truy cập phần tử số [1] để tránh lỗi crash */}
                                <Product 
                                    img={product.imgUrls && product.imgUrls.length > 1 ? product.imgUrls[1] : (product.imgUrls?.[0] || '')} 
                                    isNew={true} 
                                    type={true} 
                                />
                                
                                <FlashDealBar endTime={deal?.discount?.endTime} />
                                <p className="text-[16px] sm:text-[18px] lg:text-[20px] font-bold truncate">
                                    {product.name}
                                </p>
                                <BtnBuyNow price={deal?.price || 0} />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}