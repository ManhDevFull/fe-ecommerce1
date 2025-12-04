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
import { DiscountDTO, ProductUi } from "@/types/type";
import { useEffect, useState } from "react";
import axios from "axios";
import { restApiBase } from "@/utils/env";
import TimeLeft from "@/components/ui/TimeLeft";
import CardIndex from "@/components/ui/CardIndex";

export default function DealsDay({ products }: { products: ProductUi[] }) {
    // const products = [
    //     {
    //         name: 'abc',
    //         endTime: parse("10/09/2025 23:59:59", "dd/MM/yyyy HH:mm:ss", new Date()),
    //         img: 'https://res.cloudinary.com/do0im8hgv/image/upload/v1756557032/0f6678f8-f18d-4b7c-a79a-1c18e2828f05.png',
    //         price: 800
    //     },
    //     {
    //         name: 'bcd',
    //         endTime: parse("12-09-2025 21:59:59", "yyyy-MM-dd HH:mm:ss", new Date()),
    //         img: 'https://res.cloudinary.com/do0im8hgv/image/upload/v1756557032/0f6678f8-f18d-4b7c-a79a-1c18e2828f05.png',
    //         price: 300
    //     },
    //     {
    //         name: 'abc',
    //         endTime: parse("13-09-2025 2 3:59:59", "yyyy-MM-dd HH:mm:ss", new Date()),
    //         img: 'https://res.cloudinary.com/do0im8hgv/image/upload/v1756557032/0f6678f8-f18d-4b7c-a79a-1c18e2828f05.png',
    //         price: 400
    //     },
    //     {
    //         name: 'abc',
    //         endTime: parse("14-09-2025 23:59:59", "yyyy-MM-dd HH:mm:ss", new Date()),
    //         img: 'https://res.cloudinary.com/do0im8hgv/image/upload/v1756557032/0f6678f8-f18d-4b7c-a79a-1c18e2828f05.png',
    //         price: 400
    //     }

    // ]

    const [newProduct, setNewProduct] = useState<ProductUi[]>([]);
    useEffect(() => {
        setNewProduct(products);
    }, [products]);
    // // gọi api để lấy ra nhuwgx sản phẩm có giảm giá mới nhất
    // useEffect(() => {
    //     const fetchNewProduct = async () => {
    //             try {
    //             const res = await axios.get(`${restApiBase}product/discount`);
    //             console.log('sản phẩm có discount', res.data);
    //             setNewProduct(res.data);
    //         }
    //         catch(error : any){
    //             if(error.response)
    //                 console.log('lỗi từ server');
    //             if(error.request)
    //                 console.log('lỗi không nhận được phản hồi server')
    //         }
    //     }
    //     fetchNewProduct();
    // }, []);

    type DiscountInfor = {
        price: number;
        discount: DiscountDTO;
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
        // hiện tại dữ liệu fake đã hết hạn nên trả về null
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
                        console.log('price: ', deal?.price);
                        console.log('discount', deal?.discount);
                        return (
                            <div key={index}
                                className={`cursor-pointer w-[160px] sm:w-[250px] md:w-[300px]`}
                                // Lưu ý: Bạn cần điền đường dẫn chi tiết sản phẩm vào đây, ví dụ: /product/${product.id}
                                onClick={() => router.push(`/product/${product.id}`)} 
                            >
                                {/* <Product img={product.imgUrls[1]} isNew={true} type={true} /> */}
                                <CardIndex isNew={true} img={product.imgUrls[0]} />
                                {
                                    deal && <FlashDealBar endTime={deal?.discount?.endtime} />
                                }
                                <p className="text-[16px] sm:text-[18px] lg:text-[20px] font-bold">{product.name}</p>
                                <BtnBuyNow price={deal?.price ?? product.variant[0].price} />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}