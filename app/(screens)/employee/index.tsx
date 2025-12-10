import React from 'react'
import { Text, ScrollView, useWindowDimensions } from 'react-native'
import { useUser } from '@/context/profileContext'
import { Box } from '@/components/ui/box'
import { ButtonGroup } from '@/components/ui/button'
import AddRoleModal from '@/components/Modal/AddRoleModal'
import AddEmployeeModal from '@/components/Modal/AddEmployeeModal'
import EmployeeSkeleton from '@/components/Skeleton/EmployeeSkeleton'
import ArchivedEmployeeCard from '@/components/Employee/ArchivedEmployeeCard'
import EmployeeCard from '@/components/Employee/EmployeeCard'
import { useProject } from '@/context/projectContext'
import { Pressable } from '@/components/ui/pressable'
import { HStack } from '@/components/ui/hstack'
import { ArrowLeft, Users } from 'lucide-react-native'
import { useRouter } from 'expo-router'

export default function EmployeeScreen() {
  const dimensions = useWindowDimensions()
  const isMobile = dimensions.width <= 786
  const router = useRouter()
  const { roles } = useProject()
  const { profiles, setSelectedEmployee } = useUser()
  console.log('🚀 ~ EmployeeScreen ~ profiles:', profiles)
  const isLoading = !profiles

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: 'black',
        padding: 12,
      }}
      contentContainerStyle={{
        alignItems: 'flex-start',
      }}
      showsVerticalScrollIndicator={false}
    >
      <Box
        style={{
          gap: 20,
          width: '100%',
          borderTopWidth: isMobile ? 0 : 30,
          borderColor: 'transparent',
        }}
      >
        {!isLoading ? (
          <>
            {isMobile ? (
              <Box
                style={{
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box style={{ marginBottom: 20 }}>
                  <HStack style={{ alignItems: 'center' }} space="sm">
                    <Users color={'white'} size={20} />
                    <Text style={{ color: 'white', fontSize: 15 }}>
                      Employee
                    </Text>
                  </HStack>
                </Box>

                <HStack
                  style={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 13,
                      fontWeight: 800,
                    }}
                  >
                    {profiles?.length} total employee/s
                  </Text>
                  <HStack>
                    <AddRoleModal />
                    <AddEmployeeModal />
                  </HStack>
                </HStack>
              </Box>
            ) : (
              <Box
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 24,
                      fontWeight: 800,
                    }}
                  >
                    {profiles?.length} total employee/s
                  </Text>
                </Box>
                <Box
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <ButtonGroup>
                    <AddRoleModal />
                  </ButtonGroup>
                  <ButtonGroup>
                    <AddEmployeeModal />
                  </ButtonGroup>
                </Box>
              </Box>
            )}

            {roles
              .sort((a, b) => {
                // Project Manager always comes first
                if (a.role === 'Project Manager') return -1
                if (b.role === 'Project Manager') return 1

                // Intern always comes last
                if (a.role === 'Intern') return 1
                if (b.role === 'Intern') return -1

                // For other roles, sort by createdAt (oldest first)
                const aTime = a.createdAt?.toDate?.() || new Date(0)
                const bTime = b.createdAt?.toDate?.() || new Date(0)

                return aTime.getTime() - bTime.getTime() // Ascending order (oldest first)
              })
              .map((role) => (
                <EmployeeCard
                  key={role.id}
                  profiles={profiles}
                  role={role.role}
                  color={role.color}
                />
              ))}
            <ArchivedEmployeeCard profiles={profiles} />
          </>
        ) : (
          <EmployeeSkeleton />
        )}
      </Box>
    </ScrollView>
  )
}
