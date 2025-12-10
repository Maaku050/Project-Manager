import { useProject } from '@/context/projectContext'
import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Pressable, StyleSheet, useWindowDimensions } from 'react-native'
import { useRouter } from 'expo-router'
import { Box } from '@/components/ui/box'
import { HStack } from './ui/hstack/index.web'
import { Progress, ProgressFilledTrack } from '@/components/ui/progress'
import ProjectBadge from './projectBadge'
import ProjectUsers from './projectAssignedUsers'
import { Text } from '@/components/ui/text'
import TaskProgressBar from './taskProgressBar'

type items = {
  projectID: string
}

export default function ProjectBar({ projectID }: items) {
  const router = useRouter()
  const { project, setSelectedProject, tasks } = useProject()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const dimensions = useWindowDimensions()
  const isLargeScreen = dimensions.width >= 1280 // computer UI condition
  const isMediumScreen = dimensions.width <= 1280 && dimensions.width > 768 // tablet UI condition
  // const currentProjectData = project.find((t) => t.id === selectedProject);

  const truncateWords = (text: string, wordLimit: number) => {
    const words = text.split(' ')
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(' ') + ' ...'
      : text
  }

  const styles = StyleSheet.create({
    dateStatus: {
      borderWidth: 0,
      flex: 1,
      borderColor: 'blue',
      color: 'white',
      textAlign: 'center',
      fontFamily: 'roboto, arial',
      fontSize: isLargeScreen || isMediumScreen ? 20 : 16,      
    },
    otherItems: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 0,
      borderColor: "#fff"
    },
    projectTitle: {
      textDecorationLine:
          hoveredId === projectID ? 'underline' : 'none',
      flex: 1,
      flexWrap: 'wrap',
      color: 'white',
      fontWeight: 'normal',
      fontSize: isLargeScreen || isMediumScreen ? 20 : 16,
      fontFamily: 'roboto, arial',
    },
  })


  const currentProject = project.find((t) => t.id === projectID)
  if (!currentProject) return

  return (
    <>
      <Card
        size="sm"
        variant="outline"
        className="m-3"
        key={projectID}
        style={{
          borderWidth: 0,
          borderColor: 'yellow',
          padding: 12,
          minHeight: 70,
          maxHeight: '30%',
          flexDirection: isLargeScreen || isMediumScreen ? 'row' : 'column',
          justifyContent: 'space-between',
        }}
      >
        <Pressable
          onPress={() => {
            // setSelectedProject(projectID)
            router.push(`/projectWindow?project=${projectID}`) // or open modal directly
          }}
          onHoverIn={() => setHoveredId(projectID)}
          onHoverOut={() => setHoveredId(null)}
          style={{ flex: 1 }}
        >
          <HStack style={{ flex: 1, gap: 20 }}>
            {/* -------------------------------project <title></title>-------------------------------- */}
            <Box style={{ borderWidth: 0, borderColor: 'orange', flex: 2 }}>
              <Text
                style={{
                  ...styles.projectTitle
                }}
              >
                {truncateWords(currentProject.title, 7)}
              </Text>
            </Box>

            {/* ------------------------------------------task progress----------------------------------- */}
            <HStack
              style={{
                ...styles.otherItems,
              }}
            >
              <TaskProgressBar
                key={projectID}
                projectID={projectID}
                origin="dashboard"
              />
            </HStack>

            {/* -----------------------Status-------------------------- */}
            <Box
              style={{
                ...styles.otherItems, 
                alignContent: "center",
                alignItems: "center"
              }}
            >
              <ProjectBadge projectID={projectID} />
            </Box>

            {/* --------------------------avatar area--------------------- */}
            <Box
              style={{
                ...styles.otherItems
              }}
            >
              <ProjectUsers projectID={projectID} />
            </Box>

            {/* -------------------date area-------------------- */}
            <Text
              style={{
                ...styles.dateStatus,
              }}
            >
              {currentProject.startedAt?.toDate().toLocaleDateString()}
            </Text>

            <Text
              style={{
                ...styles.dateStatus,
              }}
            >
              {currentProject.deadline?.toDate().toLocaleDateString()}
            </Text>
          </HStack>
        </Pressable>
      </Card>
    </>
  )
}
