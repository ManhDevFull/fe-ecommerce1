"use client";
import BackNavigation from "@/components/ui/BackNavigation";
import NavigationPath from "@/components/ui/NavigationPath";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { FaShare } from "react-icons/fa";
import { FaGift } from "react-icons/fa";

export default function ProductConfirmation() {
  const { items: cartItems, giftBox, discount, giftBoxPrice } = useSelector((state: RootState) => state.cart);
  const { customerInfo, selectedPayment, selectedShipping, paymentMethods, shippingMethods } = useSelector((state: RootState) => state.checkout);

  const selectedPaymentMethod = paymentMethods.find(p => p.id === selectedPayment);
  const selectedShippingMethod = shippingMethods.find(s => s.id === selectedShipping);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalPrice = total - discount + (giftBox ? giftBoxPrice : 0);

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
                <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-xl">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-16 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-base">{item.name}</div>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      Color:{" "}
                      <span
                        className="w-4 h-4 rounded-full border"
                        style={{ background: item.color }}
                      ></span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-base">₹{item.price}</div>
                    <div className="text-sm text-gray-500">x{item.qty}</div>
                    <div className="font-semibold text-base">₹{(item.price * item.qty).toFixed(2)}</div>
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
          <button className="w-full bg-blue-600 text-white rounded-xl py-4 font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition">
            <FaGift />
            <span>CONFIRM</span>
          </button>
        </div>
      </div>
    </main>
  );
}
