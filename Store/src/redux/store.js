// ./src/redux/store.js

import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import productCacheReducer from "./slices/productCacheSlice";
import categoryReducer from "./slices/categorySlice";
import productDetailsCacheReducer from "./slices/productDetailsCacheSlice";
import ordersReducer from "./slices/ordersSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
	reducer: {
		cart: cartReducer,
		productCache: productCacheReducer,
		category: categoryReducer,
		productDetailsCache: productDetailsCacheReducer,
		orders: ordersReducer,
		auth: authReducer,
	},
});
