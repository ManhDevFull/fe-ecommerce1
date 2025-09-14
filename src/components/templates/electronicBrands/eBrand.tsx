import AutoSlide from "@/components/ui/AutoSlide";
import { BtnViewAll } from "@/components/ui/BtnViewAll";

export default function EBrand() {
    return (
        <div className="pt-8 px-4 sm:px-16">
            <div className=" pt-8 border-t-1 border-gray-300 flex justify-between items-center">
                <div className="flex gap-1 sm:flex-col lg:flex-row lg:gap-4">
                    <p className="font-bold sm:text-4xl  text-black">TOP</p>
                    <p className="font-bold sm:text-4xl text-yellow-500">ELECTRONICS BRANDS</p>
                </div>
                <BtnViewAll className="sm:h-[50px] sm:w-[100px]" />
            </div>
            <AutoSlide />
        </div>
    )
}