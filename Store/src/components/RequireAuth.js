// ./src/components/RequireAuth.js

import React from "react";
import { View, Text, Button, Alert } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const RequireAuth = ({ children }) => {
	const token = useSelector((state) => state.auth.token);
	const navigation = useNavigation();

	if (!token) {
		Alert.alert(
			"Access Denied",
			"Please sign in or sign up to access this screen.",
			[
				{
					text: "OK",
					onPress: () => {
						navigation.navigate("Auth");
					},
				},
			]
		);
		return null;
	}

	return children;
};

export default RequireAuth;
