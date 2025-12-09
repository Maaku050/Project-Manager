import { Box } from '@/components/ui/box'
import { ScrollView, useWindowDimensions, View } from 'react-native'
import { Text } from '@/components/ui/text'
import { Button, ButtonText } from '@/components/ui/button'
import { useProject } from '@/context/projectContext'
import { Heading } from '@/components/ui/heading'
import { useState } from 'react'
import {
  useRouter,
  useLocalSearchParams,
  useGlobalSearchParams,
} from 'expo-router'
import React from 'react'
import ProjectAddModal from '@/modals/projectAddModal'
import { HStack } from '@/components/ui/hstack'
import { Folder, Plus } from 'lucide-react-native'
import ProjectCard from '@/components/projectCard'
import Pagination from '@/components/customPagination'
import ProjectSkeleton from '@/components/Skeleton/ProjectSkeleton'

const PROJECTS_PER_PAGE = 1

export default function Sample() {
  const dimensions = useWindowDimensions()
  const isLargeScreen = dimensions.width >= 1280
  const isMediumScreen = dimensions.width <= 1280 && dimensions.width > 768
  const isMobile = dimensions.width <= 768
  const isDesktop = dimensions.width >= 1280
  const router = useRouter()
  const params = useGlobalSearchParams()
  const { project, loading } = useProject()

  const [showModal, setShowModal] = useState(false)
  const [closedProjectsPage, setClosedProjectsPage] = useState(
    parseInt(params.page as string) || 1
  )
  const ongoingProjects = project.filter(
    (t) =>
      t.status === 'Ongoing' && t?.deadline && t.deadline.toDate() > new Date()
  )
  const allClosedProjects = project.filter((t) => t.status === 'Closed')
  const overdueProjects = project.filter(
    (t) =>
      t?.deadline &&
      t.deadline.toDate() < new Date() &&
      t.status != 'Archived' &&
      t.status != 'Closed'
  )

  const totalProjects =
    ongoingProjects.length + allClosedProjects.length + overdueProjects.length

  // Calculate pagination
  const totalPages = Math.ceil(allClosedProjects.length / PROJECTS_PER_PAGE)
  const startIndex = (closedProjectsPage - 1) * PROJECTS_PER_PAGE
  const endIndex = startIndex + PROJECTS_PER_PAGE
  const closedProjects = allClosedProjects.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setClosedProjectsPage(page)
    router.setParams({ page: page.toString() })
  }

  return (
    <>
      {!loading ? (
        <>
          {ongoingProjects.length === 0 &&
          allClosedProjects.length === 0 &&
          overdueProjects.length === 0 ? (
            <View
              style={{
                backgroundColor: '#000000',
                padding: isLargeScreen ? 20 : isMediumScreen ? 12 : 8,
                minHeight: '100%',
                borderColor: 'red',
                borderWidth: 0,
                flex: 1,
              }}
            >
              {isMobile ? (
                <Box style={{ marginBottom: 20 }}>
                  <HStack style={{ alignItems: 'center' }} space="sm">
                    <Folder color={'white'} size={20} />
                    <Text style={{ color: 'white', fontSize: 15 }}>
                      Projects
                    </Text>
                  </HStack>
                </Box>
              ) : null}
              <Box style={{ borderWidth: 0, marginBottom: 30 }}>
                <HStack
                  style={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Heading
                    style={{
                      fontSize: 18,
                      color: 'white',
                      fontFamily: 'roboto, arial',
                      fontWeight: 'bold',
                    }}
                  >
                    {totalProjects} total projects
                  </Heading>
                  <Button
                    style={{ backgroundColor: 'white', borderRadius: 8 }}
                    onPress={() =>
                      isMobile
                        ? router.replace('./addProjectScreen')
                        : setShowModal(true)
                    }
                  >
                    <ButtonText style={{ color: 'black' }}>
                      <HStack>
                        <Plus /> Add Project
                      </HStack>
                    </ButtonText>
                  </Button>
                </HStack>
              </Box>
              <Box
                style={{
                  flex: 1,
                  borderWidth: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Heading
                  style={{
                    fontSize: 16,
                    color: 'gray',
                    fontFamily: 'arial',
                  }}
                >
                  No Project yet
                </Heading>
                <Text>There is no Project for now</Text>
              </Box>
            </View>
          ) : (
            <ScrollView
              style={{
                backgroundColor: '#000000',
                padding: isLargeScreen ? 20 : isMediumScreen ? 12 : 8,
                minHeight: '100%',
                borderColor: 'red',
                borderWidth: 0,
                flex: 1,
              }}
              showsVerticalScrollIndicator={false}
            >
              {isMobile ? (
                <Box style={{ marginBottom: 20 }}>
                  <HStack style={{ alignItems: 'center' }} space="sm">
                    <Folder color={'white'} size={20} />
                    <Text style={{ color: 'white', fontSize: 15 }}>
                      Projects
                    </Text>
                  </HStack>
                </Box>
              ) : null}

              <Box style={{ borderWidth: 0, marginBottom: 30 }}>
                <HStack
                  style={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Heading
                    style={{
                      fontSize: 18,
                      color: 'white',
                      fontFamily: 'roboto, arial',
                      fontWeight: 'bold',
                    }}
                  >
                    {totalProjects} total projects
                  </Heading>
                  <Button
                    style={{ backgroundColor: 'white', borderRadius: 8 }}
                    onPress={() =>
                      isMobile
                        ? router.replace('./addProjectScreen')
                        : setShowModal(true)
                    }
                  >
                    <ButtonText style={{ color: 'black' }}>
                      <HStack>
                        <Plus /> Add Project
                      </HStack>
                    </ButtonText>
                  </Button>
                </HStack>
              </Box>

              {overdueProjects.length > 0 ? (
                <Box
                  style={{
                    borderWidth: 0,
                    padding: 15,
                    borderRadius: 8,
                    backgroundColor: '#171717',
                    marginBottom: 15,
                  }}
                >
                  <Box style={{ marginBottom: 20 }}>
                    <HStack style={{ justifyContent: 'space-between' }}>
                      <Heading style={{ color: 'white' }}>
                        Overdue Projects
                      </Heading>
                      <Text
                        style={{
                          color: 'white',
                          fontFamily: 'arial',
                          fontSize: 16,
                        }}
                      >
                        {overdueProjects.length} project/s
                      </Text>
                    </HStack>
                  </Box>
                  <HStack
                    style={{
                      alignContent: 'flex-start',
                      gap: isLargeScreen ? 12 : isMediumScreen ? 12 : 8,
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      borderWidth: 0,
                      alignItems: 'stretch',
                    }}
                  >
                    {overdueProjects.map((t) => (
                      <ProjectCard key={t.id} projectID={t.id} />
                    ))}
                  </HStack>
                </Box>
              ) : (
                ''
              )}

              {ongoingProjects.length > 0 ? (
                <Box
                  style={{
                    borderWidth: 0,
                    padding: 15,
                    borderRadius: 8,
                    backgroundColor: '#171717',
                    marginBottom: 15,
                  }}
                >
                  <Box style={{ marginBottom: 20 }}>
                    <HStack style={{ justifyContent: 'space-between' }}>
                      <Heading style={{ color: 'white' }}>
                        Ongoing Projects
                      </Heading>
                      <Text
                        style={{
                          color: 'white',
                          fontFamily: 'arial',
                          fontSize: 16,
                        }}
                      >
                        {ongoingProjects.length} project/s
                      </Text>
                    </HStack>
                  </Box>
                  <HStack
                    style={{
                      alignContent: 'flex-start',
                      gap: isLargeScreen ? 12 : isMediumScreen ? 12 : 8,
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      borderWidth: 0,
                      alignItems: 'stretch',
                    }}
                  >
                    {ongoingProjects.map((t) => (
                      <ProjectCard key={t.id} projectID={t.id} />
                    ))}
                  </HStack>
                </Box>
              ) : (
                ''
              )}

              {allClosedProjects.length > 0 ? (
                <Box
                  style={{
                    borderWidth: 0,
                    padding: 15,
                    borderRadius: 8,
                    backgroundColor: '#171717',
                    marginBottom: 15,
                  }}
                >
                  <Box style={{ marginBottom: 20 }}>
                    <HStack style={{ justifyContent: 'space-between' }}>
                      <Heading style={{ color: 'white' }}>
                        Closed Projects
                      </Heading>
                      <Text
                        style={{
                          color: 'white',
                          fontFamily: 'arial',
                          fontSize: 16,
                        }}
                      >
                        {allClosedProjects.length} project/s
                      </Text>
                    </HStack>
                  </Box>
                  <HStack
                    style={{
                      alignContent: 'flex-start',
                      gap: isLargeScreen ? 12 : isMediumScreen ? 12 : 8,
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      borderWidth: 0,
                      alignItems: 'stretch',
                    }}
                  >
                    {closedProjects.map((t) => (
                      <ProjectCard key={t.id} projectID={t.id} />
                    ))}
                  </HStack>

                  {/* Pagination Controls */}
                  <Pagination
                    currentPage={closedProjectsPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </Box>
              ) : (
                ''
              )}

              <ProjectAddModal
                visible={showModal}
                onClose={() => setShowModal(false)}
              />
            </ScrollView>
          )}
        </>
      ) : (
        <View
          style={{
            backgroundColor: '#000000',
            padding: isLargeScreen ? 20 : isMediumScreen ? 12 : 8,
            borderColor: 'red',
            borderWidth: 0,
            flex: 1,
          }}
        >
          <ProjectSkeleton />
        </View>
      )}
    </>
  )
}
