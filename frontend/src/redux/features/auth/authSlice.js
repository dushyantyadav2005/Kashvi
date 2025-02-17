import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  isVerified: localStorage.getItem("isVerified")
    ? JSON.parse(localStorage.getItem("isVerified"))
    : false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      try {
        state.userInfo = action.payload.userInfo;
        localStorage.setItem("userInfo", JSON.stringify(action.payload.userInfo));
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    },
    logout: (state) => {
      state.userInfo = null;
      state.isVerified = false;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("isVerified");
    },
    setVerified: (state, action) => {
      try {
        state.isVerified = Boolean(action.payload);
        localStorage.setItem("isVerified", String(action.payload));
      } catch (error) {
        console.error('Failed to save verification status:', error);
      }
    },
  },
});

export const { setCredentials, logout, setVerified } = authSlice.actions;
export default authSlice.reducer;