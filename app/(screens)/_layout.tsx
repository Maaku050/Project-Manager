// app/_layout.tsx
import React from "react";
import { Text, Image, StyleSheet } from "react-native";
import { useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Drawer } from "expo-router/drawer";
import "@/global.css";

import { UserProvider, useUser } from "@/context/profileContext";
import { ProjectProvider } from "@/context/projectContext";



import { HeaderUserEmail, HomeTitle,} from "./home";
import { DashTitle } from "./dashboard";

import { HStack } from "@/components/ui/hstack";
import { Icon } from "lucide-react-native";
// import { ProjectTitle } from "./project";
// import { DrawerHeader } from "@/components/ui/drawer";

export default function RootLayout() {
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 1280; // computer UI condition
  const isMediumScreen = dimensions.width <= 1280 && dimensions.width > 768; // tablet UI condition
  const { profile } = useUser();

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
                      backgroundColor: "#000000ff",
                      borderRightWidth: 0,
                      borderRightColor: "#ffffff",
                    }
                  : {
                      width: "70%",
                      backgroundColor: "#000000ff",
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
                  backgroundColor: "#000000ff",
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
              

              {/* <Image source={require("@/assets/images/Innoendo Logo_Main Logo.png")} style={{ width: 160, height: 40, resizeMode: "contain" }} /> */}

              <Drawer.Screen
                name="home"
                options={{
                  title: "Home",
                  headerTitle: () => null,
                  headerRight: () => <HeaderUserEmail />,
                  headerLeft: () => <HomeTitle />,
                  headerTintColor: "white",
                  headerStyle: {
                   ...styles.headerSpace,
                  }
                }}
              
              />
              <Drawer.Screen
                name="dashboard"
                options={{
                  title: "Dashboard",
                  headerTitle: () => null,
                  headerRight: () => <HeaderUserEmail />,
                  headerLeft: () => <DashTitle />,
                  headerTintColor: "white",
                  headerStyle: {
                    ...styles.headerSpace,
                  }
                }}
              />
              <Drawer.Screen
                name="project"
                options={{
                  title: "Project",
                  headerTitle: () => null,
                  headerRight: () => <HeaderUserEmail />,
                  // headerLeft: () => <ProjectTitle />,
                  headerTintColor: "white",
                  // headerStyle: {
                  //   ...styles.headerSpace,
                  // }
                }}
              />
              <Drawer.Screen
                name="employee"
                options={{
                  title: "Employee",
                  headerTitle: () => null,
                  headerRight: () => <HeaderUserEmail />,
                  headerTintColor: "white",
                }}
              />
              <Drawer.Screen
                name="projectWindow"
                options={{
                  title: "Project",
                  drawerItemStyle: { display: "none" },
                  headerTitle: () => null,
                  headerRight: () => <HeaderUserEmail />,
                  headerTintColor: "white",
                }}
              />
              <Drawer.Screen
                name="taskWindow"
                options={{
                  title: "Task",
                  drawerItemStyle: { display: "none" },
                  headerTitle: () => null,
                  headerRight: () => <HeaderUserEmail />,
                  headerTintColor: "white",
                }}
              />
              <Drawer.Screen
                name="employee-window"
                options={{
                  title: "Employee",
                  drawerItemStyle: { display: "none" },
                  headerTitle: () => null,
                  headerRight: () => <HeaderUserEmail />,
                  headerTintColor: "white",
                }}
              />
              <Drawer.Screen
                name="create-account-window"
                options={{
                  title: "Create Account",
                  drawerItemStyle: { display: "none" },
                  headerTitle: () => null,
                  headerRight: () => <HeaderUserEmail />,
                  headerTintColor: "white",
                }}
              />
            </Drawer>
          </GluestackUIProvider>
        </ProjectProvider>
      </UserProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  headerSpace: {
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 28,
    paddingBottom: 28,
    backgroundColor: "black",
    alignContent: "center",
    alignItems: "center",
    borderBottomWidth: 0,
  }
});


