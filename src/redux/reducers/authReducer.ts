"use client";
import { createSlice } from "@reduxjs/toolkit";
export interface UserAuth {
  token?: string;
  name?: string;
  avata?: string
}
const userToken: UserAuth = {
  token: "",
  avata: '',
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
    removeAuth: (state) => {
      state.data = userToken;
      syncLocal(userToken);
    },
    updateAuth: (state, action) => {
      state.data.token = action.payload.token;
      syncLocal({
        token: action.payload.token,
        name: state.data.name,
        avata: state.data.avata
      });
    },

    updateAuthName: (state, action) => {
      if (state.data) { // Kiểm tra data có tồn tại không
        state.data.name = action.payload.name; // Cập nhật chỉ trường name
        // Đồng bộ lại Local Storage với tên mới
        syncLocal({
          token: state.data.token,
          name: action.payload.name, // Dùng tên mới từ action payload
          avata: state.data.avata
        });
      }
    },
  },
});
export const authReducer = authSlice.reducer;
export const { addAuth, updateAuth, removeAuth, updateAuthName } = authSlice.actions;
export const authSelector = (state: any) => state.authReducer.data;
const syncLocal = (data: UserAuth) => {
  localStorage.setItem("token", JSON.stringify(data));
};
