'use client';
import BackNavigation from "@/components/ui/BackNavigation";
import NavigationPath from "@/components/ui/NavigationPath";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { GrFormNextLink } from "react-icons/gr";
import { IoLogoBuffer } from "react-icons/io5";

export default function ProductConfirmation() {
    return (
        <main className="min-h-screen">
            <BackNavigation />
            <NavigationPath />

            {/* Title */}
            <div className="max-w-[1000px] mx-auto pt-6">
                <h1 className="font-bold text-5xl sm:text-6xl text-gray-900 mb-2">Product Confirmation</h1>
                <p className="text-2xl text-gray-400 font-normal">Let's create your account</p>
            </div>

            <div className="max-w-[1000px] mx-auto mt-10 flex flex-col md:flex-row items-center justify-center gap-30">
                <div className="flex-1 flex justify-center">
                    <img
                        src="https://res.cloudinary.com/do0im8hgv/image/upload/v1758722974/e87b5a38137755e77ecde5dec85f34504e426b41_csmqzy.png"
                        alt="Order Confirmed"
                        className="w-[700px] h-[400px] object-contain"
                    />
                </div>
                <div className="flex-1 flex flex-col items-center md:items-start">
                    <IoIosCheckmarkCircleOutline className="text-green-500 text-6xl mb-4 self-center"/>
                    <h2 className="font-bold text-2xl sm:text-3xl mb-2 text-center md:text-center">
                        Your order is successfully place
                    </h2>
                    <p className="text-gray-500 text-base mb-6 text-center md:text-center">
                        Pellentesque sed lectus nec tortor tristique accumsan quis dictum risus. Donec volutpat mollis nulla non facilisis.
                    </p>
                    <div className="flex gap-4 w-full">
                        <button className="flex-1 border-2 border-blue-600 text-blue-600 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-50 transition">
                            <IoLogoBuffer />
                            GO TO DASHBOARD
                        </button>
                        <button className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition">
                            VIEW ORDER <GrFormNextLink className="text-2xl"/>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}