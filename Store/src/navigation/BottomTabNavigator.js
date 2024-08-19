// src/navigation/BottomTabNavigator.js

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";

import StackNavigator from "./StackNavigator";
import ShoppingCartScreen from "../screens/ShoppingCartScreen";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
	const { totalQuantity } = useSelector((state) => state.cart);

	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;
					if (route.name === "Products") {
						iconName = focused ? "ios-list" : "ios-list-outline";
					} else if (route.name === "Shopping Cart") {
						iconName = focused ? "ios-cart" : "ios-cart-outline";
					}
					return (
						<Ionicons name={iconName} size={size} color={color} />
					);
				},
				tabBarActiveTintColor: "tomato",
				tabBarInactiveTintColor: "gray",
			})}
		>
			<Tab.Screen name="Products" component={StackNavigator} />
			<Tab.Screen
				name="Shopping Cart"
				component={ShoppingCartScreen}
				options={{
					tabBarBadge: totalQuantity > 0 ? totalQuantity : null,
				}}
			/>
		</Tab.Navigator>
	);
};

export default BottomTabNavigator;
