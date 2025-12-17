'use client'


import { Brands } from "@/components/templates/brands/brands";
import DealsDay from "@/components/templates/dealsDay/dealsDay";
import EBrand from "@/components/templates/electronicBrands/eBrand";
import { Features } from "@/components/templates/features/features";
import Frequently from "@/components/templates/frequently/frequentlyIndex";
import ShopByCategory from "@/components/templates/shopByCategory/ShopByCategory";
import { Slider } from "@/components/templates/slider/slider";
import HamsterWheel from "@/components/ui/HamsterWheel";
import Skeleton from "@/components/ui/Skeleton";
import { FrequentlyDTO, ProductUi } from "@/types/type";
import { restApiBase } from "@/utils/env";
import axios from "axios";
import { img } from "framer-motion/client";
import React, { useEffect, useState } from "react";

type RootLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};
export default function Home({ children, params }: RootLayoutProps) {
  const [newProduct, setNewProduct] = useState<ProductUi[]>([]);// sản phẩm có giảm giá mới nhất
  const [frequentlyProduct, setFrequentlyProduct] = useState<FrequentlyDTO | null>(null); // sản phẩm kèm theo
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsLoading(true);
        // gọi song song
        const [discountRes, frequentlyRes] = await Promise.all([
          axios.get(`${restApiBase}product/discount`),
          axios.get(`${restApiBase}product/frequently-index`)
        ]);

        console.log("sản phẩm có discount:", discountRes.data);
        console.log("frequently:", frequentlyRes.data);

        setNewProduct(discountRes.data);
        setFrequentlyProduct(frequentlyRes.data);

      } catch (error: any) {
        if (error.response) console.log("lỗi từ server");
        if (error.request) console.log("không nhận được phản hồi từ server");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);
  return (
    <div className="w-full p-0">
      <Slider />
      <Features />
      <Brands />
      {isLoading ? (
        <>
          
        </>
      ) : (
        <DealsDay products={newProduct} />
      )}

      <ShopByCategory />
      <EBrand />
      {isLoading ? (
        <div className="py-8 px-4 sm:px-16">
          <div className="pt-8 border-t-1 border-gray-300 flex justify-between items-center">
            <Skeleton type="title" className="sm:text-[18px] md:text-[24px] font-bold"></Skeleton>
            <Skeleton className="sm:px-6" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid lg:grid-cols-6 divide-x divide-y divide-[#E4E7E9] pt-16">
            {
              Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className={`${i == 0 ? "row-span-2 col-span-2 " : "col-span-1 row-span-1"} p-4 group border-1 border-gray-200`}
                >
                  {/* Discount */}
                  <div className="flex flex-col gap-2">
                    {/* {product.discount_percent && (
                                        <div className="">
                                            <p className="text-black text-center font-bold p-2 bg-[#EFD33D] text-[12px] w-[100px] rounded">
                                                {`${product.discount_percent}% OFF`}
                                            </p>
                                        </div>
                                    )} */}
                    {/* Status */}
                    {/* {product.status && (
                                        <div>
                                            <p className={`text-white text-[12px] text-center ${product.status === 'HOT' ? 'bg-[#EE5858] w-[50px]' : 'bg-[#929FA5] w-[100px]'}  p-2 rounded`}>{product.status}</p>
                                        </div>
                                    )} */}
                    <div>
                      <p className={`text-white text-[12px] text-center   'bg-[#EE5858] w-[50px]' : 'bg-[#929FA5] w-[100px]'}  p-2 rounded`}>HOT</p>
                    </div>
                  </div>
                  {/* Image */}
                  <div className="relative py-2">
                    <div className="flex justify-around items-center absolute h-full w-full bg-gray-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-800 z-0">
                      <div className="md:w-[30px] md:h-[30px] lg:w-[35px] lg:h-[35px] xl:w-[40px] xl:h-[40px] flex justify-center items-center w-[50px] h-[50px] rounded-full z-10 bg-black">
                        <Skeleton type="title" className="text-white" />
                      </div>
                      <div className="md:w-[30px] md:h-[30px] lg:w-[35px] lg:h-[35px] xl:w-[40px] xl:h-[40px] flex justify-center items-center w-[50px] h-[50px] rounded-full z-10 bg-black"></div>
                      <div className="md:w-[30px] md:h-[30px] lg:w-[35px] lg:h-[35px] xl:w-[40px] xl:h-[40px] flex justify-center items-center w-[50px] h-[50px] rounded-full z-10 bg-black"></div>
                    </div>
                    <Skeleton type="img" className={`w-[400px] ${i == 0 ? 'h-[300px]' : 'h-[200px] md:h-[150px] lg:h-[160px] xl:h-[200px] z-10'}`} />
                  </div>

                  {/* Rating */}
                  <div>

                    <div className="flex pt-4">
                      <div className="flex justify-around items-center gap-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <Skeleton type="img" key={i} width={30} height={20} />
                        ))}
                        <Skeleton type="title" className="text-[20px] text-gray-400" />
                      </div>
                    </div>
                    <div className="py-4"><Skeleton type="title" className="font-medium text-[16px] line-clamp-2"/></div>
                    {/* <div className="flex items-center gap-2">
                                        <span className={`font-bold flex items-center ${product.price_discounted ? 'line-through decoration-gray-500' : ''}`}>
                                            <FaRupeeSign size={14} className={`${product.price_discounted ? 'text-gray-500' : 'text-blue-500'}`} />
                                            <span className={`text-[14px] ${product.price_discounted ? 'text-gray-500 text-center' : 'text-blue-500'}`}>{product.price_original} </span>
                                        </span>
                                        {product.price_discounted && <p className="flex items-center font-bold"><FaRupeeSign size={14} className="text-blue-500" /> <span className="text-[14px] text-blue-500">{product.price_discounted} </span></p>}
                                    </div> */}
                    {i == 0 && (<div>
                      <Skeleton type="title" className="text-[15px] text-gray-500" />
                    </div>)}
                  </div>

                </div>
              ))}
          </div>
        </div>
      ) :
        (
          frequentlyProduct && <Frequently product={frequentlyProduct} />
        )
      }
    </div>
  );
}
