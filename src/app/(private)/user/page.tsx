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

export default function User() {
    return (
        <main className="pt-2">
            <NavigationPath />
            <BackNavigation />
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">MY PROFILE</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Sidebar */}
                    <div className="bg-white shadow rounded-xl p-6 flex flex-col items-center">
                        {/* Avatar */}
                        <div className="relative">
                            <img
                                src="https://res.cloudinary.com/do0im8hgv/image/upload/v1757949054/image_zbt0bw.png"
                                alt="profile"
                                className="w-32 h-32 rounded-full object-cover"
                            />
                            <button className="absolute bottom-2 right-2 bg-black text-white text-xs p-2 rounded-full">
                                📷
                            </button>
                        </div>
                        <h2 className="mt-4 font-semibold text-lg">Suprava Saha</h2>

                        {/* Menu */}
                        <div className="grid grid-cols-2 gap-4 mt-6 w-full">
                            <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50">
                                <img src="https://res.cloudinary.com/do0im8hgv/image/upload/v1757949078/image_1_gmpnkd.png"  className="w-92px h-92px"/>
                                <span className="mt-2 text-sm">MY ACCOUNT</span>
                            </button>
                            <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50">
                                <img src="https://res.cloudinary.com/do0im8hgv/image/upload/v1757949098/image_2_h5wwjb.png" className="w-92px h-92px"/>
                                <span className="mt-2 text-sm">ORDER HISTORY</span>
                            </button>
                            <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50">
                                <img src="https://res.cloudinary.com/do0im8hgv/image/upload/v1757949103/image_3_f2tien.png" className="w-92px h-92px"/>
                                <span className="mt-2 text-sm">ADDRESS</span>
                            </button>
                            <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50">
                                <img src="https://res.cloudinary.com/do0im8hgv/image/upload/v1757949115/image_4_wgcv2s.png" className="w-92px h-92px"/>
                                <span className="mt-2 text-sm">LOGOUT</span>
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="md:col-span-2 bg-white shadow rounded-xl p-6">
                        <h2 className="text-xl font-semibold mb-4">Account Details</h2>

                        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* First Name */}
                            <div>
                                <label className="block text-sm font-medium mb-1">First Name</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg p-2"
                                    placeholder="Sofia"
                                />
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Last Name</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg p-2"
                                    placeholder="Havertz"
                                />
                            </div>

                            {/* Display Name */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Display Name</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg p-2"
                                    placeholder="Sofia"
                                />
                            </div>

                            {/* Email */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full border rounded-lg p-2"
                                    placeholder="sofiahavertz@gmail.com"
                                />
                            </div>

                            {/* Old Password */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Old Password</label>
                                <input
                                    type="password"
                                    className="w-full border rounded-lg p-2"
                                />
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium mb-1">New Password</label>
                                <input
                                    type="password"
                                    className="w-full border rounded-lg p-2"
                                />
                            </div>

                            {/* Repeat Password */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Repeat New Password</label>
                                <input
                                    type="password"
                                    className="w-full border rounded-lg p-2"
                                />
                            </div>

                            {/* Save button */}
                            <div className="md:col-span-2 mt-4">
                                <button
                                    type="submit"
                                    className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
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
