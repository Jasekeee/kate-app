import {
  DarkTheme as NavigationDarkTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Screens from "../screens";
import { Colors } from "../theme";

type RootStackParamList = {
  Onboarding: undefined;
  Dashboard: undefined;
  Send: { token?: string };
  Settings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const Stack = createNativeStackNavigator<RootStackParamList>();

const KateTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    background: Colors.background,
    card: Colors.surface,
    text: Colors.textPrimary,
    border: Colors.border,
    primary: Colors.primary,
  },
};

export const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState<"Onboarding" | "Dashboard" | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("kate_onboarded").then((val) => {
      setInitialRoute(val === "true" ? "Dashboard" : "Onboarding");
    });
  }, []);

  if (!initialRoute) return null;

  return (
    <NavigationContainer theme={KateTheme}>
      <StatusBar style="light" backgroundColor={Colors.background} />
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Onboarding" component={Screens.OnboardingScreen} />
        <Stack.Screen name="Dashboard" component={Screens.DashboardScreen} />
        <Stack.Screen
          name="Send"
          component={Screens.SendScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={Screens.SettingsScreen}
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: Colors.surface },
            headerTintColor: Colors.textPrimary,
            title: "Settings",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
