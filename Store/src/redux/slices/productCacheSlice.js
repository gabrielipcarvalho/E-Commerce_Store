// ./src/redux/slices/productCacheSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const productCacheSlice = createSlice({
	name: "productCache",
	initialState,
	reducers: {
		setProductCache(state, action) {
			const { category, products } = action.payload;
			state[category] = products;
		},
	},
});

export const { setProductCache } = productCacheSlice.actions;
export default productCacheSlice.reducer;
