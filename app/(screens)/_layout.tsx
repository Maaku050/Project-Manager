// app/_layout.tsx
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import React from "react";
import { useWindowDimensions } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import "@/global.css";

import TaskCalendar from "@/app/(screens)/index";
import Sample from "@/app/(screens)/sample";
import { UserProvider } from "@/context/profileContext";
import { ProjectProvider } from "@/context/projectContext";
const Drawer = createDrawerNavigator();

export default function ScreensLayout() {
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768; // 👈 Adjust breakpoint as needed

  return (
    <UserProvider>
      <ProjectProvider>
        <GluestackUIProvider mode="light">
          <Drawer.Navigator
            screenOptions={{
              // 👇 Responsive Drawer behavior
              drawerType: isLargeScreen ? "permanent" : "front",
              drawerStyle: isLargeScreen
                ? {
                    width: 240,
                    backgroundColor: "#fff",
                    borderRightWidth: 1,
                    borderRightColor: "#ddd",
                  }
                : {
                    width: "70%",
                    backgroundColor: "#ffffffff",
                  },
              // 👇 Appearance
              headerShown: true,
              drawerActiveTintColor: "#000",
              drawerInactiveTintColor: "#777",
              drawerActiveBackgroundColor: "#e0e0e0",
              drawerLabelStyle: {
                fontSize: isLargeScreen ? 16 : 14,
                fontWeight: "500",
              },
              // sceneContainerStyle: {
              //   backgroundColor: "#f9f9f9",
              //   marginLeft: isLargeScreen ? 240 : 0, // 👈 Adjust for fixed drawer
              // },
            }}
          >
            {/* ✅ Screens */}
            <Drawer.Screen
              name="index"
              component={TaskCalendar}
              options={{ title: "Home" }}
            />
            <Drawer.Screen
              name="sample"
              component={Sample}
              options={{ title: "Sample" }}
            />
          </Drawer.Navigator>
        </GluestackUIProvider>
      </ProjectProvider>
    </UserProvider>
  );
}
