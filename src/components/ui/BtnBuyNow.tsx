import { formatCurrency } from "@/utils/currency"
import { useRouter } from "next/navigation";
import { FaRupeeSign } from "react-icons/fa"

type PriceProps = {
    price: number,
    id: number;
}
export default function BtnBuyNow({ price, id }: PriceProps) {
        // gửi id qua chi tiết sản phẩm
        const route = useRouter();
        const handleBuy = (id: number)=>{
            route.push(`detail-product/${id}`);
        }
    return (
        <button onClick={()=>handleBuy(id)} className="w-full hover:cursor-pointer rounded-xl py-2 sm:py-4 flex justify-center items-center bg-[#232321]">
            <p className="text-white">BUY NOW - </p>
            <p className="text-[#FFA52F] font-bold flex items-center">{formatCurrency(price, {decimals: 2})}</p>
        </button>
    )
}