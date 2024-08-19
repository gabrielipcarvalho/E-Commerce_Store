// ./src/screens/ProductDetailsScreen.js

import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	ScrollView,
	Image,
	TouchableOpacity,
	ActivityIndicator,
	StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../redux/slices/cartSlice";
import { setProductDetailsCache } from "../redux/slices/productDetailsCacheSlice";

const ProductDetailsScreen = () => {
	const [loading, setLoading] = useState(true);
	const navigation = useNavigation();
	const route = useRoute();
	const dispatch = useDispatch();
	const cachedProductDetails = useSelector(
		(state) => state.productDetailsCache[route.params.productId]
	);
	const userEmail = useSelector((state) => state.auth.user?.email);
	const [product, setProduct] = useState(cachedProductDetails || null);

	useEffect(() => {
		const fetchProductDetails = async () => {
			try {
				const response = await fetch(
					`https://fakestoreapi.com/products/${route.params.productId}`
				);
				const data = await response.json();
				setProduct(data);
				dispatch(
					setProductDetailsCache({
						productId: route.params.productId,
						product: data,
					})
				);
			} catch (error) {
				console.error("Failed to fetch product details", error);
			}
			setLoading(false);
		};

		if (!cachedProductDetails) {
			fetchProductDetails();
		} else {
			setLoading(false);
		}
	}, [route.params.productId, cachedProductDetails, dispatch]);

	if (loading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		);
	}

	if (!product) {
		return (
			<View style={styles.centered}>
				<Text>Product not found.</Text>
			</View>
		);
	}

	const handleAddToCart = () => {
		if (userEmail && product) {
			dispatch(addItem({ item: product, userEmail }));
		} else {
			console.error("User email or product is undefined.");
		}
	};

	return (
		<ScrollView style={styles.container}>
			<Image source={{ uri: product.image }} style={styles.image} />
			<View style={styles.infoContainer}>
				<Text style={styles.name}>{product.title}</Text>
				<View style={styles.metaDataContainer}>
					<Text style={styles.rate}>Rate: {product.rating.rate}</Text>
					<Text style={styles.sold}>
						Sold: {product.rating.count}
					</Text>
					<Text style={styles.price}>
						Price: £{product.price.toFixed(2)}
					</Text>
				</View>
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={styles.backButton}
						onPress={() => navigation.goBack()}
					>
						<Text style={styles.buttonText}>Back</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.addToCartButton}
						onPress={handleAddToCart}
					>
						<Text style={styles.buttonText}>Add to Basket</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.descriptionContainer}>
					<Text style={styles.description}>
						{product.description}
					</Text>
				</View>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	centered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	image: {
		width: "100%",
		height: 300,
		resizeMode: "cover",
	},
	infoContainer: {
		padding: 20,
	},
	name: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 10,
	},
	metaDataContainer: {
		flexDirection: "row",
		marginBottom: 10,
	},
	rate: {
		marginRight: 20,
		fontSize: 16,
	},
	sold: {
		marginRight: 20,
		fontSize: 16,
	},
	price: {
		fontSize: 16,
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 20,
	},
	backButton: {
		backgroundColor: "#ddd",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 5,
	},
	addToCartButton: {
		backgroundColor: "#007bff",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 5,
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	descriptionContainer: {
		marginBottom: 20,
	},
	description: {
		fontSize: 16,
	},
});

export default ProductDetailsScreen;
