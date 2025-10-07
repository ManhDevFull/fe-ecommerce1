"use client";
import BackNavigation from "@/components/ui/BackNavigation";
import NavigationPath from "@/components/ui/NavigationPath";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { updateCustomerInfo } from "@/redux/reducers/checkoutReducer";
import { useState } from "react";
import { useRouter } from "next/navigation";


const countries = [
  { code: "AU", name: "Australia", flag: "au" },
  { code: "US", name: "United States", flag: "us" },
  { code: "VN", name: "Vietnam", flag: "vn" },
  // ...thêm các quốc gia khác nếu muốn
];

const states = [
  { code: "VIC", name: "Victoria" },
  { code: "NSW", name: "New South Wales" },
  // ...thêm các bang/tỉnh khác nếu muốn
];

export default function CustomerInfo() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { customerInfo } = useSelector((state: RootState) => state.checkout);
    const { items: cartItems, giftBox, discount, giftBoxPrice } = useSelector((state: RootState) => state.cart);
    
    const handleInputChange = (field: string, value: string) => {
        dispatch(updateCustomerInfo({ [field]: value }));
    };

    const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalPrice = total - discount + (giftBox ? giftBoxPrice : 0);

    const handleContinue = () => {
        router.push('/my-cart/customer-info/shipping-payments');
    };

    return(
        <main className="min-h-screen">
            <BackNavigation />
            <NavigationPath />

        {/* Title */}
        <div className="px-40 pt-6">
            <h1 className="font-bold text-5xl sm:text-6xl text-gray-900 mb-2">Customer Information</h1>
            <p className="text-2xl text-gray-400 font-normal">Let's create your account</p>
        </div>


        {/* Form and Order Summary */}
        <div className="flex flex-col lg:flex-row gap-10 px-8 xl:px-40 mt-8">
            {/* Form */}
            <div className="flex-1">
                <form
                className="rounded-md bg- p-4"
                style={{ width: 850, maxWidth: "100%" }}
                >
            <div className="font-bold text-base mb-2">Customer Information</div>
            <label className="block text-sm mb-1">E-mail</label>
            <input
                type="email"
                className="w-full h-10 border border-gray-300 rounded px-3 mb-4"
                style={{ width: 850, maxWidth: "100%" }}
                placeholder="Enter your email"
                value={customerInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
            />

            <div className="flex gap-4 mb-4">
                <div className="flex-1">
                <label className="block text-sm mb-1">First Name</label>
                <input
                    type="text"
                    className="w-full h-10 border border-gray-300 rounded px-3"
                    placeholder="First Name"
                    value={customerInfo.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                />
                </div>
                <div className="flex-1">
                <label className="block text-sm mb-1">Last Name</label>
                <input
                    type="text"
                    className="w-full h-10 border border-gray-300 rounded px-3"
                    placeholder="Last Name"
                    value={customerInfo.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                />
                </div>
            </div>

            {/* <div className="font-bold text-base mb-2 mt-2">Shipping Address</div>
            <label className="block text-sm mb-1">Country</label>
            <input
                type="text"
                className="w-full h-10 border border-gray-300 rounded px-3 mb-4"
                placeholder="Country"
            /> */}
            
            <label className="block text-sm mb-1">Country</label>
            <select 
                className="w-full h-10 border border-gray-300 rounded px-3 mb-4"
                value={customerInfo.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
            >

              {countries.map(c => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>

            {/* <label className="block text-sm mb-1">State/Region</label>
            <input
                type="text"
                className="w-full h-10 border border-gray-300 rounded px-3 mb-4"
                placeholder="State/Region"
            /> */}

            <label className="block text-sm mb-1">State/Region</label>
            <select 
                className="w-full h-10 border border-gray-300 rounded px-3 mb-4"
                value={customerInfo.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
            >
              {states.map(s => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>

            <label className="block text-sm mb-1">Address</label>
            <input
                type="text"
                className="w-full h-10 border border-gray-300 rounded px-3 mb-4"
                placeholder="Address"
                value={customerInfo.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
            />

            <label className="block text-sm mb-1">Phone Number</label>
            <input
                type="text"
                className="w-full h-10 border border-gray-300 rounded px-3 mb-2"
                placeholder="Phone Number"
                value={customerInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
            />
            </form>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-[350px] bg-white rounded-2xl shadow-xl p-8 h-fit">
                <h3 className="font-bold text-xl mb-6">Order Summary</h3>
                <div className="flex justify-between mb-3 text-base">
                    <span>Price</span>
                    <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-3 text-base">
                    <span>Shipping</span>
                    <span>₹0</span>
                </div>
                <div className="flex justify-between mb-3 text-base">
                    <span>Tax</span>
                    <span>₹0</span>
                </div>
                <div className="flex justify-between mb-3 text-base">
                    <span>Discount price</span>
                    <span>₹{discount}</span>
                </div>
                <div className="flex items-center mb-3 text-base">
                    <input
                        type="checkbox"
                        checked={giftBox}
                        disabled
                        className="mr-2 accent-blue-600"
                    />
                    <span>Pack in a Gift Box</span>
                    <span className="ml-auto">₹{giftBox ? giftBoxPrice : "0.00"}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-6 mb-6">
                    <span>Total Price</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <button 
                    onClick={handleContinue}
                    className="w-full bg-blue-600 text-white rounded-xl py-4 font-bold text-lg hover:bg-blue-700 transition"
                >
                    CONTINUE
                </button>
            </div>
        </div>
        </main>
    );
}