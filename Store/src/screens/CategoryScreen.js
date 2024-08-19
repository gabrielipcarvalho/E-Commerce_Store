// ./src/screens/CategoryScreen.js

import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	ActivityIndicator,
	FlatList,
	TouchableOpacity,
	StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setCategories } from "../redux/slices/categorySlice";

const CategoryScreen = ({ navigation }) => {
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch();
	const categories = useSelector((state) => state.category.categories);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await fetch(
					"https://fakestoreapi.com/products/categories"
				);
				const data = await response.json();
				dispatch(setCategories(data));
			} catch (error) {
				console.error("Failed to fetch categories", error);
			}
			setLoading(false);
		};

		if (categories.length === 0) {
			fetchCategories();
		} else {
			setLoading(false);
		}
	}, [dispatch, categories]);

	if (loading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		);
	}

	const handlePress = (category) => {
		let displayCategory;
		switch (category.toLowerCase()) {
			case "electronics":
				displayCategory = "Electronics";
				break;
			case "jewelery":
				displayCategory = "Jewellery";
				break;
			case "men's clothing":
				displayCategory = "Men's Clothing";
				break;
			case "women's clothing":
				displayCategory = "Women's Clothing";
				break;
			default:
				displayCategory =
					category.charAt(0).toUpperCase() + category.slice(1);
		}
		navigation.navigate("ProductList", { category, displayCategory });
	};

	return (
		<View style={styles.container}>
			<FlatList
				data={categories}
				keyExtractor={(item) => item}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={styles.button}
						onPress={() => handlePress(item)}
					>
						<Text style={styles.buttonText}>
							{item === "electronics"
								? "Electronics"
								: item === "jewelery"
								? "Jewellery"
								: item === "men's clothing"
								? "Men's Clothing"
								: item === "women's clothing"
								? "Women's Clothing"
								: item.charAt(0).toUpperCase() + item.slice(1)}
						</Text>
					</TouchableOpacity>
				)}
				contentContainerStyle={styles.listContainer}
			/>
			<View style={styles.footer}>
				<Text style={styles.footerText}>
					Gabriel Isaias Padua Carvalho
				</Text>
				<Text style={styles.footerText}>s5326266</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	centered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	listContainer: {
		padding: 20,
	},
	button: {
		backgroundColor: "#f0f0f0",
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#dedede",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 5,
		marginVertical: 5,
	},
	buttonText: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
	},
	footer: {
		padding: 10,
		alignItems: "center",
	},
	footerText: {
		fontSize: 12,
		color: "#333",
	},
});

export default CategoryScreen;
