import React from 'react'
import { Text, useWindowDimensions } from 'react-native'
import { Skeleton, SkeletonText } from '@/components/ui/skeleton'
import { HStack } from '@/components/ui/hstack'
import { Box } from '../ui/box'
import { Folder } from 'lucide-react-native'

const ProjectSkeleton = () => {
  const dimensions = useWindowDimensions()
  const isMobile = dimensions.width <= 768
  return (
    <>
      {isMobile ? (
        <Box style={{ marginBottom: 20 }}>
          <HStack style={{ alignItems: 'center' }} space="sm">
            <Folder color={'white'} size={20} />
            <Text style={{ color: 'white', fontSize: 15 }}>Projects</Text>
          </HStack>
        </Box>
      ) : null}
      <HStack
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 60,
        }}
        space="sm"
      >
        <SkeletonText _lines={1} className="h-[28px] w-[150px]" />]
        {isMobile ? (
          <Skeleton variant="rounded" className="h-[44px] w-[300px]" />
        ) : (
          <Skeleton variant="rounded" className="h-[44px] w-[250px]" />
        )}
      </HStack>
      <Skeleton variant="rounded" className="h-[250px] mb-5" />
      <Skeleton variant="rounded" className="h-[250px] mb-5" />
      <Skeleton variant="rounded" className="h-[250px] mb-5" />
    </>
  )
}

export default ProjectSkeleton
