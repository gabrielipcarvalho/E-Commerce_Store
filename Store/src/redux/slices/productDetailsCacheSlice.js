// ./src/redux/slices/productDetailsCacheSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const productDetailsCacheSlice = createSlice({
	name: "productDetailsCache",
	initialState,
	reducers: {
		setProductDetailsCache(state, action) {
			const { productId, product } = action.payload;
			state[productId] = product;
		},
	},
});

export const { setProductDetailsCache } = productDetailsCacheSlice.actions;
export default productDetailsCacheSlice.reducer;
