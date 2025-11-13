// app/_layout.tsx
import React from "react";
import { useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Drawer } from "expo-router/drawer";
import "@/global.css";

import { UserProvider } from "@/context/profileContext";
import { ProjectProvider } from "@/context/projectContext";

export default function RootLayout() {
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 1280; // computer UI condition
  const isMediumScreen = dimensions.width <= 1280 && dimensions.width > 768; // tablet UI condition

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <ProjectProvider>
          <GluestackUIProvider mode="light">
            <Drawer
              screenOptions={{
                drawerType: isLargeScreen
                  ? "permanent"
                  : isMediumScreen
                    ? "slide"
                    : "slide",
                drawerStyle: isLargeScreen
                  ? {
                      width: 240,
                      backgroundColor: "#1F1F1F",
                      borderRightWidth: 0,
                      borderRightColor: "#ffffff",
                    }
                  : {
                      width: "70%",
                      backgroundColor: "#1F1F1F",
                    },
                headerShown: true,
                drawerActiveTintColor: "#000",
                drawerInactiveTintColor: "#ffffff",
                drawerActiveBackgroundColor: "#e0e0e0",
                drawerLabelStyle: {
                  fontSize: isLargeScreen ? 16 : 14,
                  fontWeight: "bold",
                  fontFamily: "roboto, arial",
                  // color: "white",
                },
                headerStyle: {
                  backgroundColor: "#1f1f1f",
                  borderColor: "#000000ff",
                },
                headerTitleStyle: {
                  fontWeight: "bold",
                  fontSize: 24,
                  fontFamily: "roboto, arial",
                  color: "#ffffff",
                  borderColor: undefined,
                },
              }}
            >
              {/* headerBackground:{"#000000ff"} */}
              <Drawer.Screen name="index" options={{ title: "Home" }} />
              <Drawer.Screen
                name="dashboard"
                options={{ title: "Dashboard" }}
              />
              <Drawer.Screen name="project" options={{ title: "Project" }} />
              <Drawer.Screen name="employee" options={{ title: "Employee" }} />
              <Drawer.Screen
                name="projectWindow"
                options={{
                  title: "Project",
                  drawerItemStyle: { display: "none" },
                }}
              />
              <Drawer.Screen
                name="taskWindow"
                options={{
                  title: "Task",
                  drawerItemStyle: { display: "none" },
                }}
              />
              <Drawer.Screen
                name="employee-window"
                options={{
                  title: "Employee",
                  drawerItemStyle: { display: "none" },
                }}
              />
              <Drawer.Screen
                name="create-account-window"
                options={{
                  title: "Create Account",
                  drawerItemStyle: { display: "none" },
                }}
              />
            </Drawer>
          </GluestackUIProvider>
        </ProjectProvider>
      </UserProvider>
    </GestureHandlerRootView>
  );
}
