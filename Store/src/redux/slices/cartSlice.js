// ./src/redux/slices/cartSlice.js

import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
	items: {},
	totalQuantity: 0,
	totalPrice: 0,
};

// Function to save the cart state to AsyncStorage with a key that includes the user's email
const saveCartToAsyncStorage = async (userEmail, cartState) => {
	try {
		await AsyncStorage.setItem(
			`cart_${userEmail}`,
			JSON.stringify(cartState)
		);
	} catch (error) {
		console.error("Failed to save cart state to AsyncStorage:", error);
	}
};

// Function to load the cart state from AsyncStorage using the user's email
const loadCartFromAsyncStorage = async (userEmail) => {
	try {
		const cart = await AsyncStorage.getItem(`cart_${userEmail}`);
		return cart ? JSON.parse(cart) : initialState;
	} catch (error) {
		console.error("Failed to load cart state from AsyncStorage:", error);
		return initialState;
	}
};

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		addItem(state, action) {
			const { item, userEmail } = action.payload;
			if (item && item.id) {
				if (!state.items[item.id]) {
					state.items[item.id] = { ...item, quantity: 1 };
					state.totalQuantity += 1;
					state.totalPrice += item.price;
				} else {
					state.items[item.id].quantity += 1;
					state.totalQuantity += 1;
					state.totalPrice += item.price;
				}
				saveCartToAsyncStorage(userEmail, state); // Save state after adding item
			} else {
				console.error("Item or item.id is undefined.");
			}
		},
		removeItem(state, action) {
			const { id, userEmail } = action.payload;
			if (id && state.items[id]) {
				if (state.items[id].quantity > 1) {
					state.items[id].quantity -= 1;
					state.totalQuantity -= 1;
					state.totalPrice -= state.items[id].price;
				} else {
					state.totalQuantity -= 1;
					state.totalPrice -= state.items[id].price;
					delete state.items[id];
				}
				saveCartToAsyncStorage(userEmail, state); // Save state after removing item
			} else {
				console.error(
					"Item id is undefined or does not exist in cart."
				);
			}
		},
		clearCart(state, action) {
			const { userEmail } = action.payload;
			state.items = {};
			state.totalQuantity = 0;
			state.totalPrice = 0;
			saveCartToAsyncStorage(userEmail, state); // Save state after clearing cart
		},
		setCartState(state, action) {
			return action.payload;
		},
		resetCartState(state) {
			// Reset cart state including badge count
			state.items = {};
			state.totalQuantity = 0;
			state.totalPrice = 0;
		},
	},
});

export const { addItem, removeItem, clearCart, setCartState, resetCartState } =
	cartSlice.actions;

// Thunk to load the cart state for a specific user using email
export const loadCart = (userEmail) => async (dispatch) => {
	const cartState = await loadCartFromAsyncStorage(userEmail);
	dispatch(setCartState(cartState));
};

// Thunk to save the cart state for a specific user using email
export const saveCart = (userEmail, cartState) => async () => {
	await saveCartToAsyncStorage(userEmail, cartState);
};

export default cartSlice.reducer;
