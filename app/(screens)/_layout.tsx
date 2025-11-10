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
  const isLargeScreen = dimensions.width >= 768;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <ProjectProvider>
          <GluestackUIProvider mode="light">
            <Drawer
              screenOptions={{
                drawerType: isLargeScreen ? "permanent" : "slide",
                drawerStyle: isLargeScreen
                  ? {
                      width: 240,
                      backgroundColor: "#fff",
                      borderRightWidth: 1,
                      borderRightColor: "#ddd",
                    }
                  : {
                      width: "70%",
                      backgroundColor: "#fff",
                    },
                headerShown: true,
                drawerActiveTintColor: "#000",
                drawerInactiveTintColor: "#777",
                drawerActiveBackgroundColor: "#e0e0e0",
                drawerLabelStyle: {
                  fontSize: isLargeScreen ? 16 : 14,
                  fontWeight: "500",
                },
              }}
            >
              <Drawer.Screen name="index" options={{ title: "Home" }} />
              <Drawer.Screen
                name="dashboard"
                options={{ title: "Dashboard" }}
              />
              <Drawer.Screen name="project" options={{ title: "Project" }} />
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
            </Drawer>
          </GluestackUIProvider>
        </ProjectProvider>
      </UserProvider>
    </GestureHandlerRootView>
  );
}
