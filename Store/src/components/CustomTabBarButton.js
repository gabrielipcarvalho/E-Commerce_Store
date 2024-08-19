// ./src/components/CustomTabBarButton.js

import React from "react";
import { TouchableOpacity, Alert } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const CustomTabBarButton = ({ children, onPress, routeName }) => {
	const token = useSelector((state) => state.auth.token);
	const navigation = useNavigation();

	const handlePress = () => {
		if (token) {
			onPress();
		} else {
			Alert.alert(
				"Authentication Required",
				"Please sign in or sign up before accessing this page.",
				[
					{
						text: "Cancel",
						style: "cancel",
					},
					{
						text: "Sign In",
						onPress: () => navigation.navigate("SignIn"),
					},
				]
			);
		}
	};

	return (
		<TouchableOpacity
			onPress={handlePress}
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			{children}
		</TouchableOpacity>
	);
};

export default CustomTabBarButton;
