import React from 'react'
import { HStack } from '../ui/hstack'
import { Skeleton, SkeletonText } from '../ui/skeleton'
import { useWindowDimensions, Text } from 'react-native'
import { useRouter } from 'expo-router'
import { VStack } from '../ui/vstack'

const EmployeeProfileSkeleton: React.FC = () => {
  const dimensions = useWindowDimensions()
  const isMobile = dimensions.width <= 1000
  return (
    <>
      {isMobile ? (
        <>
          <HStack style={{ alignItems: 'center', marginBottom: 20 }}>
            <Skeleton
              variant="circular"
              className=" mr-4"
              style={{ height: 60, width: 60 }}
            />
            <VStack space="xs">
              <SkeletonText _lines={1} style={{ height: 20, width: 200 }} />
              <SkeletonText _lines={1} style={{ height: 5, width: 150 }} />
              <SkeletonText _lines={1} style={{ height: 10, width: 50 }} />
            </VStack>
          </HStack>

          <SkeletonText _lines={1} style={{ height: 15, width: 150 }} />
          <Skeleton variant="rounded" className="h-[100px]" />
          <Skeleton variant="rounded" className="h-[100px]" />
          <Skeleton variant="rounded" className="h-[100px]" />
        </>
      ) : (
        <>
          <HStack style={{ alignItems: 'center' }}>
            <Skeleton variant="circular" className="h-[128px] w-[130px] mr-4" />
            <SkeletonText _lines={2} gap={4} className="h-[28px] w-[500px]" />
          </HStack>

          <SkeletonText _lines={1} className="h-[23px] w-[414px]" />
          <Skeleton variant="rounded" className="h-[100px]" />
          <Skeleton variant="rounded" className="h-[100px]" />
          <Skeleton variant="rounded" className="h-[100px]" />
        </>
      )}
    </>
  )
}

export default EmployeeProfileSkeleton
