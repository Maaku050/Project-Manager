// app/_layout.tsx
import React from 'react'
import { StyleSheet, View, Image, Text } from 'react-native'
import { useWindowDimensions } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import { Drawer } from 'expo-router/drawer'
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerToggleButton,
} from '@react-navigation/drawer'
import { Home, LayoutDashboard, Folder, Users } from 'lucide-react-native'
import '@/global.css'

import { UserProvider } from '@/context/profileContext'
import { ProjectProvider } from '@/context/projectContext'

import { HeaderUserEmail } from './home'
import HeaderButtons from '@/components/headerButtons'
import HeaderLogout from '@/components/headerLogout'
import { useRouter } from 'expo-router'
import { Pressable } from '@/components/ui/pressable'
import { HStack } from '@/components/ui/hstack'
import { ArrowLeftIcon, Icon } from '@/components/ui/icon'

// Custom Drawer Content
function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ paddingTop: 0 }}
      style={{ backgroundColor: '#000' }}
    >
      {/* Logo Section */}
      <View
        style={{
          padding: 30,
          alignItems: 'center',
          backgroundColor: '#000',
          paddingTop: 20,
          paddingBottom: 20,
        }}
      >
        <Image
          source={require('@/assets/images/final dark logo.png')} // Your logo path
          style={{ width: 120, height: 60 }}
          resizeMode="contain"
        />
      </View>

      {/* Drawer Items */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  )
}

