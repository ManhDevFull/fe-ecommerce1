import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  state: string;
  address: string;
  phone: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  desc: string;
  img: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  deliveryTime: string;
  shippingCost: string;
  insurance: string;
  img: string;
}

export interface CheckoutState {
  customerInfo: CustomerInfo;
  selectedPayment: string;
  selectedShipping: string;
  paymentMethods: PaymentMethod[];
  shippingMethods: ShippingMethod[];
}

const initialState: CheckoutState = {
  customerInfo: {
    email: '',
    firstName: '',
    lastName: '',
    country: '',
    state: '',
    address: '',
    phone: '',
  },
  selectedPayment: '1',
  selectedShipping: 'racecouriers',
  paymentMethods: [
    {
      id: "1",
      name: "Momo",
      desc: "PayPal is a trusted online payment platform that allows individuals and businesses to securely send and receive money electronically.",
      img: "https://res.cloudinary.com/do0im8hgv/image/upload/v1758720527/logo-momo-4_i9zroa.png",
    },
    {
      id: "2",
      name: "Mastercard",
      desc: "PayPal is a trusted online payment platform that allows individuals and businesses to securely send and receive money electronically.",
      img: "https://res.cloudinary.com/do0im8hgv/image/upload/v1758719116/f4a67d389658ed882ce0252d0c52f03601d527b4_szny6e.png",
    },
    {
      id: "3",
      name: "Bitcoin",
      desc: "PayPal is a trusted online payment platform that allows individuals and businesses to securely send and receive money electronically.",
      img: "https://res.cloudinary.com/do0im8hgv/image/upload/v1758720602/f0ecfaedbb689ef1fcc40a43cfc57299665ae7ea_u1hodj.png",
    },
  ],
  shippingMethods: [
    {
      id: "ausff",
      name: "AUSFF",
      deliveryTime: "14-21 days",
      shippingCost: "Free",
      insurance: "Unavailable",
      img: "https://res.cloudinary.com/do0im8hgv/image/upload/v1758720527/logo-momo-4_i9zroa.png",
    },
    {
      id: "racecouriers",
      name: "RaceCouriers",
      deliveryTime: "14-21 days",
      shippingCost: "₹10",
      insurance: "Available",
      img: "https://res.cloudinary.com/do0im8hgv/image/upload/v1758720527/logo-momo-4_i9zroa.png",
    },
    {
      id: "transcocargo",
      name: "TranscoCargo",
      deliveryTime: "14-21 days",
      shippingCost: "₹12",
      insurance: "Available",
      img: "https://res.cloudinary.com/do0im8hgv/image/upload/v1758720527/logo-momo-4_i9zroa.png",
    },
  ],
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    updateCustomerInfo: (state, action: PayloadAction<Partial<CustomerInfo>>) => {
      state.customerInfo = { ...state.customerInfo, ...action.payload };
    },
    setSelectedPayment: (state, action: PayloadAction<string>) => {
      state.selectedPayment = action.payload;
    },
    setSelectedShipping: (state, action: PayloadAction<string>) => {
      state.selectedShipping = action.payload;
    },
  },
});

export const { updateCustomerInfo, setSelectedPayment, setSelectedShipping } = checkoutSlice.actions;
export default checkoutSlice.reducer;
