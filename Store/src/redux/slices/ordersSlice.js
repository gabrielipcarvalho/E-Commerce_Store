// ./src/redux/slices/ordersSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
	orders: [],
	status: "idle",
	error: null,
};

const SERVER_URL = "http://localhost:3000";

export const fetchOrders = createAsyncThunk(
	"orders/fetchOrders",
	async ({ token }) => {
		const response = await axios.get(`${SERVER_URL}/orders/all`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data.orders;
	}
);

export const updateOrderStatus = createAsyncThunk(
	"orders/updateOrderStatus",
	async ({ orderId, isPaid, isDelivered, token }) => {
		const response = await axios.post(
			`${SERVER_URL}/orders/updateorder`,
			{
				orderID: orderId,
				isPaid,
				isDelivered,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;
	}
);

export const createOrder = createAsyncThunk(
	"orders/createOrder",
	async ({ items, token, userEmail }) => {
		const response = await axios.post(
			`${SERVER_URL}/orders/neworder`,
			{ items, userEmail },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		const augmentedOrder = {
			id: response.data.id,
			status: response.data.status,
			order_items: JSON.stringify(items),
			total_price: items.reduce(
				(sum, item) => sum + item.price * item.quantity,
				0
			),
			item_numbers: items.length,
			is_paid: 0,
			is_delivered: 0,
			created_at: new Date().toISOString(),
		};

		return augmentedOrder;
	}
);

const ordersSlice = createSlice({
	name: "orders",
	initialState,
	reducers: {
		resetOrdersState() {
			return initialState;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchOrders.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchOrders.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.orders = action.payload;
			})
			.addCase(fetchOrders.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(updateOrderStatus.fulfilled, (state, action) => {
				const { orderID, isPaid, isDelivered } = action.meta.arg;
				const existingOrder = state.orders.find(
					(order) => order.id === orderID
				);
				if (existingOrder) {
					existingOrder.is_paid = isPaid;
					existingOrder.is_delivered = isDelivered;
				}
			})
			.addCase(createOrder.fulfilled, (state, action) => {
				if (action.payload && action.payload.status === "OK") {
					const newOrder = {
						...action.payload,
						is_paid: 0,
						is_delivered: 0,
					};
					state.orders.push(newOrder);
				}
			});
	},
});

export const { resetOrdersState } = ordersSlice.actions;
export default ordersSlice.reducer;
