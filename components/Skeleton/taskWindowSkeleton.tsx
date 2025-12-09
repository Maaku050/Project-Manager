import React from 'react'
import { Skeleton, SkeletonText } from '@/components/ui/skeleton'
import { HStack } from '@/components/ui/hstack'
import { VStack } from '../ui/vstack'
import { Box } from '../ui/box'
import { Divider } from '../ui/divider'
import { useWindowDimensions, Text } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { Pressable } from '../ui/pressable'

const TaskWindowSkeleton = () => {
  const dimensions = useWindowDimensions()
  const isMobile = dimensions.width <= 1000
  const params = useLocalSearchParams()
  const router = useRouter()
  const projectId = params.project as string
  return (
    <>
      {isMobile ? (
        <Pressable
          onPress={() =>
            router.replace(`/(screens)/projectWindow?project=${projectId}`)
          }
          style={{ marginBottom: 20 }}
        >
          <HStack style={{ alignItems: 'center', borderWidth: 0 }} space="sm">
            <ArrowLeft color={'white'} />
            <Text style={{ color: 'white', fontSize: 15 }}>Task Details</Text>
          </HStack>
        </Pressable>
      ) : null}
      {/* Title and Action Button */}
      <HStack
        style={{
          alignItems: 'center',
          borderWidth: 0,
          borderColor: 'red',
        }}
        space="4xl"
      >
        <HStack style={{ flex: 3 }} space="sm">
          <Skeleton variant="sharp" className="h-['100%'] w-[8px] " />
          <VStack style={{ flex: 1 }} space="sm">
            <Skeleton variant="rounded" className="h-[12px] w-[75%]" />
            <Skeleton variant="rounded" className="h-[25px] w-[75%]" />
          </VStack>
        </HStack>

        <HStack
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
          space="lg"
        >
          <Skeleton variant="rounded" className="h-[40px] w-[100px]" />
          <VStack space="xs">
            <Skeleton variant="circular" className="h-[5px] w-[5px] " />
            <Skeleton variant="circular" className="h-[5px] w-[5px] " />
            <Skeleton variant="circular" className="h-[5px] w-[5px] " />
          </VStack>
        </HStack>
      </HStack>

      {/* Description and details */}
      {isMobile ? (
        <VStack style={{ marginTop: 20 }} space="sm">
          <SkeletonText _lines={1} className="h-[10px]" />
          <SkeletonText _lines={1} className="h-[10px] w-[85%]" />
          <SkeletonText _lines={1} className="h-[10px] w-[95%]" />
          <SkeletonText _lines={1} className="h-[10px]" />
          <SkeletonText _lines={1} className="h-[10px] w-[90%]" />

          <VStack style={{ marginTop: 20 }} space="2xl">
            <Skeleton variant="rounded" className="h-[10px] w-[20%]" />
            <Skeleton variant="rounded" className="h-[10px] w-[50%]" />
            <HStack style={{ alignItems: 'center' }} space="sm">
              <Skeleton variant="rounded" className="h-[10px] w-[25%]" />
              <Skeleton variant="circular" className="h-[20px] w-[20px] " />
              <Skeleton variant="circular" className="h-[20px] w-[20px] " />
              <Skeleton variant="circular" className="h-[20px] w-[20px] " />
            </HStack>
          </VStack>
        </VStack>
      ) : (
        <HStack style={{ borderWidth: 0, marginTop: 20 }} space="lg">
          <VStack style={{ flex: 2 }} space="sm">
            <SkeletonText _lines={1} className="h-[10px]" />
            <SkeletonText _lines={1} className="h-[10px] w-[85%]" />
            <SkeletonText _lines={1} className="h-[10px] w-[95%]" />
            <SkeletonText _lines={1} className="h-[10px]" />
            <SkeletonText _lines={1} className="h-[10px] w-[90%]" />
          </VStack>

          <Divider
            orientation="vertical"
            style={{ backgroundColor: '#414141' }}
          />

          <VStack style={{ flex: 1 }} space="2xl">
            <Skeleton variant="rounded" className="h-[10px] w-[20%]" />
            <Skeleton variant="rounded" className="h-[10px] w-[50%]" />
            <HStack style={{ alignItems: 'center' }} space="sm">
              <Skeleton variant="rounded" className="h-[10px] w-[25%]" />
              <Skeleton variant="circular" className="h-[20px] w-[20px] " />
              <Skeleton variant="circular" className="h-[20px] w-[20px] " />
              <Skeleton variant="circular" className="h-[20px] w-[20px] " />
            </HStack>
          </VStack>
        </HStack>
      )}

      <Box style={{ marginTop: 20, flex: 1 }}>
        <Skeleton variant="rounded" style={{ flex: 1 }} />
      </Box>
    </>
  )
}

export default TaskWindowSkeleton
