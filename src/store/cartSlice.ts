import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, CartState, Product } from "../interface/interface";

const initialState: CartState ={
    items: [] ,
    total: 0
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addProduct(state, action: PayloadAction<{ prod: Product; opts?: Partial<CartItem> }>) {
            const { prod, opts } = action.payload;
            const existing = state.items.find(item => item.prod.id === prod.id);
            if (existing) {
              existing.quantity += 1;
            } else {
              state.items.push({ prod, quantity: 1, ...opts });
            }
            state.total = state.items.reduce((sum, it) => sum + it.prod.price * it.quantity, 0);
          },

        removeProduct(state, action: PayloadAction<number>) {
            const existing = state.items.find(item => item.prod.id === action.payload);
            state.items = state.items.filter(item => item.prod.id !== action.payload);
            if (existing && existing.quantity) {
                state.total = state.total - existing.quantity * existing.prod.price;
            }
        },

        decreaseProduct(state, action: PayloadAction<number>) {
            const existing = state.items.find(item => item.prod.id === action.payload);
            if (existing && existing.quantity) {
                existing.quantity -= 1;
                state.total = state.total - existing.prod.price;
            }
          },

        clearCart(state) {
            state.items = [];
            state.total = 0;
          },

        setCart(state,action: PayloadAction<CartItem[]>){
            state.items = action.payload;
            state.total = action.payload.reduce((sum, it) => sum + it.prod.price * it.quantity, 0);
          }

        
    }
})

export const { addProduct, removeProduct, clearCart , setCart, decreaseProduct} = cartSlice.actions;
export default cartSlice.reducer;