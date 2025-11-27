"use client";
import BackNavigation from "@/components/ui/BackNavigation";
import NavigationPath from "@/components/ui/NavigationPath";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { FaShare } from "react-icons/fa";
import { FaGift } from "react-icons/fa";
import { useEffect, useState } from "react";
import handleAPI from "@/axios/handleAPI";
import { useRouter } from "next/navigation";

export default function ProductConfirmation() {
  const router = useRouter();
  // Read giftBox state from cartReducer (set in my-cart page)
  const { giftBox, giftBoxPrice } = useSelector((state: RootState) => state.cart);
  const { customerInfo, selectedPayment, selectedShipping, paymentMethods, shippingMethods } = useSelector((state: RootState) => state.checkout);
  // We read cart summary directly from backend so it's consistent with My Cart page
  const [summary, setSummary] = useState<{ itemsPrice: number; shipping: number; tax: number; discountPrice: number; giftBoxPrice: number; totalPrice: number } | null>(null);
  const [cartItems, setCartItems] = useState<Array<{ cartId: number; productName: string; imageUrl?: string; color?: string; unitPrice: number; quantity: number }>>([]);
  const [loading, setLoading] = useState(false);

  const selectedPaymentMethod = paymentMethods.find((p: { id: string }) => p.id === selectedPayment);
  const selectedShippingMethod = shippingMethods.find((s: { id: string }) => s.id === selectedShipping);

  // Load cart data from backend
  useEffect(() => {
    (async () => {
      try {
        const data = await handleAPI<{ items: any[]; summary: any }>(`/Cart`);
        setCartItems(data.items || []);
        setSummary(data.summary || null);
      } catch (e) {
        console.error('Failed to load cart data:', e);
      }
    })();
  }, []);

  // Handle CONFIRM button click - Create payment
  const handleConfirm = async () => {
    if (!summary) {
      alert('Please wait for cart data to load');
      return;
    }

    // Calculate total price
    const baseTotal = summary.totalPrice ?? 0;
    const totalPrice = baseTotal + (giftBox ? giftBoxPrice : 0);

    if (totalPrice <= 0) {
      alert('Total price must be greater than 0');
      return;
    }

    // Check if payment method is MoMo
    // if (selectedPaymentMethod?.name?.toLowerCase() !== 'momo') {
    //   alert('Please select MoMo as payment method');
    //   return;
    // }

    setLoading(true);
    try {
      // Convert price to VND (assuming current price is already in VND, or multiply by 1000 if needed)
      // MoMo expects amount in VND (long integer)
      const amountInVND = Math.round(totalPrice * 10); // Convert to VND (if price is in thousands)

      // Create payment request
      const response = await handleAPI<{
        success: boolean;
        orderId: string;
        paymentUrl: string;
        qrCode?: string;
        requestId: string;
        message: string;
      }>('/Payment/create', {
        amount: amountInVND,
        orderInfo: `Payment for order - ${cartItems.length} items`,
        returnUrl: `${window.location.origin}/product-confirmation`
      }, 'post');

      if (response.success && response.paymentUrl) {
        // Redirect to MoMo payment page
        window.location.href = response.paymentUrl;
      } else {
        alert(response.message || 'Failed to create payment');
        setLoading(false);
      }
    } catch (error: any) {
      console.error('Error creating payment - Full error object:', error);
      console.error('Error type:', typeof error);
      console.error('Error keys:', Object.keys(error || {}));
      
      // Try to extract error message from different possible structures
      // Note: axiosClient interceptor returns response?.data || error, so error might be response.data directly
      let errorMessage = 'Failed to create payment. Please try again.';
      
      if (error?.error) {
        // Direct response.data structure (from axiosClient interceptor)
        errorMessage = error.error;
        if (error.details) {
          errorMessage += ` - ${error.details}`;
        }
      } else if (error?.message) {
        // Standard error message
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        // String error
        errorMessage = error;
      } else if (error?.response) {
        // Axios error (if not intercepted)
        errorMessage = error.response.data?.error || 
                      error.response.data?.message || 
                      error.response.statusText || 
                      `HTTP ${error.response.status}`;
      } else {
        // Try to stringify the error
        try {
          const errorStr = JSON.stringify(error);
          if (errorStr !== '{}') {
            errorMessage = errorStr;
          }
        } catch (e) {
          errorMessage = 'Unknown error occurred';
        }
      }
      
      console.error('Final error message:', errorMessage);
      alert(errorMessage);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pb-16">
      <BackNavigation />
      <NavigationPath />

      {/* Header */}
      <div className="px-40 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-5xl sm:text-6xl text-gray-900 mb-2">Product Confirmation</h1>
            <p className="text-2xl text-gray-400 font-normal">Let's create your account</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600 p-2">
            <FaShare className="text-2xl" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 px-8 xl:px-40 mt-10">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Shopping Items */}
          <div className="bg-gray-50 p-6 rounded-2xl">
            <h2 className="font-semibold text-xl mb-4">Shopping items</h2>
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.cartId} className="flex items-center gap-4 bg-white p-4 rounded-xl">
                  <img
                    src={item.imageUrl || ''}
                    alt={item.productName}
                    className="w-16 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-base">{item.productName}</div>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      Color:{" "}
                      <span
                        className="w-4 h-4 rounded-full border"
                        style={{ background: item.color || '#eee' }}
                      ></span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-base">₹{item.unitPrice}</div>
                    <div className="text-sm text-gray-500">x{item.quantity}</div>
                    <div className="font-semibold text-base">₹{(item.unitPrice * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-gray-50 p-6 rounded-2xl">
            <h2 className="font-semibold text-xl mb-4">Payment method</h2>
            <div className="flex items-center justify-between bg-white p-4 rounded-xl">
              <span className="font-semibold text-base">{selectedPaymentMethod?.name}</span>
              {selectedPaymentMethod?.img && (
                <img
                  src={selectedPaymentMethod.img}
                  alt={selectedPaymentMethod.name}
                  className="w-16 h-8 object-contain"
                />
              )}
            </div>
          </div>

          {/* Shipping Company */}
          <div className="bg-gray-50 p-6 rounded-2xl">
            <h2 className="font-semibold text-xl mb-4">Shipping company</h2>
            <div className="flex items-center justify-between bg-white p-4 rounded-xl">
              <span className="font-semibold text-base">{selectedShippingMethod?.name}</span>
              {selectedShippingMethod?.img && (
                <img
                  src={selectedShippingMethod.img}
                  alt={selectedShippingMethod.name}
                  className="w-16 h-8 object-contain"
                />
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-gray-50 p-6 rounded-2xl">
            <h2 className="font-semibold text-xl mb-4">Shipping Address</h2>
            <div className="bg-white p-4 rounded-xl">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Name:</span>
                  <div className="font-medium">{customerInfo.firstName} {customerInfo.lastName}</div>
                </div>
                <div>
                  <span className="text-gray-500">Country:</span>
                  <div className="font-medium">{customerInfo.country}</div>
                </div>
                <div>
                  <span className="text-gray-500">Address:</span>
                  <div className="font-medium">{customerInfo.address}</div>
                </div>
                <div>
                  <span className="text-gray-500">City:</span>
                  <div className="font-medium">{customerInfo.state}</div>
                </div>
                <div>
                  <span className="text-gray-500">Phone:</span>
                  <div className="font-medium">{customerInfo.phone}</div>
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
            onClick={handleConfirm}
            disabled={loading || !summary}
            className="w-full bg-blue-600 text-white rounded-xl py-4 font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <FaGift />
            <span>{loading ? 'Processing...' : 'CONFIRM'}</span>
          </button>
        </div>
      </div>
    </main>
  );
}

