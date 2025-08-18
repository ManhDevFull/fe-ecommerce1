import { createSlice } from "@reduxjs/toolkit";


export interface AuthState {
	token: string;
	_id: string;
	name: string;
}
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    data: {
      accesstoken: '',
      _id: '',
      name:''
    }
  },
  reducers: {
    addAuth: (state, action) => {
      state.data = action.payload
    },
    removeAuth: (state, _action) => {
      state.data = {
        accesstoken: '',
        _id: '',
        name:''
      }
    }
  }
})
export const authReducer = authSlice.reducer
export const { addAuth, removeAuth } = authSlice.actions
export const authSelector = (state: any) => state.authReducer.data

