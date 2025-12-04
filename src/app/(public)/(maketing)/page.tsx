'use client'


import { Brands } from "@/components/templates/brands/brands";
import DealsDay from "@/components/templates/dealsDay/dealsDay";
import EBrand from "@/components/templates/electronicBrands/eBrand";
import { Features } from "@/components/templates/features/features";
import Frequently from "@/components/templates/frequently/frequenty";
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
          axios.get(`${restApiBase}product/frequently`)
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
      {frequentlyProduct && (
        <Frequently product={frequentlyProduct} />
      )}
    </div>
  );
}
