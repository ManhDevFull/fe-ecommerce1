import { FaRupeeSign } from "react-icons/fa"

type PriceProps = {
    price: number
}
export default function BtnBuyNow({ price }: PriceProps) {
    return (
        <div className="w-full rounded-xl py-4 flex justify-center items-center bg-gray-900">
            <p className="text-white">BUY NOW - </p>
            <p className="text-orange-400 flex items-center"> <FaRupeeSign /> {`${price}`}</p>
        </div>
    )
}