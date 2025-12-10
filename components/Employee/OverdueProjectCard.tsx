import { Project } from '@/_types'
import React from 'react'
import { Card } from '../ui/card'
import { Box } from '../ui/box'
import { Text } from '../ui/text'
import { Grid, GridItem } from '../ui/grid'
import { Status } from '@/_enums/status.enum'
import { Pressable } from '../ui/pressable'
import { HStack } from '../ui/hstack'
import { VStack } from '../ui/vstack'
import { Button, ButtonText } from '../ui/button'
import capitalizeWord from '@/_helpers/capitalizeWord'
import { useRouter } from 'expo-router'
import { useProject } from '@/context/projectContext'
import ProjectUsers from '../projectAssignedUsers'
import ProjectBadge from '../projectBadge'
import { useWindowDimensions } from 'react-native'

type OverdueProjectCardProps = {
  project: Project[]
}

const OverdueProjectCard: React.FC<OverdueProjectCardProps> = (props) => {
  const dimensions = useWindowDimensions()
  const isDesktop = dimensions.width >= 1200
  const isMedium = dimensions.width < 1200 && dimensions.width > 768
  const isMobile = dimensions.width <= 786
  const router = useRouter()
  const { setSelectedProject } = useProject()
  return (
    <>
      <Card style={{ backgroundColor: '#171717' }}>
        <Box style={{ gap: 20 }}>
          <Box
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: isMobile ? 16 : 20,
                fontWeight: 800,
              }}
            >
              Overdue Projects
            </Text>
          </Box>
          {props.project.filter(
            (project) =>
              project.deadline &&
              project.deadline.toDate() < new Date() &&
              project.status != Status.CLOSED
          ).length > 0 ? (
            <Grid
              _extra={{
                className: isDesktop
                  ? 'grid-cols-3 gap-4'
                  : isMedium
                    ? 'grid-cols-2 gap-4'
                    : isMobile
                      ? 'grid-cols-1 gap-4'
                      : '',
              }}
            >
              {props.project.reduce((acc: React.ReactNode[], project) => {
                if (
                  project.deadline &&
                  project.deadline.toDate() < new Date() &&
                  project.status != Status.CLOSED
                ) {
                  acc.push(
                    <GridItem
                      key={project.id}
                      _extra={{ className: 'col-span-1' }}
                      style={{ height: '100%' }}
                    >
                      <Pressable
                        onPress={() => {
                          setSelectedProject(project.id)
                          router.push(
                            `/(screens)/projectWindow?project=${project.id}`
                          )
                        }}
                        style={{ height: '100%' }}
                      >
                        <Card
                          style={{
                            backgroundColor: '#000000',
                            borderColor: '#B91C1C',
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
                                  fontSize: isMobile ? 14 : 16,
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
                fontSize: isMobile ? 12 : 16,
                fontWeight: 500,
                textAlign: 'center',
                paddingBottom: 20,
              }}
            >
              No overdue projects
            </Text>
          )}
        </Box>
      </Card>
    </>
  )
}
export default OverdueProjectCard
