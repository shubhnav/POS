import { configureStore } from '@reduxjs/toolkit';
import printerReducer from './PrinterSlice';
import orderReducer from './cartSlice';

export const store =  configureStore({
  reducer: {
    printer: printerReducer,
    order: orderReducer
  }
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
