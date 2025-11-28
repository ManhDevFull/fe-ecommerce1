import { ProductUi } from "@/types/type"
import { restApiBase } from "@/utils/env";
import axios from "axios";
import { useEffect, useState } from "react"

export default function Detail() {
    const route = use

    // gọi api để lấy danh ra sản phẩm với id tương ứng
    const [product, setProduct] = useState<ProductUi | null>(null);
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${restApiBase}`);
                console.log("product: ", res.data);
                setProduct(res.data);
            }
            catch (error: any) {
                if (error.response)
                    console.log("lỗi từ server");
                if (error.request)
                    console.log("không nhận được phản hồi từ server");
            }
            ;
        }
    })
    return (
        <p>đây là trang detail</p>
    )
}