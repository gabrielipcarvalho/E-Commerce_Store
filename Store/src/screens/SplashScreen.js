// ./src/screens/SplashScreen.js

import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const SplashScreen = () => {
	const navigation = useNavigation();
	const token = useSelector((state) => state.auth.token);

	useEffect(() => {
		const timer = setTimeout(() => {
			navigation.reset({
				index: 0,
				routes: [{ name: "Main" }],
			});
		}, 1500);

		return () => clearTimeout(timer);
	}, [navigation]);

	return (
		<View style={styles.container}>
			<Image
				source={require("../assets/splash.png")}
				style={styles.image}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
	},
	image: {
		width: "100%",
		resizeMode: "contain",
	},
});

export default SplashScreen;
