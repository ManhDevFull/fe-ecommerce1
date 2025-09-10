"use client";
import { createSlice } from "@reduxjs/toolkit";
export interface UserAuth {
  token?: string;
  name?: string;
}
const userToken: UserAuth = {
  token: "",
  name: "",
};
const authSlice = createSlice({
  name: "auth",
  initialState: {
    data: userToken,
  },
  reducers: {
    addAuth: (state, action) => {
      state.data = action.payload;
      syncLocal(action.payload);
    },
    removeAuth: (state, _action) => {
      state.data = userToken;
      syncLocal(userToken);
    },
    updateAuth: (state, action) => {
      state.data.token = action.payload.token;
      syncLocal({
        token: action.payload.token,
        name: state.data.name
      });
    },
  },
});
export const authReducer = authSlice.reducer;
export const { addAuth, updateAuth, removeAuth } = authSlice.actions;
export const authSelector = (state: any) => state.authReducer.data;
const syncLocal = (data: any) => {
  localStorage.setItem("token", JSON.stringify(data));
};