export default function RootLayout() {
  const dimensions = useWindowDimensions()
  const isLargeScreen = dimensions.width >= 1280
  const isMediumScreen = dimensions.width <= 1280 && dimensions.width > 768
  const isMobile = dimensions.width <= 768
  const router = useRouter()

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <ProjectProvider>
          <GluestackUIProvider mode="light">
            <Drawer
              drawerContent={(props) => <CustomDrawerContent {...props} />}
              screenOptions={{
                drawerType: isLargeScreen
                  ? 'permanent'
                  : isMediumScreen
                    ? 'slide'
                    : 'slide',
                drawerStyle: isLargeScreen
                  ? {
                      width: 240,
                      backgroundColor: '#000',
                      borderRightWidth: 0,
                    }
                  : {
                      width: '70%',
                      backgroundColor: '#000',
                    },
                headerShown: true,
                drawerActiveTintColor: '#000',
                drawerInactiveTintColor: '#fff',
                drawerActiveBackgroundColor: '#fff',
                drawerInactiveBackgroundColor: 'transparent',
                drawerItemStyle: {
                  borderRadius: 8,
                  marginHorizontal: 12,
                  marginVertical: 4,
                  paddingLeft: 8,
                },
                drawerLabelStyle: {
                  fontSize: 15,
                  fontWeight: '600',
                  marginLeft: -16,
                },
                // Add these two props to remove hover effect
                overlayColor: 'transparent',
                // For web - removes ripple effect
                sceneStyle: { backgroundColor: 'transparent' },
                headerStyle: {
                  backgroundColor: '#000',
                  borderColor: '#000',
                },
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 24,
                  color: '#fff',
                },
              }}
            >
              <Drawer.Screen
                name="home"
                options={{
                  title: 'Home',
                  drawerIcon: ({ color }) => (
                    <Home color={color} size={25} className="mr-2" />
                  ),
                  headerTitle: () => null,
                  headerRight: () => <HeaderLogout />,
                  headerLeft: isLargeScreen
                    ? () => <HeaderButtons screen="home" />
                    : undefined,
                  headerTintColor: 'white',
                  headerStyle: {
                    ...styles.headerSpace,
                  },
                }}
              />
              <Drawer.Screen
                name="dashboard"
                options={{
                  title: 'Dashboard',
                  drawerIcon: ({ color }) => (
                    <LayoutDashboard color={color} size={25} className="mr-2" />
                  ),
                  headerTitle: () => null,
                  headerRight: () => <HeaderLogout />,
                  headerLeft: isLargeScreen
                    ? () => <HeaderButtons screen="dashboard" />
                    : undefined,
                  headerTintColor: 'white',
                  headerStyle: {
                    ...styles.headerSpace,
                  },
                }}
              />
              <Drawer.Screen
                name="project"
                options={{
                  title: 'Projects',
                  drawerIcon: ({ color }) => (
                    <Folder color={color} size={25} className="mr-2" />
                  ),
                  headerTitle: () => null,
                  headerRight: () => <HeaderLogout />,
                  headerLeft: () =>
                    isMobile ? (
                      <HStack style={{ alignItems: 'center' }}>
                        <DrawerToggleButton tintColor="white" />
                        <HeaderButtons screen="project" />
                      </HStack>
                    ) : (
                      <HeaderButtons screen="project" />
                    ),
                  headerTintColor: 'white',
                  headerStyle: {
                    ...styles.headerSpace,
                  },
                }}
              />
              <Drawer.Screen
                name="employee/index"
                options={{
                  title: 'Employees',
                  drawerIcon: ({ color }) => (
                    <Users color={color} size={25} className="mr-2" />
                  ),
                  headerTitle: () => null,
                  headerRight: () => <HeaderLogout />,
                  headerLeft: () =>
                    isMobile ? (
                      <HStack style={{ alignItems: 'center' }}>
                        <DrawerToggleButton tintColor="white" />
                        <HeaderButtons screen="projectWindow" />
                      </HStack>
                    ) : (
                      <HeaderButtons screen="employee" />
                    ),
                  headerTintColor: 'white',
                  headerStyle: {
                    ...styles.headerSpace,
                  },
                }}
              />
              <Drawer.Screen
                name="projectWindow"
                options={{
                  title: 'Project',
                  drawerItemStyle: { display: 'none' },
                  headerTitle: () => null,
                  headerRight: () => <HeaderLogout />,
                  headerLeft: () =>
                    isMobile ? (
                      <HStack style={{ alignItems: 'center' }}>
                        <DrawerToggleButton tintColor="white" />
                        <HeaderButtons screen="projectWindow" />
                      </HStack>
                    ) : (
                      <HeaderButtons screen="projectWindow" />
                    ),
                  headerTintColor: 'white',
                  headerStyle: {
                    ...styles.headerSpace,
                  },
                }}
              />
              <Drawer.Screen
                name="addTaskScreen"
                options={{
                  title: 'addTaskScreen',
                  drawerItemStyle: { display: 'none' },
                  headerTitle: () => null,
                  headerRight: () => <HeaderLogout />,
                  headerLeft: () =>
                    isMobile ? (
                      <HStack style={{ alignItems: 'center' }}>
                        <DrawerToggleButton tintColor="white" />
                        <HeaderButtons screen="projectWindow" />
                      </HStack>
                    ) : (
                      <HeaderButtons screen="projectWindow" />
                    ),
                  headerTintColor: 'white',
                  headerStyle: {
                    ...styles.headerSpace,
                  },
                }}
              />
              <Drawer.Screen
                name="projectJournalScreen"
                options={{
                  title: 'projectJournalScreen',
                  drawerItemStyle: { display: 'none' },
                  headerTitle: () => null,
                  headerRight: () => <HeaderLogout />,
                  headerLeft: () =>
                    isMobile ? (
                      <HStack style={{ alignItems: 'center' }}>
                        <DrawerToggleButton tintColor="white" />
                        <HeaderButtons screen="projectWindow" />
                      </HStack>
                    ) : (
                      <HeaderButtons screen="projectJournalScreen" />
                    ),
                  headerTintColor: 'white',
                  headerStyle: {
                    ...styles.headerSpace,
                  },
                }}
              />
              <Drawer.Screen
                name="addProjectScreen"
                options={{
                  title: 'addProjectScreen',
                  drawerItemStyle: { display: 'none' },
                  headerTitle: () => null,
                  headerRight: () => <HeaderLogout />,
                  headerTintColor: 'white',
                  headerLeft: () =>
                    isMobile ? (
                      <HStack style={{ alignItems: 'center' }}>
                        <DrawerToggleButton tintColor="white" />
                        <HeaderButtons screen="projectWindow" />
                      </HStack>
                    ) : (
                      <HeaderButtons screen="projectJournalScreen" />
                    ),
                  headerStyle: {
                    ...styles.headerSpace,
                  },
                }}
              />
              <Drawer.Screen
                name="addRoleScreen"
                options={{
                  title: 'addRoleScreen',
                  drawerItemStyle: { display: 'none' },
                  headerTitle: () => null,
                  headerRight: () => <HeaderLogout />,
                  headerTintColor: 'white',
                  headerLeft: () =>
                    isMobile ? (
                      <HStack style={{ alignItems: 'center' }}>
                        <DrawerToggleButton tintColor="white" />
                        <HeaderButtons screen="projectWindow" />
                      </HStack>
                    ) : (
                      <HeaderButtons screen="projectJournalScreen" />
                    ),
                  headerStyle: {
                    ...styles.headerSpace,
                  },
                }}
              />
              <Drawer.Screen
                name="addEmployeeScreen"
                options={{
                  title: 'addEmployeeScreen',
                  drawerItemStyle: { display: 'none' },
                  headerTitle: () => null,
                  headerRight: () => <HeaderLogout />,
                  headerTintColor: 'white',
                  headerLeft: () =>
                    isMobile ? (
                      <HStack style={{ alignItems: 'center' }}>
                        <DrawerToggleButton tintColor="white" />
                        <HeaderButtons screen="projectWindow" />
                      </HStack>
                    ) : (
                      <HeaderButtons screen="projectJournalScreen" />
                    ),
                  headerStyle: {
                    ...styles.headerSpace,
                  },
                }}
              />
              <Drawer.Screen
                name="addJournalScreen"
                options={{
                  title: 'addJournalScreen',
                  drawerItemStyle: { display: 'none' },
                  headerTitle: () => null,
                  headerRight: () => <HeaderLogout />,
                  headerLeft: () =>
                    isMobile ? (
                      <HStack style={{ alignItems: 'center' }}>
                        <DrawerToggleButton tintColor="white" />
                        <HeaderButtons screen="projectWindow" />
                      </HStack>
                    ) : (
                      <HeaderButtons screen="projectJournalScreen" />
                    ),
                  headerTintColor: 'white',
                  headerStyle: {
                    ...styles.headerSpace,
                  },
                }}
              />
              <Drawer.Screen
                name="editJournalScreen"
                options={{
                  title: 'editJournalScreen',
                  drawerItemStyle: { display: 'none' },
                  headerTitle: () => null,
                  headerRight: () => <HeaderLogout />,
                  headerLeft: () =>
                    isMobile ? (
                      <HStack style={{ alignItems: 'center' }}>
                        <DrawerToggleButton tintColor="white" />
                        <HeaderButtons screen="projectWindow" />
                      </HStack>
                    ) : (
                      <HeaderButtons screen="projectJournalScreen" />
                    ),
                  headerTintColor: 'white',
                  headerStyle: {
                    ...styles.headerSpace,
                  },
                }}
              />
              <Drawer.Screen
                name="editProjectScreen"
                options={{
                  title: 'editProjectScreen',
                  drawerItemStyle: { display: 'none' },
                  headerTitle: () => null,
                  headerRight: () => <HeaderLogout />,
                  headerLeft: () =>
                    isMobile ? (
                      <HStack style={{ alignItems: 'center' }}>
                        <DrawerToggleButton tintColor="white" />
                        <HeaderButtons screen="projectWindow" />
                      </HStack>
                    ) : (
                      <HeaderButtons screen="projectJournalScreen" />
                    ),
                  headerTintColor: 'white',
                  headerStyle: {
                    ...styles.headerSpace,
                  },
                }}
              />
              <Drawer.Screen
                name="editTaskScreen"
                options={{
                  title: 'editTaskScreen',
                  drawerItemStyle: { display: 'none' },
                  headerTitle: () => null,
                  headerRight: () => <HeaderLogout />,
                  headerLeft: () =>
                    isMobile ? (
                      <HStack style={{ alignItems: 'center' }}>
                        <DrawerToggleButton tintColor="white" />
                        <HeaderButtons screen="projectWindow" />
                      </HStack>
                    ) : (
                      <HeaderButtons screen="projectJournalScreen" />
                    ),
                  headerTintColor: 'white',
                  headerStyle: {
                    ...styles.headerSpace,
                  },
                }}
              />
              <Drawer.Screen
                name="taskWindow"
                options={{
                  title: 'Task',
                  drawerItemStyle: { display: 'none' },
                  headerTitle: () => null,
                  headerRight: () => <HeaderLogout />,
                  headerLeft: () =>
                    isMobile ? (
                      <HStack style={{ alignItems: 'center' }}>
                        <DrawerToggleButton tintColor="white" />
                        <HeaderButtons screen="projectWindow" />
                      </HStack>
                    ) : (
                      <HeaderButtons screen="taskWindow" />
                    ),
                  headerTintColor: 'white',
                  headerStyle: {
                    ...styles.headerSpace,
                  },
                }}
              />
              <Drawer.Screen
                name="employee/[id]/index"
                options={{
                  title: 'Employee Profile',
                  headerTitle: () => null,
                  headerRight: () => <HeaderLogout />,
                  headerLeft: () =>
                    isMobile ? (
                      <HStack style={{ alignItems: 'center' }}>
                        <DrawerToggleButton tintColor="white" />
                        <HeaderButtons screen="projectWindow" />
                      </HStack>
                    ) : (
                      <HeaderButtons screen="employee-window" />
                    ),
                  drawerItemStyle: { display: 'none' },
                  headerStyle: {
                    ...styles.headerSpace,
                  },
                  headerTintColor: 'white',
                }}
              />
              <Drawer.Screen
                name="create-account-window"
                options={{
                  title: 'Create Account',
                  drawerItemStyle: { display: 'none' },
                  headerTitle: () => null,
                  headerRight: () => <HeaderUserEmail />,
                  headerTintColor: 'white',
                }}
              />
              <Drawer.Screen
                name="profileEditWindow"
                options={{
                  title: 'Edit Profile',
                  drawerItemStyle: { display: 'none' },
                  headerTitle: () => null,
                  headerRight: () => <HeaderUserEmail />,
                  headerTintColor: 'white',
                  headerStyle: {
                    ...styles.headerSpace,
                  },
                }}
              />
            </Drawer>
          </GluestackUIProvider>
        </ProjectProvider>
      </UserProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  headerSpace: {
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 28,
    paddingBottom: 28,
    backgroundColor: 'black',
    alignContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0,
  },
})
