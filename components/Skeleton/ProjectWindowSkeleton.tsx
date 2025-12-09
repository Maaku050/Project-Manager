import React from 'react'
import { Skeleton, SkeletonText } from '@/components/ui/skeleton'
import { HStack } from '@/components/ui/hstack'
import { VStack } from '../ui/vstack'
import { Box } from '../ui/box'
import { Divider } from '../ui/divider'
import { Pressable, useWindowDimensions, Text } from 'react-native'
import { useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'

const ProjectWindowSkeleton = () => {
  const dimensions = useWindowDimensions()
  const isMobile = dimensions.width <= 768
  const router = useRouter()
  return (
    <>
      {isMobile ? (
        <Pressable
          onPress={() => router.replace('/(screens)/project')}
          style={{ marginBottom: 30 }}
        >
          <HStack style={{ alignItems: 'center', borderWidth: 0 }} space="sm">
            <ArrowLeft color={'white'} />
            <Text style={{ color: 'white', fontSize: 15 }}>
              Project Details
            </Text>
          </HStack>
        </Pressable>
      ) : null}
      <Box style={{ borderWidth: 0, marginBottom: isMobile ? 20 : 30 }}>
        <HStack
          style={{ justifyContent: 'space-between', alignItems: 'center' }}
          space="4xl"
        >
          <Skeleton
            variant="rounded"
            className={isMobile ? 'h-[25px]' : 'h-[40px]'}
            style={{ flex: 3 }}
          />
          <Skeleton
            variant="rounded"
            className={isMobile ? 'h-[25px]' : 'h-[40px]'}
            style={{ flex: 1 }}
          />
        </HStack>
      </Box>

      {isMobile ? (
        <>
          <Box style={{ marginBottom: 20 }}>
            <SkeletonText _lines={5} className="h-[10px]" />
          </Box>
          <VStack space="md" style={{ marginBottom: 10 }}>
            <Skeleton variant="rounded" className="h-[10px] w-[75px] " />
            <Skeleton variant="rounded" className="h-[10px] w-[85px] " />
            <HStack space="sm" style={{ alignItems: 'center' }}>
              <Skeleton variant="rounded" className="h-[10px] w-[110px] " />
              <Skeleton variant="circular" className="h-[30px] w-[30px] " />
              <Skeleton variant="circular" className="h-[30px] w-[30px] " />
              <Skeleton variant="circular" className="h-[30px] w-[30px] " />
            </HStack>
          </VStack>
          <Divider
            orientation="horizontal"
            style={{ backgroundColor: 'gray', marginBottom: 10 }}
          />
          <VStack space="sm" style={{ marginBottom: 20 }}>
            <SkeletonText _lines={1} className="h-[10px] w-[70px]" />
            <HStack space="sm">
              <Skeleton variant="rounded" className="h-[60px] w-[80px] " />
              <Skeleton variant="rounded" className="h-[60px] w-[80px] " />
              <Skeleton variant="rounded" className="h-[60px] w-[80px] " />
              <Skeleton variant="rounded" className="h-[60px] w-[80px] " />
            </HStack>
          </VStack>
        </>
      ) : (
        <Box style={{ borderWidth: 0, marginBottom: 40 }}>
          <HStack>
            {/* Description / Status / Deadline / Assigned users */}
            <Box style={{ flex: 3, paddingRight: 20 }}>
              {/* Description */}
              <SkeletonText _lines={3} className="h-[10px]" />

              <Box style={{ borderWidth: 0, flex: 1, marginTop: 30 }}>
                <HStack style={{ flex: 1, alignItems: 'center' }} space="md">
                  {/* Status */}
                  <Skeleton variant="rounded" className="h-[20px] w-[250px] " />

                  {/* Vertical Divider */}
                  <Divider
                    orientation="vertical"
                    style={{ backgroundColor: 'gray' }}
                  />

                  {/* Deadline */}
                  <Skeleton variant="rounded" className="h-[20px] w-[250px] " />

                  {/* Vertical Divider */}
                  <Divider
                    orientation="vertical"
                    style={{ backgroundColor: 'gray' }}
                  />

                  {/* Assigned Users */}
                  <HStack space="sm">
                    <Skeleton
                      variant="rounded"
                      className="h-[20px] w-[150px] "
                    />
                    <Skeleton
                      variant="circular"
                      className="h-[20px] w-[20px] "
                    />
                    <Skeleton
                      variant="circular"
                      className="h-[20px] w-[20px] "
                    />
                    <Skeleton
                      variant="circular"
                      className="h-[20px] w-[20px] "
                    />
                  </HStack>
                </HStack>
              </Box>
            </Box>

            {/* Divider */}
            <Box style={{ flex: 0 }}>
              <Divider
                orientation="vertical"
                style={{ backgroundColor: 'gray' }}
              />
            </Box>

            {/* Tasks Summary */}
            <Box
              style={{
                flex: 1,
                borderWidth: 0,
                paddingLeft: 20,
              }}
            >
              <SkeletonText _lines={1} className="h-[10px] w-[70px]" />
              <HStack space="sm" style={{ marginTop: 20 }}>
                <Skeleton variant="rounded" className="h-[60px] w-[80px] " />
                <Skeleton variant="rounded" className="h-[60px] w-[80px] " />
                <Skeleton variant="rounded" className="h-[60px] w-[80px] " />
                <Skeleton variant="rounded" className="h-[60px] w-[80px] " />
              </HStack>
            </Box>
          </HStack>
        </Box>
      )}

      <VStack space="md" style={{ borderWidth: 0, marginBottom: 10 }}>
        <HStack
          style={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Skeleton
            variant="rounded"
            className={isMobile ? 'h-[15px] w-[150px] ' : 'h-[20px] w-[200px] '}
          />
          <Skeleton variant="rounded" className="h-[40px] w-[130px]" />
        </HStack>
        <Skeleton variant="rounded" className="h-[10px] " />
      </VStack>

      {isMobile ? (
        <Skeleton variant="rounded" className="h-[100px]" />
      ) : (
        <HStack space="md" style={{ justifyContent: 'center' }}>
          <Skeleton variant="rounded" className=" w-[470px] h-[100px]" />
          <Skeleton variant="rounded" className=" w-[470px] h-[100px]" />
          <Skeleton variant="rounded" className=" w-[470px] h-[100px]" />
        </HStack>
      )}
    </>
  )
}

export default ProjectWindowSkeleton
