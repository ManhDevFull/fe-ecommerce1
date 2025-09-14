import { BsBoxSeam } from "react-icons/bs";
import { PiCreditCardLight, PiHeadphonesLight } from "react-icons/pi";
import { TfiCup } from "react-icons/tfi";

export function Features() {
    return (
        <div className="w-full px-4  sm:px-16 py-10">
            <div className="border-[1px] px-4 py-8 rounded-[2px] border-gray-200 flex flex-col lg:flex lg:flex-row lg:justify-around">
                <div className="flex items-center lg:justify-between gap-4">
                    <div className="text-center">
                        <BsBoxSeam size={30} />
                    </div>
                    <div>
                        <h5>FASTED DELIVERY</h5>
                        <p className="text-gray-500">Delivery in 24/H</p>
                    </div>
                </div>
                <div className="hidden sm:block h-auto w-[1px] bg-gray-400"></div>
                <div className="flex py-4 sm:py-2 lg:justify-between items-center gap-4">
                    <div className="text-center">
                        <TfiCup size={30} />
                    </div>
                    <div>
                        <h5>24 HOURS RETURN</h5>
                        <p className="text-gray-500">100% money-back guarantee</p>
                    </div>
                </div>
                <div className="h-auto hidden sm:block w-[1px] bg-gray-400"></div>
                <div className="flex lg:justify-between items-center gap-4">
                    <div className="text-center">
                        <PiCreditCardLight size={30} />
                    </div>
                    <div>
                        <h5>SCURE PAYMENT</h5>
                        <p className="text-gray-500">Your money is safe</p>
                    </div>
                </div>
                <div className="h-auto hidden sm:block w-[1px] bg-gray-400"></div>
                <div className="flex py-4 sm:py-2 lg:justify-between items-center gap-4 ">
                    <div className="text-center">
                        <PiHeadphonesLight size={30} />
                    </div>
                    <div>
                        <h5>SUPPORT 24/7</h5>
                        <p className="text-gray-500">Live contact/message </p>
                    </div>
                </div>
            </div>
        </div>
    )
}