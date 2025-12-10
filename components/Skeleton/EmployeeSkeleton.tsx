import React from 'react'
import { Skeleton, SkeletonText } from '../ui/skeleton'
import { HStack } from '../ui/hstack'
import { useWindowDimensions, Text } from 'react-native'
import { Box } from '../ui/box'
import { Users } from 'lucide-react-native'

const EmployeeSkeleton = () => {
  const dimensions = useWindowDimensions()
  const isMobile = dimensions.width <= 1000
  return (
    <>
      {isMobile ? (
        <Box style={{ marginBottom: 20 }}>
          <HStack style={{ alignItems: 'center' }} space="sm">
            <Users color={'white'} size={20} />
            <Text style={{ color: 'white', fontSize: 15 }}>Employee</Text>
          </HStack>
        </Box>
      ) : null}

      <HStack
        style={{
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <SkeletonText
          _lines={1}
          className={isMobile ? 'h-[15px] w-[100px]' : 'h-[28px] w-[248px]'}
        />
        <Skeleton
          variant="rounded"
          className={isMobile ? 'h-[40px] w-[250px]' : 'h-[44px] w-[322px]'}
        />
      </HStack>

      <Skeleton variant="rounded" className="h-[100px]" />
      <Skeleton variant="rounded" className="h-[100px]" />
      <Skeleton variant="rounded" className="h-[100px]" />
      <Skeleton variant="rounded" className="h-[100px]" />
      <Skeleton variant="rounded" className="h-[100px]" />
    </>
  )
}

export default EmployeeSkeleton
