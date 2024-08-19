// ./src/screens/SignInScreen.js

import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	Button,
	StyleSheet,
	TouchableOpacity,
	Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { logInUser } from "../redux/slices/authSlice";

const SignInScreen = () => {
	const navigation = useNavigation();
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleClear = () => {
		setEmail("");
		setPassword("");
	};

	const handleSignIn = async () => {
		try {
			if (!email || !password) {
				Alert.alert(
					"Sign In Error",
					"Please enter both email and password."
				);
				return;
			}

			const result = await dispatch(
				logInUser({ email, password })
			).unwrap();

			if (result.status === "error") {
				Alert.alert("Sign In Error", "Wrong email or password.");
				return;
			}

			navigation.navigate("Main", { screen: "UserProfile" });
		} catch (error) {
			console.error("SignIn Error:", error);
			const errorMessage =
				error.message === "Wrong email or password" ||
				error.message === "User not found"
					? "Wrong email or password."
					: "An error occurred during sign in.";
			Alert.alert("Sign In Error", errorMessage);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				Sign in with your email and password
			</Text>
			<TextInput
				style={styles.input}
				placeholder="Email"
				keyboardType="email-address"
				value={email}
				onChangeText={setEmail}
			/>
			<TextInput
				style={styles.input}
				placeholder="Password"
				secureTextEntry
				value={password}
				onChangeText={setPassword}
			/>
			<View style={styles.buttonContainer}>
				<Button title="Clear" onPress={handleClear} />
				<Button title="Sign In" onPress={handleSignIn} />
			</View>
			<TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
				<Text style={styles.switchText}>Switch to: Sign Up</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 16,
		backgroundColor: "#fff",
	},
	title: {
		fontSize: 24,
		marginBottom: 16,
	},
	input: {
		width: "100%",
		padding: 8,
		borderWidth: 1,
		borderColor: "#ccc",
		marginBottom: 16,
		borderRadius: 4,
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
	switchText: {
		marginTop: 16,
		color: "blue",
	},
});

export default SignInScreen;
