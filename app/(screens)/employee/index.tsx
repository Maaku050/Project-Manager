import React from 'react'
import { Text, ScrollView } from 'react-native'
import { useUser } from '@/context/profileContext'
import { Box } from '@/components/ui/box'
import { ButtonGroup } from '@/components/ui/button'
import ProjectManagerCard from '@/components/Employee/ProjectManagerCard'
import FullStackDeveloperCard from '@/components/Employee/FullStackDeveloperCard'
import UXDesignerCard from '@/components/Employee/UXDesignerCard'
import QACard from '@/components/Employee/QACard'
import InternCard from '@/components/Employee/InternCard'
import AddRoleModal from '@/components/Modal/AddRoleModal'
import AddEmployeeModal from '@/components/Modal/AddEmployeeModal'
import EmployeeSkeleton from '@/components/Skeleton/EmployeeSkeleton'
import ArchivedEmployeeCard from '@/components/Employee/ArchivedEmployeeCard'
import EmployeeCard from '@/components/Employee/EmployeeCard'
import { useProject } from '@/context/projectContext'

export default function EmployeeScreen() {
  const { roles } = useProject()
  const { profiles, setSelectedEmployee } = useUser()
  console.log('🚀 ~ EmployeeScreen ~ profiles:', profiles)
  const isLoading = !profiles

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: 'black',
      }}
      contentContainerStyle={{
        alignItems: 'flex-start',
        padding: 12,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Box
        style={{
          gap: 20,
          width: '100%',
          borderTopWidth: 30,
          borderColor: 'transparent',
        }}
      >
        {!isLoading ? (
          <>
            <Box
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
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

            {/* <ProjectManagerCard profiles={profiles} />
            <FullStackDeveloperCard profiles={profiles} />
            <UXDesignerCard profiles={profiles} />
            <QACard profiles={profiles} />
            <InternCard profiles={profiles} /> */}
            <ArchivedEmployeeCard profiles={profiles} />
          </>
        ) : (
          <EmployeeSkeleton />
        )}
      </Box>
    </ScrollView>
  )
}
