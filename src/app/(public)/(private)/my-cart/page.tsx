"use client";
import BackNavigation from "@/components/ui/BackNavigation";
import NavigationPath from "@/components/ui/NavigationPath";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { toggleGiftBox } from "@/redux/reducers/cartReducer";
import { GoTrash } from "react-icons/go";
import { FiPlus } from "react-icons/fi";
import { HiMiniMinus } from "react-icons/hi2";
import { FaParachuteBox } from "react-icons/fa6";
import { IoCaretBackOutline, IoCaretForwardOutline } from "react-icons/io5";
import { useEffect, useMemo, useState } from "react";
import handleAPI from "@/axios/handleAPI";



type Suggestion = {
  productId: number;
  productName: string;
  imageUrl?: string;
  minPrice: number;
  oldPrice?: number | null;
  discountPercent?: number | null;
  categoryName: string;
};
const SUGGEST_PAGE_SIZE = 12;
const SLIDE_STEP = 4;

type CartItemApi = {
  cartId: number;
  accountId: number;
  variantId: number;
  productId: number;
  productName: string;
  imageUrl?: string;
  color?: string;
  unitPrice: number;
  quantity: number;
};

type CartSummaryApi = {
  itemsPrice: number;
  shipping: number;
  tax: number;
  discountPrice: number;
  giftBoxPrice: number;
  totalPrice: number;
};

type CartResponseApi = {
  items: CartItemApi[];
  summary: CartSummaryApi;
};

