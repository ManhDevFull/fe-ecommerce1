import handleAPI from "@/axios/handleAPI";
import { ProductUi } from "@/types/type"
import { restApiBase } from "@/utils/env";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react"
import { AiFillWarning } from "react-icons/ai";

export default function Detail() {
    const params = useParams();
    const id = params.id; // lấy id sản phẩm
    // gọi api để lấy danh ra sản phẩm với id tương ứng
    const [product, setProduct] = useState<ProductUi | null>(null);
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // const res = await axios.get(`${restApiBase}`);
                const res = await handleAPI(`${restApiBase}`, 'get');
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