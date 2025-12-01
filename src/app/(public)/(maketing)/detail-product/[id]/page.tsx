"use client";
import handleAPI from "@/axios/handleAPI";
import Description from "@/components/templates/Detail/Description";
import Information from "@/components/templates/Detail/Information";
import Media from "@/components/templates/Detail/media";
import HamsterWheel from "@/components/ui/HamsterWheel";
import { ProductUi } from "@/types/type"
import { restApiBase } from "@/utils/env";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react"
import { AiFillWarning } from "react-icons/ai";

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
                const res = await axios(`${restApiBase}product/detail-product/${id}`);
                // const res = await handleAPI(`${restApiBase}product/detail-product/${id}`, undefined, 'get');
                console.log("product: ", res.data);
                setProduct(res.data);
                setIsLoading(false);
            }
            catch (error: any) {
                if (error.response)
                    console.log("lỗi từ server");
                if (error.request)
                    console.log("không nhận được phản hồi từ server");
            }
            ;
        }
        fetchProduct();
    }, [id]);
    return (
        isLoading ? (
            <div className="flex items-center justify-center"><HamsterWheel /></div>
        ) : (
            <div className="px-20 pt-8">
                {
                    // media and information
                    product && (
                        <>
                            <div className="flex justify-center">
                                <Media product={product} />
                                <Information product={product} />
                            </div>
                            // Descrip tion
                            <Description product={product} />
                        </>
                    )

                }
            </div>)
    )
}