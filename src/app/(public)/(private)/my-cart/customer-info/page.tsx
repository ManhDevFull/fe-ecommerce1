"use client";
import BackNavigation from "@/components/ui/BackNavigation";
import NavigationPath from "@/components/ui/NavigationPath";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { updateCustomerInfo } from "@/redux/reducers/checkoutReducer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import handleAPI from "@/axios/handleAPI";

// Only Vietnam is needed for this project
const countries = [
  { code: "VN", name: "Vietnam", flag: "vn" },
];

export default function CustomerInfo() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { customerInfo } = useSelector((state: RootState) => state.checkout);
    // Read giftBox state from cartReducer (set in my-cart page)
    const { giftBox, giftBoxPrice } = useSelector((state: RootState) => state.cart);
    // We read cart summary directly from backend so it's consistent with My Cart page
    const [summary, setSummary] = useState<{ itemsPrice: number; shipping: number; tax: number; discountPrice: number; giftBoxPrice: number; totalPrice: number } | null>(null);
    const [stateOpen, setStateOpen] = useState(false);
    const [vnProvinces, setVnProvinces] = useState<{ code: string; name: string }[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    
    // Simple custom dropdown for provinces with controlled height
    const ProvinceSelect = () => (
      <div className="relative">
        <button
          type="button"
          className={`w-full h-10 border rounded px-3 text-left bg-white ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
          onClick={() => setStateOpen(o => !o)}
        >
          {customerInfo.state || 'Select province/city'}
        </button>
        {stateOpen && (
          <div
            className="absolute z-20 mt-1 w-full border border-gray-200 bg-white rounded shadow-lg max-h-64 overflow-y-auto"
            onMouseLeave={() => setStateOpen(false)}
          >
            <div className="py-1">
              {vnProvinces.map(s => (
                <div
                  key={s.code}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => { handleInputChange('state', s.name); setStateOpen(false); }}
                >
                  {s.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
    
    const handleInputChange = (field: string, value: string) => {
        dispatch(updateCustomerInfo({ [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!customerInfo.email || customerInfo.email.trim() === '') {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!customerInfo.firstName || customerInfo.firstName.trim() === '') {
            newErrors.firstName = 'First name is required';
        }

        if (!customerInfo.lastName || customerInfo.lastName.trim() === '') {
            newErrors.lastName = 'Last name is required';
        }

        if (!customerInfo.state || customerInfo.state.trim() === '') {
            newErrors.state = 'State/Region is required';
        }

        if (!customerInfo.address || customerInfo.address.trim() === '') {
            newErrors.address = 'Address is required';
        }

        if (!customerInfo.phone || customerInfo.phone.trim() === '') {
            newErrors.phone = 'Phone number is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const price = summary?.itemsPrice ?? 0;
    const shipping = summary?.shipping ?? 0;
    const tax = summary?.tax ?? 0;
    const discount = summary?.discountPrice ?? 0;
    // Calculate totalPrice: backend totalPrice (without giftBox) + giftBoxPrice if checkbox is checked
    // Backend returns totalPrice without giftBox, so we add it if giftBox is true
    const baseTotal = summary?.totalPrice ?? 0;
    const totalPrice = baseTotal + (giftBox ? giftBoxPrice : 0);

    const handleContinue = () => {
        if (validateForm()) {
            router.push('/my-cart/customer-info/shipping-payments');
        }
    };

    // On first render: load order summary and Vietnam provinces
    useEffect(() => {
        // load current cart summary from backend
        (async () => {
            try {
                const data = await handleAPI<{ items: any[]; summary: any }>(`/Cart`);
                setSummary(data.summary);
            } catch (e) {
                // ignore; UI stays empty if not logged in
            }
        })();
        // Ensure country is preset to VN once
        if (!customerInfo.country) {
            dispatch(updateCustomerInfo({ country: 'VN' }));
        }
        let mounted = true;
        (async () => {
            try {
                // Dynamic import keeps bundle small (only load on this page)
                const { getProvinces } = await import('sub-vn');
                const provinces = getProvinces().map((p: any) => ({ code: p.code, name: p.name }));
                if (mounted) setVnProvinces(provinces);
            } catch (e) {
                // Silent fail: user can still type state manually if needed
            }
        })();
        return () => { mounted = false };
    }, [dispatch, customerInfo.country]);

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
                className={`w-full h-10 border rounded px-3 mb-1 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                style={{ width: 850, maxWidth: "100%" }}
                placeholder="Enter your email"
                value={customerInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-sm mb-3">{errors.email}</p>}

            <div className="flex gap-4 mb-4">
                <div className="flex-1">
                <label className="block text-sm mb-1">First Name</label>
                <input
                    type="text"
                    className={`w-full h-10 border rounded px-3 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="First Name"
                    value={customerInfo.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div className="flex-1">
                <label className="block text-sm mb-1">Last Name</label>
                <input
                    type="text"
                    className={`w-full h-10 border rounded px-3 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Last Name"
                    value={customerInfo.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
            </div>

            {/* Country is fixed to Vietnam per requirements */}
            <label className="block text-sm mb-1">Country</label>
            <select 
                className="w-full h-10 border border-gray-300 rounded px-3 mb-4 bg-gray-100 cursor-not-allowed"
                value={customerInfo.country || 'VN'}
                disabled
            >
              {countries.map(c => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* State/Region options loaded from sub-vn */}
            <label className="block text-sm mb-1">State/Region</label>
            <div className="mb-1">
              <ProvinceSelect />
            </div>
            {errors.state && <p className="text-red-500 text-sm mb-3">{errors.state}</p>}

            <label className="block text-sm mb-1">Address</label>
            <input
                type="text"
                className={`w-full h-10 border rounded px-3 mb-1 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Address"
                value={customerInfo.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
            />
            {errors.address && <p className="text-red-500 text-sm mb-3">{errors.address}</p>}

            <label className="block text-sm mb-1">Phone Number</label>
            <input
                type="text"
                className={`w-full h-10 border rounded px-3 mb-1 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Phone Number"
                value={customerInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
            />
            {errors.phone && <p className="text-red-500 text-sm mb-2">{errors.phone}</p>}
            </form>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-[350px] bg-white rounded-2xl shadow-xl p-8 h-fit">
                <h3 className="font-bold text-xl mb-6">Order Summary</h3>
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