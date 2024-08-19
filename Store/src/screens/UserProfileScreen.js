// ./src/screens/UserProfileScreen.js

import React, { useState, useEffect, useRef } from "react";
import {
	View,
	Text,
	TextInput,
	Button,
	StyleSheet,
	Alert,
	SafeAreaView,
	Keyboard,
	TouchableWithoutFeedback,
	ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { logOutUser, updateUserProfile } from "../redux/slices/authSlice";

const UserProfileScreen = ({ navigation }) => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.auth.user);
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [updating, setUpdating] = useState(false);

	const nameInputRef = useRef(null);
	const passwordInputRef = useRef(null);

	useEffect(() => {
		if (!user) {
			navigation.navigate("SignIn");
		}
	}, [user, navigation]);

	const handleUpdate = async () => {
		if (!name && !password) {
			Alert.alert("Error", "Please provide a new name or password");
			return;
		}

		if (name === user.name && !password) {
			Alert.alert("Error", "Please provide a new name or password");
			return;
		}

		try {
			const updateResponse = await dispatch(
				updateUserProfile({
					name: name || user.name,
					password: password || undefined,
				})
			).unwrap();

			if (updateResponse.status === "OK") {
				Alert.alert("Success", "User profile updated successfully");
				setUpdating(false);
				setName("");
				setPassword("");
				Keyboard.dismiss();
			} else {
				Alert.alert("Error", updateResponse.message);
			}
		} catch (error) {
			console.error("Error updating profile:", error);
			Alert.alert("Error", "An error occurred while updating profile");
		}
	};

	const handleSignOut = async () => {
		await dispatch(logOutUser());
	};

	const handleCancel = () => {
		nameInputRef.current?.blur();
		passwordInputRef.current?.blur();
		setName("");
		setPassword("");
		setUpdating(false);
		Keyboard.dismiss();
	};

	// Separate loading state to avoid rendering issues
	if (!user) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		);
	}

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: "User Profile",
		});
	}, [navigation]);

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<SafeAreaView style={{ flex: 1 }}>
				<View style={styles.container}>
					<Text style={styles.title}>User Profile</Text>
					<Text>Name: {user.name}</Text>
					<Text>Email: {user.email}</Text>
					<Button title="Update" onPress={() => setUpdating(true)} />
					<Button title="Sign Out" onPress={handleSignOut} />
					{updating && (
						<View style={styles.updateContainer}>
							<TextInput
								ref={nameInputRef}
								style={styles.input}
								placeholder="New Name"
								value={name}
								onChangeText={setName}
							/>
							<TextInput
								ref={passwordInputRef}
								style={styles.input}
								placeholder="New Password"
								value={password}
								onChangeText={setPassword}
								secureTextEntry
							/>
							<View style={styles.buttonContainer}>
								<Button title="Cancel" onPress={handleCancel} />
								<Button
									title="Confirm"
									onPress={handleUpdate}
								/>
							</View>
						</View>
					)}
				</View>
			</SafeAreaView>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	title: {
		fontSize: 18,
		marginBottom: 16,
	},
	input: {
		height: 40,
		borderColor: "#ccc",
		borderWidth: 1,
		marginBottom: 12,
		paddingHorizontal: 8,
		borderRadius: 4,
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 12,
	},
	updateContainer: {
		marginTop: 16,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default UserProfileScreen;
