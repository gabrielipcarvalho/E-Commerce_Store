// ./src/screens/ProductListScreen.js

import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	ActivityIndicator,
	FlatList,
	StyleSheet,
	Image,
	TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setProductCache } from "../redux/slices/productCacheSlice";

const ProductListScreen = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigation = useNavigation();
	const route = useRoute();
	const dispatch = useDispatch();
	const cachedData = useSelector((state) => state.productCache);
	const [headerTitle, setHeaderTitle] = useState("");

	useEffect(() => {
		const fetchProducts = async () => {
			const category = route.params.category;
			const displayCategory = route.params.displayCategory;

			setHeaderTitle(displayCategory);

			if (cachedData[category]) {
				setProducts(cachedData[category]);
				setLoading(false);
				return;
			}

			try {
				const response = await fetch(
					`https://fakestoreapi.com/products/category/${category}`
				);
				const data = await response.json();
				setProducts(data);
				dispatch(setProductCache({ category, products: data }));
			} catch (error) {
				console.error("Failed to fetch products", error);
			}
			setLoading(false);
		};

		fetchProducts();
	}, [
		route.params.category,
		route.params.displayCategory,
		cachedData,
		dispatch,
	]);

	useEffect(() => {
		navigation.setOptions({ title: headerTitle });
	}, [headerTitle, navigation]);

	if (loading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		);
	}

	return (
		<View style={{ flex: 1 }}>
			<FlatList
				data={products}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => (
					<TouchableOpacity
						onPress={() =>
							navigation.navigate("ProductDetails", {
								productId: item.id,
							})
						}
					>
						<View style={styles.productItem}>
							<Image
								source={{ uri: item.image }}
								style={styles.productImage}
							/>
							<View style={styles.productInfo}>
								<Text style={styles.productName}>
									{item.title}
								</Text>
								<Text style={styles.productPrice}>
									£{item.price.toFixed(2)}
								</Text>
							</View>
						</View>
					</TouchableOpacity>
				)}
				contentContainerStyle={styles.listContainer}
			/>
			<TouchableOpacity
				style={styles.backButton}
				onPress={() => navigation.goBack()}
			>
				<Text style={styles.backButtonText}>Back</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	centered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	listContainer: {
		padding: 10,
	},
	productItem: {
		flexDirection: "row",
		padding: 10,
		marginVertical: 8,
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 5,
		backgroundColor: "#fff",
	},
	productImage: {
		width: 100,
		height: 100,
		marginRight: 10,
	},
	productInfo: {
		flex: 1,
		justifyContent: "center",
	},
	productName: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 5,
	},
	productPrice: {
		fontSize: 14,
		color: "#666",
	},
	backButton: {
		backgroundColor: "#007bff",
		padding: 10,
		borderRadius: 5,
		alignItems: "center",
		margin: 10,
	},
	backButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
});

export default ProductListScreen;
