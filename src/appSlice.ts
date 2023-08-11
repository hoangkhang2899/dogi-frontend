import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { TProduct } from "types/product";
import { TTopping } from "types/topping";

type TOrderProduct = {
  product: TProduct;
  topping: TTopping[];
  /**
   * Index of array attribute product
   */
  attribute: number;
  amount: number;
  price: number;
};

type OrderState = {
  orderProduct?: TProduct;
  attributeIndex?: number;
  orderAmount: number;
};

type AppState = {
  isOrder: boolean;
  product: TProduct[];
  topping: TTopping[];
  order: TOrderProduct[];
} & OrderState;

const initialState: AppState = {
  isOrder: false,
  orderAmount: 1,
  product: [],
  topping: [],
  order: [],
};

const resetOrderState = (state: AppState): void => {
  state.orderProduct = undefined;
  state.attributeIndex = undefined;
  state.orderAmount = 1;
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setOrder: (state, action: PayloadAction<false | TProduct>) => {
      if (action.payload === false) {
        state.isOrder = false;
        resetOrderState(state);
      } else {
        state.isOrder = true;
        state.orderProduct = action.payload;
      }
    },
    setProduct: (state, action: PayloadAction<TProduct[]>) => {
      state.product = action.payload;
    },
    updateProduct: (state, action: PayloadAction<TProduct>) => {
      const index = state.product.findIndex(
        (v) => v._id === action.payload._id
      );
      state.product[index] = action.payload;
    },
    updateProductAmount: (
      state,
      action: PayloadAction<{ _id: string; amount: number }>
    ) => {
      const index = state.product.findIndex(
        (v) => v._id === action.payload._id
      );
      state.product[index].amount = action.payload.amount;
    },
    insertProduct: (state, action: PayloadAction<TProduct>) => {
      state.product.push(action.payload);
    },
    removeProduct: (state, action: PayloadAction<number>) => {
      state.product.splice(action.payload, 1);
    },
    setTopping: (state, action: PayloadAction<TTopping[]>) => {
      state.topping = action.payload;
    },
    insertOrder: (state, action: PayloadAction<TOrderProduct>) => {
      state.order.push(action.payload);
    },
    cloneOrder: (state, action: PayloadAction<number>) => {
      state.order.splice(action.payload, 0, state.order[action.payload]);
    },
    removeOrder: (state, action: PayloadAction<number>) => {
      state.order.splice(action.payload, 1);
    },
    clearOrder: (state) => {
      state.order = [];
    },
    incrementAmount: (state) => {
      state.orderAmount += 1;
    },
    decrementAmount: (state) => {
      if (state.orderAmount > 1) state.orderAmount -= 1;
      else state.orderAmount = 1;
    },
    setOrderSize: (state, action: PayloadAction<number>) => {
      state.attributeIndex = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setOrder,
  setProduct,
  updateProduct,
  updateProductAmount,
  insertProduct,
  removeProduct,
  setTopping,
  insertOrder,
  cloneOrder,
  removeOrder,
  clearOrder,
  incrementAmount,
  decrementAmount,
  setOrderSize,
} = appSlice.actions;

export default appSlice.reducer;
