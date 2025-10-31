"use client";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
export interface UserAuth {
  token?: string;
  name?: string;
  avata?: string;
  email?: string;
  role?: number;
  id?: number;
}
const userToken: UserAuth = {
  token: undefined,
  avata: undefined,
  name: undefined,
  email: undefined,
  role: undefined,
  id: undefined,
};
const authSlice = createSlice({
  name: "auth",
  initialState: {
    data: userToken,
  },
  reducers: {
    addAuth: (state, action: PayloadAction<UserAuth>) => {
      state.data = { ...userToken, ...action.payload };
      syncLocal(state.data);
    },
    removeAuth: (state) => {
      state.data = { ...userToken };
      syncLocal(userToken);
    },
    updateAuth: (state, action: PayloadAction<Pick<UserAuth, "token">>) => {
      state.data = { ...state.data, token: action.payload.token };
      syncLocal(state.data);
    },
  },
});
export const authReducer = authSlice.reducer;
export const { addAuth, updateAuth, removeAuth } = authSlice.actions;
export const authSelector = (state: any) => state.authReducer.data;
const syncLocal = (data: UserAuth) => {
  if (typeof window === "undefined") return;
  if (data && data.token) {
    localStorage.setItem("token", JSON.stringify(data));
  } else {
    localStorage.removeItem("token");
  }
};
