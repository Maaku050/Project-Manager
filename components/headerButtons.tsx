import React from 'react'
import { Pressable, Text, useWindowDimensions, View, Image } from 'react-native'
import { HStack } from './ui/hstack'
import { ArrowLeft, Folder, House, LayoutDashboard } from 'lucide-react-native'
import {
  router,
  useGlobalSearchParams,
  useLocalSearchParams,
} from 'expo-router'

type HeaderButtonType = {
  screen: string
}

export default function HeaderButtons({ screen }: HeaderButtonType) {
  const params = useGlobalSearchParams()
  const dimensions = useWindowDimensions()
  const isMobile = dimensions.width <= 768
  return (
    <>
      {screen === 'home' ? (
        <HStack style={{ alignItems: 'center', marginLeft: 20 }} space="sm">
          <House color={'white'} />
          <Text style={{ color: 'white', fontSize: 20 }}>Home</Text>
        </HStack>
      ) : screen === 'dashboard' ? (
        <HStack style={{ alignItems: 'center', marginLeft: 20 }} space="sm">
          <LayoutDashboard color={'white'} />
          <Text style={{ color: 'white', fontSize: 20 }}>Dashboard</Text>
        </HStack>
      ) : screen === 'project' ? (
        <>
          {isMobile ? (
            <Image
              source={require('@/assets/images/final dark logo.png')} // Your logo path
              style={{ width: 60, height: 30 }}
              resizeMode="contain"
            />
          ) : (
            <HStack style={{ alignItems: 'center', marginLeft: 20 }} space="sm">
              <Folder color={'white'} />
              <Text style={{ color: 'white', fontSize: 20 }}>Projects</Text>
            </HStack>
          )}
        </>
      ) : screen === 'projectWindow' ? (
        <>
          {isMobile ? (
            <Image
              source={require('@/assets/images/final dark logo.png')} // Your logo path
              style={{ width: 60, height: 30 }}
              resizeMode="contain"
            />
          ) : (
            <Pressable onPress={() => router.replace('/(screens)/project')}>
              <HStack
                style={{ alignItems: 'center', marginLeft: 20 }}
                space="sm"
              >
                <ArrowLeft color={'white'} />
                <Text style={{ color: 'white', fontSize: 20 }}>
                  Project Details
                </Text>
              </HStack>
            </Pressable>
          )}
        </>
      ) : screen === 'taskWindow' ? (
        <Pressable
          onPress={() =>
            router.replace({
              pathname: '/(screens)/projectWindow',
              params: { project: params.project as string },
            })
          }
        >
          <HStack style={{ alignItems: 'center', marginLeft: 20 }} space="sm">
            <ArrowLeft color={'white'} />
            <Text style={{ color: 'white', fontSize: 20 }}>Task Details</Text>
          </HStack>
        </Pressable>
      ) : screen === 'employee' ? (
        <HStack style={{ alignItems: 'center', marginLeft: 20 }} space="sm">
          <Folder color={'white'} />
          <Text style={{ color: 'white', fontSize: 20 }}>Employees</Text>
        </HStack>
      ) : screen === 'employee-window' ? (
        <Pressable onPress={() => router.push('/(screens)/employee')}>
          <HStack style={{ alignItems: 'center', marginLeft: 20 }} space="sm">
            <ArrowLeft color={'white'} />
            <Text style={{ color: 'white', fontSize: 20 }}>
              Employee Profile
            </Text>
          </HStack>
        </Pressable>
      ) : screen === 'profileEditWindow' ? (
        <HStack style={{ alignItems: 'center', marginLeft: 20 }} space="sm">
          <House color={'white'} />
          <Text style={{ color: 'white', fontSize: 20 }}>Home</Text>
        </HStack>
      ) : screen === 'projectJournalScreen' ? (
        <Pressable
          onPress={() =>
            router.replace({
              pathname: '/(screens)/projectWindow',
              params: { project: params.project as string },
            })
          }
        >
          <HStack style={{ alignItems: 'center', marginLeft: 20 }} space="sm">
            <ArrowLeft color={'white'} />
            <Text style={{ color: 'white', fontSize: 20 }}>
              Project Journal
            </Text>
          </HStack>
        </Pressable>
      ) : (
        ''
      )}
    </>
  )
}
