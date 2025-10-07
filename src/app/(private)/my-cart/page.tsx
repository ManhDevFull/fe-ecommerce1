"use client";
import BackNavigation from "@/components/ui/BackNavigation";
import NavigationPath from "@/components/ui/NavigationPath";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { updateQuantity, removeItem, toggleGiftBox } from "@/redux/reducers/cartReducer";
import { GoTrash } from "react-icons/go";
import { FiPlus } from "react-icons/fi";
import { HiMiniMinus } from "react-icons/hi2";
import { FaParachuteBox } from "react-icons/fa6";
import { IoCaretBackOutline, IoCaretForwardOutline } from "react-icons/io5";



const suggestions = [
  {
    id: 101,
    name: "SHORT PRINTED DRESS",
    img: "https://res.cloudinary.com/do0im8hgv/image/upload/v1757728057/ea3860bdc030cccc6452ddae27372b671b93dbb8_g4y0es.jpg",
    price: 69.99,
    oldPrice: 129.99,
    discount: 40,
    currency: "₹",
  },
  {
    id: 102,
    name: "SHORT PRINTED DRESS",
    img: "https://res.cloudinary.com/do0im8hgv/image/upload/v1757728057/08d2b49da07b42957ca790c064196bf5bb9e1954_gtuthq.jpg",
    price: 69.99,
    oldPrice: 129.99,
    discount: 40,
    currency: "₹",
  },
  {
    id: 103,
    name: "SHORT PRINTED DRESS",
    img: "https://res.cloudinary.com/do0im8hgv/image/upload/v1757728057/dbf9a533f9d5174a84263385544bc0ba381e415d_phmpyc.jpg",
    price: 69.99,
    oldPrice: 129.99,
    discount: 40,
    currency: "₹",
  },
  {
    id: 104,
    name: "SHORT PRINTED DRESS",
    img: "https://res.cloudinary.com/do0im8hgv/image/upload/v1757728057/4740b6c4eae4e6ff9e65423ca8313315efb0a86c_mmfhbt.jpg",
    price: 69.99,
    oldPrice: 129.99,
    discount: 40,
    currency: "₹",
  },
];

export default function MyCart() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { items: cartItems, giftBox, discount, giftBoxPrice } = useSelector((state: RootState) => state.cart);

  const handleQtyChange = (id: number, delta: number) => {
    dispatch(updateQuantity({ id, delta }));
  };

  const handleRemove = (id: number) => {
    dispatch(removeItem(id));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalPrice = total - discount + (giftBox ? giftBoxPrice : 0);

  return (
    <main className="min-h-screen pb-16">
      <BackNavigation />
      <NavigationPath />

      {/* Title */}
      <div className="px-40 pt-6">
        <h1 className="font-bold text-5xl sm:text-6xl text-gray-900 mb-2">My Cart</h1>
        <p className="text-2xl text-gray-400 font-normal">Let's create your account</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 px-8 xl:px-40 mt-10">
        {/* Cart List */}
        <div className="flex-1">
          <h2 className="font-semibold text-xl mb-6">
            Number of Items <span className="text-gray-400">{cartItems.length}</span>
          </h2>
          <div className="space-y-6">
            {cartItems.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-6 bg-white p-5 rounded-2xl shadow-md"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-[60px] h-[73px] object-cover rounded-xl border"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[15px] truncate">{item.name}</div>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    Color:{" "}
                    <span
                      className="w-4 h-4 rounded-full border"
                      style={{ background: item.color }}
                    ></span>
                  </div>
                </div>
                <div className="w-24 text-center font-medium text-base">₹{item.price}</div>
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleQtyChange(item.id, -1)}
                    className="px-3 py-1 text-xl font-bold hover:bg-gray-100"
                  >
                    <HiMiniMinus />
                  </button>
                  <span className="px-4 py-1">{item.qty}</span>
                  <button
                    onClick={() => handleQtyChange(item.id, 1)}
                    className="px-3 py-1 text-xl font-bold hover:bg-gray-100"
                  >
                    <FiPlus />
                  </button>
                </div>
                <div className="w-24 text-center font-medium text-base">
                  ₹{(item.price * item.qty).toFixed(2)}
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-gray-400 hover:text-red-500 p-2 text-2xl"
                  title="Remove"
                >
                  <GoTrash />
                </button>
              </div>
            ))}
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
              onChange={() => dispatch(toggleGiftBox())}
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
            onClick={() => router.push('/my-cart/customer-info')}
            className="w-full bg-blue-600 text-white rounded-xl py-4 font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition"
          >
            <span>SHOP NOW</span>
            <span role="img" aria-label="cart"><FaParachuteBox /></span>
          </button>
        </div>
      </div>

      {/* Suggestions */}
      <div className="mt-12 px-8 xl:px-40">
        <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-base sm:text-lg">YOU MIGHT ALSO LIKE</h4>
            <div className="flex border rounded-lg overflow-hidden w-[80px] h-10 bg-white"
                  style={{borderColor: '#D1D5DB'}}>
            <button className="flex-1 flex items-center justify-center text-xl text-gray-300 hover:bg-gray-100"
                    style={{borderRight: '1px solid #E5E7EB'}}>
                <span><IoCaretBackOutline /></span>
            </button>
            <button className="flex-1 flex items-center justify-center text-xl text-gray-800 hover:bg-gray-100">
                <span><IoCaretForwardOutline /></span>
            </button>
            </div>
        </div>
        <div className="flex gap-6.5 overflow-x-auto pb-2">
            {suggestions.map(item => (
            <div
                key={item.id}
                className="flex bg-white rounded-lg min-w-[280px] max-w-[160px] p-2 shadow-md"
            >
                <img
                src={item.img}
                alt={item.name}
                className="w-28 h-24 object-cover rounded-md bg-gray-50"
                />  
                <div className="flex flex-col justify-between flex-1 pl-3">
                <div>
                    <div className="font-semibold text-xs mb-1">{item.name}</div>
                    <div className="flex items-center gap-1 mb-1">
                    <span className="text-red-500 font-bold text-sm">{item.currency}{item.price}</span>
                    <span className="line-through text-gray-400 text-xs">{item.currency}{item.oldPrice}</span>
                    <span className="bg-[#FF5722] text-white text-[10px] px-1 py-0.5 rounded ml-1">-{item.discount}%</span>
                    </div>
                </div>
                <div className="flex items-center gap-1 mt-1">
                    <button className="flex-1 border rounded px-2 py-0.5 text-xs font-medium hover:bg-gray-100 transition">
                    Add to cart
                    </button>
                </div>
                </div>
            </div>
            ))}
        </div>
        </div>
    </main>
  );
}