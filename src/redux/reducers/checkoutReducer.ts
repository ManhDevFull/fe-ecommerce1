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
  selectedPayment: '',
  selectedShipping: '',
  paymentMethods: [],
  shippingMethods: [],
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
    setPaymentMethods: (state, action: PayloadAction<PaymentMethod[]>) => {
      state.paymentMethods = action.payload;
      if (state.paymentMethods.length > 0 && !state.selectedPayment) {
        state.selectedPayment = state.paymentMethods[0].id;
      }
    },
    setShippingMethods: (state, action: PayloadAction<ShippingMethod[]>) => {
      state.shippingMethods = action.payload;
      if (state.shippingMethods.length > 0 && !state.selectedShipping) {
        state.selectedShipping = state.shippingMethods[0].id;
      }
    },
  },
});

export const { 
  updateCustomerInfo, 
  setSelectedPayment, 
  setSelectedShipping, 
  setPaymentMethods, 
  setShippingMethods 
} = checkoutSlice.actions;

export default checkoutSlice.reducer;

