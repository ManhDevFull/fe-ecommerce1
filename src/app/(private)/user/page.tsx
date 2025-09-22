"use client";
import BackNavigation from "@/components/ui/BackNavigation";
import NavigationPath from "@/components/ui/NavigationPath";
// import { GooglePlay, ShoppingCart } from "iconsax-react";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CiCamera } from "react-icons/ci";

const menuItems = [
    { id: "account", label: "MY ACCOUNT", img: "https://res.cloudinary.com/do0im8hgv/image/upload/v1757949078/image_1_gmpnkd.png", bg: "bg-[#C2E6FF]" },
    { id: "orders", label: "ORDER HISTORY", img: "https://res.cloudinary.com/do0im8hgv/image/upload/v1757949098/image_2_h5wwjb.png", bg: "bg-[#FFEBBB]" },
    { id: "address", label: "ADDRESS", img: "https://res.cloudinary.com/do0im8hgv/image/upload/v1757949103/image_3_f2tien.png", bg: "bg-[#E9FFC7]" },
    { id: "logout", label: "LOGOUT", img: "https://res.cloudinary.com/do0im8hgv/image/upload/v1757949115/image_4_wgcv2s.png", bg: "bg-[#FFD7DC]" },
];


export default function User() {
    const [active, setActive] = useState("account");
    return (
        <main className="pt-2">
            <NavigationPath />
            <BackNavigation />
            <div className="container mx-auto pt-5 pl-40 pb-12 px-35">
                <h1 className="text-3xl font-bold mb-6 ">MY PROFILE</h1>
                <div className="flex gap-6">
                    {/* Sidebar */}
                    <div className="w-[390px] h-[580px] bg-white shadow rounded-xl p-6 flex flex-col items-center border border-gray-300">
                        {/* Avatar */}
                        <div className="relative">
                            <img
                                src="https://res.cloudinary.com/do0im8hgv/image/upload/v1757949054/image_zbt0bw.png"
                                alt="profile"
                                className="w-32 h-32 rounded-full object-cover"
                            />
                            <button className="absolute bottom-2 right-2 bg-black text-white text-xs p-2 rounded-full">
                                <CiCamera size={20} />
                            </button>
                        </div>
                        <h2 className="mt-4 font-semibold text-lg">Suprava Saha</h2>

                        {/* Menu Wrapper */}
                        <div className="mt-6 w-full rounded-lg p-4">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActive(item.id)}
                                        className={`
                        w-full h-[140px] flex flex-col items-center justify-center p-4 rounded-lg transition-all
                        ${active === item.id
                                                ? "bg-white border border-[#1877F2]"
                                                : `${item.bg} border border-transparent hover:bg-white hover:border-[#1877F2]`}
                    `}
                                    >
                                        <img src={item.img} className="w-[70px] h-[70px]" />
                                        <span className="mt-2 text-[14px] font-bold font-Lato">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="flex-1">
                        <div className="flex items-center mb-6">
                            <img
                                src="https://res.cloudinary.com/do0im8hgv/image/upload/v1757949078/image_1_gmpnkd.png"
                                alt=""
                                className="w-[43px] h-[43px] mr-3"
                            />
                            <h2 className="text-xl font-semibold text-[25px]">Account Details</h2>
                        </div>

                        <form className="grid grid-cols-1 gap-6 w-full font-sans-serif text-[15px]">
                            {/* First Name */}
                            <div className="w-full">
                                <label className="block font-medium mb-1 text-[#6C7275]">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full border border-[#CBCBCB] rounded-md p-2"
                                    placeholder="Sofia"
                                />
                            </div>

                            {/* Last Name */}
                            <div className="w-full">
                                <label className="block font-medium mb-1 text-[#6C7275]">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full border border-[#CBCBCB] rounded-md p-2"
                                    placeholder="Havertz"
                                />
                            </div>

                            {/* Display Name */}
                            <div className="w-full">
                                <label className="block font-medium mb-1 text-[#6C7275]">
                                    Display Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full border border-[#CBCBCB] rounded-md p-2"
                                    placeholder="Sofia"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    This will be how your name will be displayed in the account section and
                                    in reviews
                                </p>
                            </div>

                            {/* Email */}
                            <div className="w-full">
                                <label className="block font-medium mb-1 text-[#6C7275]">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    className="w-full border border-[#CBCBCB] rounded-md p-2"
                                    placeholder="sofiahavertz@gmail.com"
                                />
                            </div>

                            {/* Password */}
                            <div className="w-full">
                                <h2 className="text-xl font-semibold mb-4 text-[25px]">Password</h2>

                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block font-medium mb-1 text-[#6C7275]">
                                            Old Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full border border-[#CBCBCB] rounded-md p-2"
                                            placeholder="Enter old password"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-medium mb-1 text-[#6C7275]">
                                            New Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full border border-[#CBCBCB] rounded-md p-2"
                                            placeholder="Enter new password"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-medium mb-1 text-[#6C7275]">
                                            Repeat New Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full border border-[#CBCBCB] rounded-md p-2"
                                            placeholder="Repeat new password"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Save button */}
                            <div>
                                <button
                                    type="submit"
                                    className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
                                >
                                    Save changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </main>
    );
}
