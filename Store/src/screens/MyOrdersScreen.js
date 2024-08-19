// ./src/screens/MyOrdersScreen.js

import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	SectionList,
	TouchableOpacity,
	StyleSheet,
	Image,
	Button,
	Alert,
	SafeAreaView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders, updateOrderStatus } from "../redux/slices/ordersSlice";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import RequireAuth from "../components/RequireAuth";

const MyOrdersScreen = ({ navigation }) => {
	const dispatch = useDispatch();
	const orders = useSelector((state) => state.orders.orders);
	const token = useSelector((state) => state.auth.token);
	const [expandedOrders, setExpandedOrders] = useState({});
	const [expandedSections, setExpandedSections] = useState({
		newOrders: false,
		paidOrders: false,
		deliveredOrders: false,
	});

	useEffect(() => {
		if (token) {
			dispatch(fetchOrders({ token }));
		}
	}, [dispatch, token]);

	useFocusEffect(
		React.useCallback(() => {
			if (token) {
				dispatch(fetchOrders({ token }));
			}
		}, [dispatch, token])
	);

	const toggleOrder = (orderId) => {
		setExpandedOrders((prev) => ({
			...prev,
			[orderId]: !prev[orderId],
		}));
	};

	const toggleSection = (sectionKey) => {
		setExpandedSections((prev) => ({
			...prev,
			[sectionKey]: !prev[sectionKey],
		}));
	};

	const handleStatusChange = async (orderId, status) => {
		try {
			let isPaid = 0;
			let isDelivered = 0;
			if (status === "paid") {
				isPaid = 1;
			} else if (status === "delivered") {
				isPaid = 1;
				isDelivered = 1;
			}

			const payload = { orderId, isPaid, isDelivered, token };
			const response = await dispatch(updateOrderStatus(payload));

			if (
				response &&
				response.payload &&
				response.payload.status === "OK"
			) {
				Alert.alert("Order Status", `Your order is now ${status}.`);
				dispatch(fetchOrders({ token }));
			} else {
				throw new Error("Failed to update order status on the server.");
			}
		} catch (error) {
			console.error(
				`Failed to update order ${orderId} to status: ${status}`,
				error
			);
			Alert.alert("Error", "Failed to update order status.");
		}
	};

	const renderOrder = ({ item }) => {
		if (!item || !item.order_items) {
			console.error("Invalid order item:", item);
			return null;
		}

		const isExpanded = expandedOrders[item.id];
		let orderItems = [];
		try {
			orderItems = JSON.parse(item.order_items);
		} catch (error) {
			console.error("Failed to parse order items:", item.order_items);
			return null;
		}

		return (
			<View style={styles.orderContainer}>
				<TouchableOpacity
					style={styles.orderSummary}
					onPress={() => toggleOrder(item.id)}
				>
					<Text style={styles.orderText}>Order ID: {item.id}</Text>
					<Text style={styles.orderText}>
						Items: {item.item_numbers || "N/A"}
					</Text>
					<Text style={styles.orderText}>
						Total: £{(item.total_price / 100).toFixed(2)}
					</Text>
					<MaterialCommunityIcons
						name={isExpanded ? "chevron-up" : "chevron-down"}
						size={24}
					/>
				</TouchableOpacity>
				{isExpanded && (
					<View style={styles.orderDetails}>
						{orderItems.map((orderItem) => (
							<View key={orderItem.id} style={styles.orderItem}>
								<Image
									source={{ uri: orderItem.image }}
									style={styles.productImage}
								/>
								<View style={styles.productInfo}>
									<Text style={styles.productName}>
										{orderItem.title}
									</Text>
									<Text>Quantity: {orderItem.quantity}</Text>
								</View>
							</View>
						))}
						{item.is_paid === 0 && (
							<Button
								title="Pay"
								onPress={() =>
									handleStatusChange(item.id, "paid")
								}
							/>
						)}
						{item.is_paid === 1 && item.is_delivered === 0 && (
							<Button
								title="Receive"
								onPress={() =>
									handleStatusChange(item.id, "delivered")
								}
							/>
						)}
					</View>
				)}
			</View>
		);
	};

	const renderSectionHeader = ({ section: { title, key, count } }) => (
		<View style={styles.sectionContainer}>
			<TouchableOpacity
				style={styles.sectionHeader}
				onPress={() => toggleSection(key)}
			>
				<Text style={styles.sectionTitle}>
					{title} ({count})
				</Text>
				<MaterialCommunityIcons
					name={expandedSections[key] ? "chevron-up" : "chevron-down"}
					size={24}
					color="#333"
				/>
			</TouchableOpacity>
		</View>
	);

	const sections = [
		{
			title: "New Orders",
			data: expandedSections.newOrders
				? orders.filter((order) => order.is_paid === 0)
				: [],
			key: "newOrders",
			count: orders.filter((order) => order.is_paid === 0).length,
		},
		{
			title: "Paid Orders",
			data: expandedSections.paidOrders
				? orders.filter(
						(order) =>
							order.is_paid === 1 && order.is_delivered === 0
				  )
				: [],
			key: "paidOrders",
			count: orders.filter(
				(order) => order.is_paid === 1 && order.is_delivered === 0
			).length,
		},
		{
			title: "Delivered Orders",
			data: expandedSections.deliveredOrders
				? orders.filter((order) => order.is_delivered === 1)
				: [],
			key: "deliveredOrders",
			count: orders.filter((order) => order.is_delivered === 1).length,
		},
	];

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: "My Orders",
		});
	}, [navigation]);

	return (
		<RequireAuth>
			<SafeAreaView style={{ flex: 1 }}>
				<SectionList
					sections={sections}
					keyExtractor={(item) =>
						item?.id ? item.id.toString() : Math.random().toString()
					}
					renderItem={renderOrder}
					renderSectionHeader={renderSectionHeader}
					stickySectionHeadersEnabled={false}
					contentContainerStyle={styles.listContainer}
				/>
			</SafeAreaView>
		</RequireAuth>
	);
};

const styles = StyleSheet.create({
	orderContainer: {
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#ccc",
		marginHorizontal: 15,
		backgroundColor: "#fff",
		borderRadius: 5,
	},
	orderSummary: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#f9f9f9",
		padding: 10,
		borderRadius: 5,
	},
	orderText: {
		fontSize: 16,
		fontWeight: "bold",
	},
	orderDetails: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		backgroundColor: "#f0f0f0",
		borderRadius: 5,
	},
	orderItem: {
		flexDirection: "row",
		marginBottom: 10,
	},
	productImage: {
		width: 50,
		height: 50,
		marginRight: 10,
	},
	productInfo: {
		flex: 1,
	},
	productName: {
		fontSize: 16,
		fontWeight: "bold",
		flexWrap: "wrap",
	},
	listContainer: {
		padding: 10,
	},
	sectionContainer: {
		marginBottom: 10,
	},
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#e0e0e0",
		padding: 15,
		borderRadius: 5,
		marginHorizontal: 10,
		marginVertical: 5,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
	},
	orderList: {
		paddingHorizontal: 10,
	},
});

export default MyOrdersScreen;
