import { ProductUi } from "@/types/type";
import { div } from "framer-motion/client";
import { useRef, useState, useEffect } from "react";
import { FiHeadphones } from "react-icons/fi";
import { LiaHandshakeSolid } from "react-icons/lia";
import { PiCreditCard, PiMedalFill, PiTruck } from "react-icons/pi";

export default function Description({ product }: { product: ProductUi }) {
    const tabs = ["DESCRIPTION", "ADDITIONAL INFORMATION", "SPECIFICATION", "REVIEW"];
    const [active, setActive] = useState(0);

    // array chứa ref cho từng tab
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const underlineRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const currentTab = tabRefs.current[active];
        const underline = underlineRef.current;

        if (currentTab && underline) {
            const rect = currentTab.getBoundingClientRect();
            const containerRect = currentTab.parentElement!.getBoundingClientRect();

            underline.style.width = `${rect.width}px`;
            underline.style.transform = `translateX(${rect.left - containerRect.left}px)`;
        }
    }, [active]);

    return (
        <div className="border border-[#E4E7E9] rounded-md p-4">
            <div className="w-full border-b border-[#E4E7E9] relative flex justify-center">
                <div className="flex items-center gap-12 relative">
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            ref={(el) => (tabRefs.current[index] = el)}
                            onClick={() => setActive(index)}
                            className={`py-4 text-lg font-semibold transition-colors duration-300 ${active === index ? "text-black" : "text-gray-400"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}

                    {/* Underline chạy đúng vị trí */}
                    <div
                        ref={underlineRef}
                        className="absolute bottom-0 h-[3px] bg-yellow-400 transition-all duration-300"
                    />
                </div>
            </div>

            <div className="mt-6 px-4">
                {active === 0 && (
                    <div className="flex justify-between">
                        {/* Description  */}
                        <div>
                            <p className="text-[30px] text-[#191C1F]">
                                Description
                            </p>
                            <p className="text-[#5F6C72]">{product.description}</p>
                        </div>
                        {/* Feature */}
                        <div className="p-2">
                            <p className="text-[30px] text-[#191C1F]">Feature</p>
                            <div className="flex items-center gap-2 py-2">
                                <PiMedalFill size={28} className="text-[#2EB100]" />
                                <p className="text-[20px] text-[#191C1F]">Free 1 Year Warranty</p>
                            </div>
                            <div className="flex items-center gap-2 pb-2">
                                <PiTruck size={28} className="text-[#2EB100]" />
                                <p className="text-[20px] text-[#191C1F]">Free Shipping & Fasted Delivery</p>
                            </div>
                            <div className="flex items-center gap-2 pb-2">
                                <LiaHandshakeSolid size={28} className="text-[#2EB100]" />
                                <p className="text-[20px] text-[#191C1F]">100% Money-back guarantee</p>
                            </div>
                            <div className="flex items-center gap-2 pb-2">
                                <FiHeadphones size={28} className="text-[#2EB100]" />
                                <p className="text-[20px] text-[#191C1F]">24/7 Customer support</p>
                            </div>
                            <div className="flex items-center gap-2 pb-2">
                                <PiCreditCard size={28} className="text-[#2EB100]" />
                                <p className="text-[20px] text-[#191C1F]">24/7 Customer support</p>
                            </div>
                        </div>
                        {/* Shipping Information */}
                        <div className="p-4 border-l-[1px] border-[#E4E7E9]">
                            <p className="text-[30px] text-[#191C1F]">
                                Shipping Information
                            </p>
                            <div className="flex items-center gap-2 py-2">
                                <p className="text-[20px] text-[#191C1F]">Courier:</p>
                                <p className="text-[20px] text-[#5F6C72]"> 2 - 4 days, free shipping</p>
                            </div>
                            <div className="flex items-center gap-2 pb-2">
                                <p className="text-[20px] text-[#191C1F]">Local Shipping:</p>
                                <p className="text-[20px] text-[#5F6C72]"> up to one week, ₹19.00
                                </p>
                            </div>
                            <div className="flex items-center gap-2 pb-2">
                                <p className="text-[20px] text-[#191C1F]">UPS Ground Shipping:</p>
                                <p className="text-[20px] text-[#5F6C72]"> 4 - 6 days, ₹29.00
                                </p>
                            </div>
                            <div className="flex items-center gap-2 pb-2">
                                <p className="text-[20px] text-[#191C1F]">Unishop Global Export:</p>
                                <p className="text-[20px] text-[#5F6C72]"> 3 - 4 days, ₹39.00</p>
                            </div>
                        </div>
                    </div>
                )}
                {active === 1 && <p>No additional information yet.</p>}
                {active === 2 && <p>Specification coming soon.</p>}
                {active === 3 && <p>{product.rating}</p>}
            </div>
        </div>
    );
}
