// ./src/redux/slices/authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { resetCartState, loadCart, saveCart } from "./cartSlice";
import { resetOrdersState } from "./ordersSlice";

const initialState = {
	token: null,
	user: null,
	status: "idle",
	error: null,
};

const BASE_URL = "http://172.20.10.2:3000";

export const signUp = createAsyncThunk(
	"auth/signUp",
	async (userData, thunkAPI) => {
		try {
			const response = await axios.post(
				`${BASE_URL}/users/signup`,
				userData
			);
			return response.data;
		} catch (error) {
			console.error("SignUp Error Response:", error.response);
			return thunkAPI.rejectWithValue(
				error.response?.data || { message: "Unknown error" }
			);
		}
	}
);

export const signIn = createAsyncThunk(
	"auth/signIn",
	async (userData, thunkAPI) => {
		try {
			const response = await axios.post(
				`${BASE_URL}/users/signin`,
				userData
			);
			return response.data;
		} catch (error) {
			console.error("SignIn Error Response:", error.response);
			return thunkAPI.rejectWithValue(
				error.response?.data || { message: "Unknown error" }
			);
		}
	}
);

export const updateUserProfile = createAsyncThunk(
	"auth/updateUserProfile",
	async (userData, thunkAPI) => {
		const { token } = thunkAPI.getState().auth;
		try {
			const response = await axios.post(
				`${BASE_URL}/users/update`,
				userData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			return response.data;
		} catch (error) {
			console.error("UpdateUserProfile Error Response:", error.response);
			return thunkAPI.rejectWithValue(
				error.response?.data || { message: "Unknown error" }
			);
		}
	}
);

export const logInUser = createAsyncThunk(
	"auth/logInUser",
	async (userData, thunkAPI) => {
		const result = await thunkAPI.dispatch(signIn(userData));
		if (result.payload && result.payload.token) {
			const userEmail = result.payload.email; // Access the correct field
			if (userEmail) {
				await thunkAPI.dispatch(loadCart(userEmail));
			} else {
				console.error("User email is undefined after login");
			}
		}
		return result.payload;
	}
);

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setToken(state, action) {
			state.token = action.payload.token;
			state.user = action.payload.user;
		},
		clearToken(state) {
			state.token = null;
			state.user = null;
			state.status = "idle";
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(signUp.fulfilled, (state, action) => {
				state.token = action.payload.token;
				state.user = {
					id: action.payload.id, // Added
					name: action.payload.name, // Added
					email: action.payload.email, // Added
				};
				state.status = "succeeded";
				state.error = null;
			})
			.addCase(signUp.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
				console.error("SignUp Rejected Error:", action.payload);
			})
			.addCase(signIn.fulfilled, (state, action) => {
				state.token = action.payload.token;
				state.user = {
					id: action.payload.id, // Added
					name: action.payload.name, // Added
					email: action.payload.email, // Added
				};
				state.status = "succeeded";
				state.error = null;
			})
			.addCase(signIn.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
				console.error("SignIn Rejected Error:", action.payload);
			})
			.addCase(updateUserProfile.fulfilled, (state, action) => {
				state.user = { ...state.user, ...action.payload };
				state.status = "succeeded";
				state.error = null;
			})
			.addCase(updateUserProfile.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
				console.error(
					"UpdateUserProfile Rejected Error:",
					action.payload
				);
			});
	},
});

export const { setToken, clearToken } = authSlice.actions;

// Thunk to log out the user and clear the cart and orders state
export const logOutUser = () => async (dispatch, getState) => {
	const userEmail = getState().auth.user?.email;
	const cartState = getState().cart;

	dispatch(clearToken()); // Clear token and user state immediately
	dispatch(resetCartState());
	dispatch(resetOrdersState());

	if (userEmail) {
		await dispatch(saveCart(userEmail, cartState)); // Save cart state after clearing user state
	} else {
		console.error("User email is undefined during logout");
	}
};

export default authSlice.reducer;
