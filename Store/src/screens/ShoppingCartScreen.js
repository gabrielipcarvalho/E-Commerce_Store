// ./src/screens/ShoppingCartScreen.js

import React from "react";
import {
	View,
	Text,
	FlatList,
	Image,
	TouchableOpacity,
	StyleSheet,
	Button,
	Alert,
	Dimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { addItem, removeItem, clearCart } from "../redux/slices/cartSlice";
import { createOrder } from "../redux/slices/ordersSlice";
import { useNavigation } from "@react-navigation/native";
import RequireAuth from "../components/RequireAuth";

const { width } = Dimensions.get("window");

const ShoppingCartScreen = () => {
	const cart = useSelector((state) => state.cart);
	const token = useSelector((state) => state.auth.token);
	const userEmail = useSelector((state) => state.auth.user?.email);
	const dispatch = useDispatch();
	const navigation = useNavigation();

	const renderItem = ({ item }) => (
		<View style={styles.itemContainer}>
			<View style={styles.itemHeader}>
				<Image
					source={{ uri: item.image }}
					style={styles.productImage}
				/>
				<TouchableOpacity
					onPress={() =>
						navigation.navigate("ProductDetails", {
							productId: item.id,
						})
					}
				>
					<View style={styles.productInfo}>
						<Text style={styles.itemName}>{item.title}</Text>
						<Text style={styles.itemPrice}>
							£{item.price.toFixed(2)}
						</Text>
					</View>
				</TouchableOpacity>
			</View>
			<View style={styles.quantityContainer}>
				<Button
					title="-"
					onPress={() =>
						dispatch(removeItem({ id: item.id, userEmail }))
					}
				/>
				<Text style={styles.quantity}>{item.quantity}</Text>
				<Button
					title="+"
					onPress={() => dispatch(addItem({ item, userEmail }))}
				/>
			</View>
		</View>
	);

	const handleCheckout = async () => {
		try {
			if (Object.values(cart.items).length === 0) {
				Alert.alert(
					"Cart is empty",
					"Please add items to your cart before checking out."
				);
				return;
			}

			const response = await dispatch(
				createOrder({
					items: Object.values(cart.items),
					token,
					userEmail,
				})
			);

			if (response.payload && response.payload.status === "OK") {
				dispatch(clearCart({ userEmail }));
				Alert.alert("Order Created", "A new order has been created.");
				navigation.navigate("MyOrders");
			} else {
				Alert.alert(
					"Error",
					response.payload?.message ||
						"An error occurred while creating order."
				);
			}
		} catch (error) {
			console.error("Error creating order:", error.message || error);
			Alert.alert("Error", "An error occurred while creating order");
		}
	};

	return (
		<RequireAuth>
			<View style={styles.container}>
				{cart.totalQuantity === 0 ? (
					<Text style={styles.emptyMessage}>Your Cart is Empty</Text>
				) : (
					<>
						<FlatList
							data={Object.values(cart.items)}
							keyExtractor={(item) => item.id.toString()}
							renderItem={renderItem}
							ListHeaderComponent={
								<View>
									<Text style={styles.header}>
										Total Items: {cart.totalQuantity}, Total
										Price: £{cart.totalPrice.toFixed(2)}
									</Text>
								</View>
							}
						/>
						<TouchableOpacity
							style={styles.checkoutButton}
							onPress={handleCheckout}
						>
							<Text style={styles.checkoutButtonText}>
								Check Out
							</Text>
						</TouchableOpacity>
					</>
				)}
			</View>
		</RequireAuth>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
	},
	itemContainer: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "flex-start",
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#ccc",
		marginBottom: 10,
	},
	itemHeader: {
		flexDirection: "row",
		alignItems: "center",
	},
	productImage: {
		width: 50,
		height: 50,
		marginRight: 10,
		resizeMode: "contain",
	},
	productInfo: {
		flex: 1,
	},
	itemName: {
		fontSize: 16,
		fontWeight: "bold",
		flexShrink: 1,
		width: width - 100,
	},
	itemPrice: {
		fontSize: 14,
		color: "#666",
		marginTop: 5,
	},
	quantityContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
	},
	quantity: {
		width: 40,
		textAlign: "center",
		marginHorizontal: 10,
	},
	emptyMessage: {
		textAlign: "center",
		fontSize: 18,
		marginTop: 20,
	},
	header: {
		padding: 10,
		fontSize: 18,
		backgroundColor: "#f0f0f0",
	},
	checkoutButton: {
		backgroundColor: "#007bff",
		padding: 15,
		borderRadius: 5,
		alignItems: "center",
		marginVertical: 20,
	},
	checkoutButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
});

export default ShoppingCartScreen;
