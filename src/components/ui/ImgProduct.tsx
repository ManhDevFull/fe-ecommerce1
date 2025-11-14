import { PiShoppingCartSimpleLight } from "react-icons/pi";
import NewLabel from "./NewLabel";
import { ProductUi, imgproductProps } from "@/types/type";
import { FaPlus } from "react-icons/fa";

export default function ImgProduct({
    img, type }: imgproductProps) {
    return (
        <div
            className={`relative bg-[#ECEDEF] flex justify-center items-center rounded-3xl group overflow-hidden 
        ${type ? 'w-full h-[250px]' : 'w-[150px] h-[150px]'}`}
        >
            {/* Ảnh sản phẩm */}
            <img
                className={`object-contain ${type ? 'w-[150px] h-[150px]' : 'w-[100px] h-[100px]'}`}
                src={img}
                alt=""
            />

            {/* Overlay đen + icon */}
            <div className="absolute inset-0 bg-[#00000094] flex justify-center items-center gap-6 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="h-12 w-12 flex justify-center items-center rounded-full bg-white cursor-pointer hover:scale-110 transition-transform">
                    <PiShoppingCartSimpleLight size={28} />
                </div>
                <div className="h-12 w-12 flex justify-center items-center rounded-full bg-white cursor-pointer hover:scale-110 transition-transform">
                    <FaPlus size={28} />
                </div>
            </div>
        </div>
    )
}