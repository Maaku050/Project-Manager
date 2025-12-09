import { Project } from '@/_types'
import React, { useState } from 'react'
import { Card } from '../ui/card'
import { Box } from '../ui/box'
import { Text } from '../ui/text'
import { Status } from '@/_enums/status.enum'
import { Grid, GridItem } from '../ui/grid'
import { HStack } from '../ui/hstack'
import { VStack } from '../ui/vstack/index.web'
import { Button, ButtonText } from '../ui/button'
import capitalizeWord from '@/_helpers/capitalizeWord'
import { Pressable } from '../ui/pressable'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useProject } from '@/context/projectContext'
import ProjectBadge from '../projectBadge'
import ProjectUsers from '../projectAssignedUsers'
import Pagination from '../customPagination'

type ClosedProjectCardProps = {
  project: Project[]
}

const PROJECTS_PER_PAGE = 15

const ClosedProjectCard: React.FC<ClosedProjectCardProps> = (props) => {
  const router = useRouter()
  const params = useLocalSearchParams()
  const { setSelectedProject } = useProject()
  const [closedProjectsPage, setClosedProjectsPage] = useState(
    parseInt(params.page as string) || 1
  )

  const totalPages = Math.ceil(props.project.length / PROJECTS_PER_PAGE)
  const startIndex = (closedProjectsPage - 1) * PROJECTS_PER_PAGE
  const endIndex = startIndex + PROJECTS_PER_PAGE
  const closedProjects = props.project.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setClosedProjectsPage(page)
    router.setParams({ page: page.toString() })
  }
  return (
    <>
      <Card style={{ backgroundColor: '#171717' }}>
        <Box style={{ gap: 20 }}>
          <Box
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 800 }}>
              Closed Projects
            </Text>
          </Box>
          {closedProjects.filter((project) => project.status === Status.CLOSED)
            .length > 0 ? (
            <Grid _extra={{ className: 'grid-cols-3 gap-4' }}>
              {closedProjects.reduce((acc: React.ReactNode[], project) => {
                if (project.status === Status.CLOSED) {
                  acc.push(
                    <GridItem
                      key={project.id}
                      _extra={{ className: 'col-span-1' }}
                      style={{ height: '100%' }}
                    >
                      <Pressable
                        onPress={() => {
                          setSelectedProject(project.id)
                          router.push(`/(screens)/projectWindow`)
                        }}
                        style={{ height: '100%' }}
                      >
                        <Card
                          style={{
                            backgroundColor: '#000000',
                            borderColor: '#535252',
                            borderRightWidth: 1,
                            borderBottomWidth: 1,
                            borderLeftWidth: 8,
                            borderTopWidth: 1,
                            height: '100%',
                          }}
                        >
                          <HStack
                            style={{
                              height: '100%',
                            }}
                          >
                            <VStack
                              style={{
                                justifyContent: 'space-between',
                                gap: 10,
                                height: '100%',
                                width: '100%',
                              }}
                            >
                              <Text
                                style={{
                                  color: 'white',
                                  fontSize: 16,
                                  fontWeight: 600,
                                }}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                              >
                                {project.title}
                              </Text>
                              <HStack
                                style={{
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <ProjectBadge projectID={project.id} />
                                <ProjectUsers projectID={project.id} />
                              </HStack>
                            </VStack>
                          </HStack>
                        </Card>
                      </Pressable>
                    </GridItem>
                  )
                }
                return acc
              }, [])}
            </Grid>
          ) : (
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                fontWeight: 500,
                textAlign: 'center',
                paddingBottom: 20,
              }}
            >
              No closed projects
            </Text>
          )}
        </Box>
        {/* Pagination Controls */}
        <Pagination
          currentPage={closedProjectsPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Card>
    </>
  )
}

export default ClosedProjectCard
