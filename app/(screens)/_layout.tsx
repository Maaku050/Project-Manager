// app/_layout.tsx
import React from "react";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useWindowDimensions } from "react-native";
import { Drawer } from "expo-router/drawer";
import "@/global.css";

import { UserProvider } from "@/context/profileContext";
import { ProjectProvider } from "@/context/projectContext";

export default function RootLayout() {
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;

  return (
    <UserProvider>
      <ProjectProvider>
        <GluestackUIProvider mode="light">
          <Drawer
            screenOptions={{
              // Responsive Drawer behavior
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
              // Appearance
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
            {/* 👇 Drawer-visible screens */}
            <Drawer.Screen name="index" options={{ title: "Home" }} />
            <Drawer.Screen name="project" options={{ title: "Project" }} />
            <Drawer.Screen
              name="projectModal"
              options={{
                title: "Project",
                drawerItemStyle: { display: "none" },
              }}
            />
          </Drawer>
        </GluestackUIProvider>
      </ProjectProvider>
    </UserProvider>
  );
}