export default function MyCart() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { giftBox, giftBoxPrice } = useSelector((state: RootState) => state.cart);

  const [items, setItems] = useState<CartItemApi[]>([]);
  const [summary, setSummary] = useState<CartSummaryApi | null>(null);
  // Suggestions state
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggestOffset, setSuggestOffset] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0); // index of first visible card
  const [loadingSuggest, setLoadingSuggest] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await handleAPI<CartResponseApi>(`/Cart`);
      setItems(res.items || []);
      setSummary(res.summary || null);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSuggestions = async (offset: number, excludeIds: number[] = []) => {
    try {
      setLoadingSuggest(true);
      const query = new URLSearchParams();
      query.set('offset', String(offset));
      query.set('limit', String(SUGGEST_PAGE_SIZE));
      if (excludeIds.length) query.set('exclude', excludeIds.join(','));
      const data = await handleAPI<Suggestion[]>(`/Cart/suggestions?${query.toString()}`);
      if (Array.isArray(data) && data.length) {
        // de-dup on FE just in case
        const existing = new Set(suggestions.map(s => s.productId));
        const merged = [...suggestions];
        data.forEach(d => { if (!existing.has(d.productId)) merged.push(d); });
        setSuggestions(merged);
        setSuggestOffset(offset + SUGGEST_PAGE_SIZE);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSuggest(false);
    }
  };

  useEffect(() => {
    fetchCart();
    // initial suggestions
    fetchSuggestions(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleQtyChange = async (cartId: number, delta: number) => {
    const current = items.find(i => i.cartId === cartId);
    if (!current) return;
    const nextQty = Math.max(1, current.quantity + delta);
    try {
      const res = await handleAPI<CartResponseApi>(`/Cart/quantity`, { cartId, quantity: nextQty }, 'patch');
      setItems(res.items || []);
      setSummary(res.summary || null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemove = async (cartId: number) => {
    try {
      const res = await handleAPI<CartResponseApi>(`/Cart/${cartId}`, undefined, 'delete');
      setItems(res.items || []);
      setSummary(res.summary || null);
    } catch (e) {
      console.error(e);
    }
  };

  const onSlideRight = async () => {
    const nextIndex = Math.min(slideIndex + SLIDE_STEP, Math.max(0, suggestions.length - SLIDE_STEP));
    setSlideIndex(nextIndex);
    // If we are about to expose items beyond what we have (approaching end), prefetch more
    if (nextIndex + SLIDE_STEP * 2 > suggestions.length && !loadingSuggest) {
      const excludeIds = suggestions.map(s => s.productId);
      await fetchSuggestions(suggestOffset, excludeIds);
    }
  };

  const onSlideLeft = () => {
    setSlideIndex(Math.max(0, slideIndex - SLIDE_STEP));
  };

  const total = useMemo(() => summary?.itemsPrice ?? 0, [summary]);
  const discount = useMemo(() => summary?.discountPrice ?? 0, [summary]);
  const totalPrice = useMemo(() => {
    const base = (summary?.totalPrice ?? total) - (summary?.giftBoxPrice ? 0 : 0);
    return base + (giftBox ? giftBoxPrice : 0);
  }, [summary, total, giftBox, giftBoxPrice]);

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
            Number of Items <span className="text-gray-400">{items.length}</span>
          </h2>
          <div className="space-y-6">
            {items.map(item => (
              <div
                key={item.cartId}
                className="flex items-center gap-6 bg-white p-5 rounded-2xl shadow-md"
              >
                <img
                  src={item.imageUrl || ''}
                  alt={item.productName}
                  className="w-[60px] h-[73px] object-cover rounded-xl border"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[15px] truncate">{item.productName}</div>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    Color:{" "}
                    <span
                      className="w-4 h-4 rounded-full border"
                      style={{ background: item.color || '#eee' }}
                    ></span>
                  </div>
                </div>
                <div className="w-24 text-center font-medium text-base">₹{item.unitPrice}</div>
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleQtyChange(item.cartId, -1)}
                    className="px-3 py-1 text-xl font-bold hover:bg-gray-100"
                  >
                    <HiMiniMinus />
                  </button>
                  <span className="px-4 py-1">{item.quantity}</span>
                  <button
                    onClick={() => handleQtyChange(item.cartId, 1)}
                    className="px-3 py-1 text-xl font-bold hover:bg-gray-100"
                  >
                    <FiPlus />
                  </button>
                </div>
                <div className="w-24 text-center font-medium text-base">
                  ₹{(item.unitPrice * item.quantity).toFixed(2)}
                </div>
                <button
                  onClick={() => handleRemove(item.cartId)}
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
            <span>₹{summary?.shipping?.toFixed(2) ?? '0.00'}</span>
          </div>
          <div className="flex justify-between mb-3 text-base">
            <span>Tax</span>
            <span>₹{summary?.tax?.toFixed(2) ?? '0.00'}</span>
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
            <button onClick={onSlideLeft} className="flex-1 flex items-center justify-center text-xl text-gray-300 hover:bg-gray-100"
                    style={{borderRight: '1px solid #E5E7EB'}}>
                <span><IoCaretBackOutline /></span>
            </button>
            <button onClick={onSlideRight} className="flex-1 flex items-center justify-center text-xl text-gray-800 hover:bg-gray-100">
                <span><IoCaretForwardOutline /></span>
            </button>
            </div>
        </div>
        <div className="flex gap-6.5 overflow-x-auto pb-2">
            {suggestions.slice(slideIndex, slideIndex + 4).map(item => (
            <div
                key={item.productId}
                className="flex bg-white rounded-lg min-w-[280px] max-w-[160px] p-2 shadow-md"
            >
                <img
                src={item.imageUrl || ''}
                alt={item.productName}
                className="w-28 h-24 object-cover rounded-md bg-gray-50"
                />  
                <div className="flex flex-col justify-between flex-1 pl-3">
                <div>
                    <div className="font-semibold text-xs mb-1">{item.productName}</div>
                    <div className="flex items-center gap-1 mb-1">
                    <span className="text-red-500 font-bold text-sm">₹{item.minPrice}</span>
                    {item.oldPrice ? (
                      <span className="line-through text-gray-400 text-xs">₹{item.oldPrice}</span>
                    ) : null}
                    {item.discountPercent ? (
                      <span className="bg-[#FF5722] text-white text-[10px] px-1 py-0.5 rounded ml-1">-{item.discountPercent}%</span>
                    ) : null}
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