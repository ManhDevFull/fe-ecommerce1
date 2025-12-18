import BtnBuyNow from "@/components/ui/BtnBuyNow";
import { BtnViewAll } from "@/components/ui/BtnViewAll";
import { ProductUi } from "@/types/type";
import { CiHeart } from "react-icons/ci";
import { FaStar } from "react-icons/fa";

export default function FrequentlyGrid({ products }: { products: ProductUi[] }) {
    return (
        <div className="py-8 px-4 sm:px-16">
            <div className="pt-8 border-t-1 border-gray-300 flex justify-between items-center">
                <h2 className="sm:text-[18px] md:text-[24px] font-bold">FRENQUENTLY BOUGHT TOGETHER</h2>
                <BtnViewAll className="sm:px-6" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid lg:grid-cols-6 divide-x divide-y divide-[#E4E7E9] pt-16">
                {
                    products && products.map((product, index) => (
                        <div key={index}>
                            {/* img */}
                            <div className="relative py-2">
                                <div className="flex justify-around items-center absolute h-full w-full bg-gray-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-800 z-0">
                                    <div className="md:w-[30px] md:h-[30px] lg:w-[35px] lg:h-[35px] xl:w-[40px] xl:h-[40px] flex justify-center items-center w-[50px] h-[50px] rounded-full z-10 bg-black">
                                        <CiHeart size={20} className="text-white" />
                                    </div>
                                    <div className="md:w-[30px] md:h-[30px] lg:w-[35px] lg:h-[35px] xl:w-[40px] xl:h-[40px] flex justify-center items-center w-[50px] h-[50px] rounded-full z-10 bg-black"></div>
                                    <div className="md:w-[30px] md:h-[30px] lg:w-[35px] lg:h-[35px] xl:w-[40px] xl:h-[40px] flex justify-center items-center w-[50px] h-[50px] rounded-full z-10 bg-black"></div>
                                </div>
                                <div className="flex items-center justify-center p-2">
                                    <img className={`w-[280px] ${index == 0 ? 'h-[300px]' : 'h-[200px] md:h-[150px] lg:h-[160px] xl:h-[200px] z-10'}`} src={product.imgUrls?.[0] ?? ''} alt={product.name} />
                                </div>
                            </div>
                            {/* name product */}
                            <div className="py-4"><p className="font-medium text-[20px] line-clamp-2 truncate">{product.name}</p></div>
                            {/* rating */}
                            <div className="flex pt-4">
                                <div className="flex justify-around items-center gap-2">
                                    {Array.from({ length: product.rating }).map((_, i) => (
                                        <FaStar key={i} className="text-[#EBC80C]" size={20} />
                                    ))}
                                    <p className="text-[20px] text-gray-400">{`(${product.rating})`}</p>
                                </div>
                            </div>
                            {/* button buy */}
                            <BtnBuyNow id={product.id} price={product.variant?.[0].price} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}