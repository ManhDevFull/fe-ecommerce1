'use client';
import BackNavigation from "@/components/ui/BackNavigation";
import NavigationPath from "@/components/ui/NavigationPath";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setSelectedPayment, setSelectedShipping, setPaymentMethods, setShippingMethods } from "@/redux/reducers/checkoutReducer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import handleAPI from "@/axios/handleAPI";


export default function ShippingPayments() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { selectedPayment, selectedShipping, paymentMethods, shippingMethods } = useSelector((state: RootState) => state.checkout);
    // Read giDftBox state from cartReducer (set in my-cart page)
    const { giftBox, giftBoxPrice } = useSelector((state: RootState) => state.cart);
    const [loading, setLoading] = useState(true);
    // We read cart summary directly from backend so it's consistent with My Cart page
    const [summary, setSummary] = useState<{ itemsPrice: number; shipping: number; tax: number; discountPrice: number; giftBoxPrice: number; totalPrice: number } | null>(null);

    // Load payment providers, shipping carriers, and cart summary from backend
    useEffect(() => {
        const loadData = async () => {
            try {
                // Load cart summary from backend
                const cartData = await handleAPI<{ items: any[]; summary: any }>(`/Cart`);
                setSummary(cartData.summary);
                
                // Load payment and shipping methods
                const [payments, shippings] = await Promise.all([
                    handleAPI<any[]>('/Shipping/payment-providers'),
                    handleAPI<any[]>('/Shipping/carriers-with-options')
                ]);
                
                if (payments && Array.isArray(payments)) {
                    dispatch(setPaymentMethods(payments.map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        desc: p.desc || '',
                        img: p.img || ''
                    }))));
                }
                
                if (shippings && Array.isArray(shippings)) {
                    dispatch(setShippingMethods(shippings.map((s: any) => ({
                        id: s.id,
                        name: s.name,
                        deliveryTime: s.deliveryTime,
                        shippingCost: s.shippingCost,
                        insurance: s.insurance,
                        img: s.img || ''
                    }))));
                }
            } catch (e: any) {
                console.error('Failed to load shipping/payment data:', e);
                console.error('Error details:', {
                    message: e?.message,
                    status: e?.response?.status,
                    statusText: e?.response?.statusText,
                    url: e?.config?.url,
                    baseURL: e?.config?.baseURL
                });
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [dispatch]);

    const handleContinue = () => {
        router.push('/my-cart/customer-info/shipping-payments/product-confirm');
    };


    return(
        <main className="min-h-screen">
            <BackNavigation />
            <NavigationPath />

            {/* Title */}
            <div className="px-40 pt-6">
                <h1 className="font-bold text-5xl sm:text-6xl text-gray-900 mb-2">Shipping & Payments</h1>
                <p className="text-2xl text-gray-400 font-normal">Choose your shipping method and payment method</p>
            </div>


            {/* Payment & Shipping */}
            <div className="flex flex-col lg:flex-row gap-10 px-8 xl:px-40 mt-10">
                <div className="flex-1">
                    <div className="max-w-[900px]">
                        <div className="flex flex-row gap-[10px]">
                {/* Payment */}
                <div className="flex-1 min-w-0">
                    <div className="font-bold text-lg mb-1">Payment</div>
                    <div className="text-gray-500 text-sm mb-4">Please choose a payment method</div>
                    <div className="flex flex-col gap-4">
                    {loading ? (
                        <div className="text-gray-500">Loading payment methods...</div>
                    ) : paymentMethods.length === 0 ? (
                        <div className="text-gray-500">No payment methods available</div>
                    ) : (
                        paymentMethods.map((item: { id: string; name: string; desc: string; img: string }) => (
                        <label
                        key={item.id}
                        className={`border rounded-lg bg-gray-100 px-6 py-4 cursor-pointer transition
                            ${selectedPayment === item.id ? "border-blue-500 shadow" : "border-gray-200"}
                        `}
                        style={{ width: 410, minWidth: 410, minHeight: 130 }}
                        >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                            <input
                                type="radio"
                                name="payment"
                                checked={selectedPayment === item.id}
                                onChange={() => dispatch(setSelectedPayment(item.id))}
                                className="accent-blue-600 w-5 h-5 mr-3"
                            />
                            <span className="font-semibold text-base">{item.name}</span>
                            </div>
                            {item.img && (
                                <img
                                    src={item.img}
                                    alt={item.name}
                                    className="w-[70px] h-[30px] object-contain bg-white rounded p-1"
                                />
                            )}
                        </div>
                        <div className="text-gray-600 text-sm mt-3 ml-[32px]">{item.desc}</div>
                        </label>
                    ))
                    )}
                    </div>
                </div>


                {/* Shipping */}
                <div className="flex-1 min-w-0">
                    <div className="font-bold text-lg mb-1">Shipping</div>
                    <div className="text-gray-500 text-sm mb-4">Please choose a shipping company based on your region</div>
                    <div className="flex flex-col gap-4">
                    {loading ? (
                        <div className="text-gray-500">Loading shipping methods...</div>
                    ) : shippingMethods.length === 0 ? (
                        <div className="text-gray-500">No shipping methods available</div>
                    ) : (
                        shippingMethods.map((item: { id: string; name: string; deliveryTime: string; shippingCost: string; insurance: string; img: string }) => (
                        <label
                        key={item.id}
                        className={`border rounded-lg bg-gray-100 px-6 py-4 cursor-pointer transition
                            ${selectedShipping === item.id ? "border-blue-500 shadow" : "border-gray-200"}
                        `}
                        style={{ width: 410, minWidth: 410, minHeight: 130 }}
                        >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                            <input
                                type="radio"
                                name="shipping"
                                checked={selectedShipping === item.id}
                                onChange={() => dispatch(setSelectedShipping(item.id))}
                                className="accent-blue-600 w-5 h-5 mr-3"
                            />
                            <span className="font-semibold text-base">{item.name}</span>
                            </div>
                            {item.img && (
                                <img
                                    src={item.img}
                                    alt={item.name}
                                    className="w-[70px] h-[30px] object-contain bg-white rounded p-1"
                                />
                            )}
                        </div>
                        <div className="text-gray-600 text-sm mt-3 ml-[32px]">
                            <div>Delivery time: {item.deliveryTime}</div>
                            <div>Shipping cost: {item.shippingCost}</div>
                            <div>Insurance: {item.insurance}</div>
                        </div>
                        </label>
                    ))
                    )}
                    </div>
                </div>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="w-full lg:w-[350px] bg-white rounded-2xl shadow-xl p-8 h-fit">
                    <h3 className="font-bold text-xl mb-6">Order Summary</h3>
                    {(() => {
                        const price = summary?.itemsPrice ?? 0;
                        const shipping = summary?.shipping ?? 0;
                        const tax = summary?.tax ?? 0;
                        const discount = summary?.discountPrice ?? 0;
                        // Calculate totalPrice: backend totalPrice (without giftBox) + giftBoxPrice if checkbox is checked
                        const baseTotal = summary?.totalPrice ?? 0;
                        const totalPrice = baseTotal + (giftBox ? giftBoxPrice : 0);
                        
                        return (
                            <>
                                <div className="flex justify-between mb-3 text-base">
                                    <span>Price</span>
                                    <span>₹{price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mb-3 text-base">
                                    <span>Shipping</span>
                                    <span>₹{shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mb-3 text-base">
                                    <span>Tax</span>
                                    <span>₹{tax.toFixed(2)}</span>
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
                                    <span className="ml-auto">₹{giftBox ? giftBoxPrice.toFixed(2) : "0.00"}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg mt-6 mb-6">
                                    <span>Total Price</span>
                                    <span>₹{totalPrice.toFixed(2)}</span>
                                </div>
                            </>
                        );
                    })()}
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
