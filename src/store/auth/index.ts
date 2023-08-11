import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { TOKEN_NAME } from "constant";

type AuthState = {
  status: "AUTH" | "UNAUTH";
  username: string;
  fullname: string;
  role: string;
};

const initialState: AuthState = {
  status: "UNAUTH",
  username: "",
  fullname: "",
  role: "",
};
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateAuth: (state, action: PayloadAction<Omit<AuthState, "status">>) => {
      return { ...action.payload, status: "AUTH" };
    },
    removeAuth: (state) => {
      sessionStorage.removeItem(TOKEN_NAME);
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateAuth, removeAuth } = authSlice.actions;
