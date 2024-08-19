// ./src/screens/SignUpScreen.js

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
import { signUp } from "../redux/slices/authSlice";

const SignUpScreen = () => {
	const navigation = useNavigation();
	const dispatch = useDispatch();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleClear = () => {
		setName("");
		setEmail("");
		setPassword("");
	};

	const handleSignUp = async () => {
		try {
			if (!name || !email || !password) {
				Alert.alert("Sign Up Error", "Please fill in all fields.");
				return;
			}

			const result = await dispatch(
				signUp({ name, email, password })
			).unwrap();

			if (result.status === "error") {
				Alert.alert("Sign Up Error", result.message);
				return;
			}
			navigation.navigate("Main", { screen: "UserProfile" });
		} catch (error) {
			console.error("SignUp Error:", error);
			Alert.alert(
				"Sign Up Error",
				error.message || "An error occurred during sign up."
			);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Sign up a new user</Text>
			<TextInput
				style={styles.input}
				placeholder="Name"
				value={name}
				onChangeText={setName}
			/>
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
				<Button title="Sign Up" onPress={handleSignUp} />
			</View>
			<TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
				<Text style={styles.switchText}>Switch to: Sign In</Text>
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

export default SignUpScreen;
