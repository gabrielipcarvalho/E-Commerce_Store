// ./App.js

import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Provider, useDispatch, useSelector } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { store } from "./src/redux/store";
import { fetchOrders } from "./src/redux/slices/ordersSlice";
import CustomTabBarButton from "./src/components/CustomTabBarButton";

// Screens
import SplashScreen from "./src/screens/SplashScreen";
import CategoryScreen from "./src/screens/CategoryScreen";
import ProductListScreen from "./src/screens/ProductListScreen";
import ProductDetailsScreen from "./src/screens/ProductDetailsScreen";
import ShoppingCartScreen from "./src/screens/ShoppingCartScreen";
import MyOrdersScreen from "./src/screens/MyOrdersScreen";
import SignInScreen from "./src/screens/SignInScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import UserProfileScreen from "./src/screens/UserProfileScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const CategoryStack = createNativeStackNavigator();

function CategoryStackScreen() {
	const token = useSelector((state) => state.auth.token);
	return (
		<CategoryStack.Navigator>
			{token ? (
				<>
					<CategoryStack.Screen
						name="CategoryHome"
						component={CategoryScreen}
						options={{
							headerShown: true,
							headerTitle: "Product Categories",
						}}
					/>
					<CategoryStack.Screen
						name="ProductList"
						component={ProductListScreen}
						options={({ route }) => ({
							headerTitle: route.params.displayCategory,
						})}
					/>
					<CategoryStack.Screen
						name="ProductDetails"
						component={ProductDetailsScreen}
						options={{ headerTitle: "Product Details" }}
					/>
				</>
			) : (
				<>
					<CategoryStack.Screen
						name="SignIn"
						component={SignInScreen}
						options={{ headerShown: false }}
					/>
					<CategoryStack.Screen
						name="SignUp"
						component={SignUpScreen}
						options={{ headerShown: false }}
					/>
				</>
			)}
		</CategoryStack.Navigator>
	);
}

function ShoppingCartStackScreen() {
	const token = useSelector((state) => state.auth.token);
	return (
		<Stack.Navigator>
			{token ? (
				<Stack.Screen
					name="ShoppingCartScreen"
					component={ShoppingCartScreen}
					options={{ headerTitle: "Shopping Cart" }}
				/>
			) : (
				<>
					<Stack.Screen
						name="SignIn"
						component={SignInScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="SignUp"
						component={SignUpScreen}
						options={{ headerShown: false }}
					/>
				</>
			)}
		</Stack.Navigator>
	);
}

function MyOrdersStackScreen() {
	const token = useSelector((state) => state.auth.token);
	return (
		<Stack.Navigator>
			{token ? (
				<Stack.Screen
					name="MyOrdersScreen"
					component={MyOrdersScreen}
					options={{ headerTitle: "My Orders" }}
				/>
			) : (
				<>
					<Stack.Screen
						name="SignIn"
						component={SignInScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="SignUp"
						component={SignUpScreen}
						options={{ headerShown: false }}
					/>
				</>
			)}
		</Stack.Navigator>
	);
}

function UserProfileStackScreen() {
	const token = useSelector((state) => state.auth.token);
	return (
		<Stack.Navigator>
			{token ? (
				<Stack.Screen
					name="UserProfileScreen"
					component={UserProfileScreen}
					options={{ headerTitle: "User Profile" }}
				/>
			) : (
				<>
					<Stack.Screen
						name="SignIn"
						component={SignInScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="SignUp"
						component={SignUpScreen}
						options={{ headerShown: false }}
					/>
				</>
			)}
		</Stack.Navigator>
	);
}

function MainTabs() {
	const token = useSelector((state) => state.auth.token);
	const cartItemCount = useSelector((state) => state.cart.totalQuantity);
	const newOrderCount = useSelector(
		(state) => state.orders.orders.filter((order) => !order.is_paid).length
	);

	return (
		<Tab.Navigator screenOptions={{ headerShown: false }}>
			<Tab.Screen
				name="Products"
				component={CategoryStackScreen}
				options={{
					tabBarLabel: "Products",
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="view-list"
							color={color}
							size={size}
						/>
					),
					tabBarButton: (props) => (
						<CustomTabBarButton {...props} routeName="Products" />
					),
				}}
			/>
			<Tab.Screen
				name="ShoppingCartTab"
				component={ShoppingCartStackScreen}
				options={{
					tabBarLabel: "Cart",
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="cart"
							color={color}
							size={size}
						/>
					),
					tabBarBadge: cartItemCount > 0 ? cartItemCount : null,
					tabBarButton: (props) => (
						<CustomTabBarButton {...props} routeName="Cart" />
					),
				}}
			/>
			<Tab.Screen
				name="MyOrders"
				component={MyOrdersStackScreen}
				options={{
					tabBarLabel: "My Orders",
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="clipboard-list"
							color={color}
							size={size}
						/>
					),
					tabBarBadge: newOrderCount > 0 ? newOrderCount : null,
					tabBarButton: (props) => (
						<CustomTabBarButton {...props} routeName="MyOrders" />
					),
				}}
			/>
			<Tab.Screen
				name="UserProfile"
				component={UserProfileStackScreen}
				options={{
					tabBarLabel: "Profile",
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="account"
							color={color}
							size={size}
						/>
					),
					tabBarButton: (props) => (
						<CustomTabBarButton {...props} routeName="Profile" />
					),
				}}
			/>
			{token === null && (
				<>
					<Tab.Screen
						name="SignIn"
						component={SignInScreen}
						options={{
							tabBarButton: () => null,
						}}
					/>
					<Tab.Screen
						name="SignUp"
						component={SignUpScreen}
						options={{
							tabBarButton: () => null,
						}}
					/>
				</>
			)}
		</Tab.Navigator>
	);
}

function App() {
	const dispatch = useDispatch();
	const token = useSelector((state) => state.auth.token);

	useEffect(() => {
		if (token) {
			dispatch(fetchOrders({ token }));
		}
	}, [dispatch, token]);

	return (
		<SafeAreaProvider>
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Splash">
					<Stack.Screen
						name="Splash"
						component={SplashScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="Main"
						component={MainTabs}
						options={{ headerShown: false }}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</SafeAreaProvider>
	);
}

export default function WrappedApp() {
	return (
		<Provider store={store}>
			<App />
		</Provider>
	);
}
