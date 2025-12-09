import { Box } from '@/components/ui/box'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native'
import { Text } from '@/components/ui/text'
import { useProject } from '@/context/projectContext'
import { Divider } from '@/components/ui/divider'
import { useState } from 'react'
import React from 'react'
import { HStack } from '@/components/ui/hstack'
import {
  ArrowLeft,
  CircleX,
  EllipsisVertical,
  Folder,
  NotebookPen,
  Repeat,
  SquarePen,
  Trash,
} from 'lucide-react-native'
import ProjectEditModal from '@/modals/projectEditModal'
import TaskAddModal from '@/modals/taskAddModal'
import ProjectUsers from '@/components/projectAssignedUsers'
import TaskSummary from '@/components/taskSummary'
import TaskProgressBar from '@/components/taskProgressBar'
import TodoTasks from '@/components/todoTasks'
import OngoingTasks from '@/components/ongoingTasks'
import CompletedTasks from '@/components/completedTasks'
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu'
import ProjectDeleteModal from '@/modals/projectDeleteModal'
import ProjectCloseModal from '@/modals/projectCloseModal'
import ProjectReopenModal from '@/modals/projectReopenModal'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { truncate } from '@/helpers/truncateWords'
import ProjectWindowSkeleton from '@/components/Skeleton/ProjectWindowSkeleton'
import { Icon } from '@/components/ui/icon'
import { VStack } from '@/components/ui/vstack'

export default function ProjectWindow() {
  const dimensions = useWindowDimensions()
  const isMobile = dimensions.width <= 1000
  const router = useRouter()
  const params = useLocalSearchParams()
  const projectID = params.project as string
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [showEditProjectModal, setShowEditProjectModal] = useState(false)
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false)
  const [showCloseProjectModal, setShowCloseProjectModal] = useState(false)
  const [showReopenProjectModal, setShowReopenProjectModal] = useState(false)
  const [journalHover, setJournalHover] = useState(false)
  const { project, loading } = useProject()
  const currentProjectData = project.find((t) => t.id === projectID)

  // if (loading || !currentProjectData) {
  if (loading || !currentProjectData) {
    return (
      <ScrollView
        style={{
          flex: 1,
          padding: isMobile ? 12 : 30,
          backgroundColor: '#000000',
          borderWidth: 0,
          borderColor: 'red',
        }}
        showsVerticalScrollIndicator={false}
      >
        <ProjectWindowSkeleton />
      </ScrollView>
    )
  }

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
          padding: isMobile ? 12 : 30,
          backgroundColor: '#000000',
          borderWidth: 0,
          borderColor: 'red',
        }}
        showsVerticalScrollIndicator={false}
      >
        {isMobile ? (
          <Pressable
            onPress={() => router.replace('/(screens)/project')}
            style={{ marginBottom: 20 }}
          >
            <HStack style={{ alignItems: 'center', borderWidth: 0 }} space="sm">
              <ArrowLeft color={'white'} />
              <Text style={{ color: 'white', fontSize: 15 }}>
                Project Details
              </Text>
            </HStack>
          </Pressable>
        ) : null}
        <Box style={{ borderWidth: 0, marginBottom: isMobile ? 10 : 30 }}>
          <HStack
            style={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Text
              style={{
                fontSize: isMobile ? 18 : 28,
                fontWeight: 'bold',
                color: 'white',
                maxWidth: isMobile ? 270 : 900,
              }}
            >
              {currentProjectData.title}
            </Text>
            <HStack style={{ alignItems: 'center' }} space="md">
              {isMobile ? (
                <Pressable
                  onPress={() => {
                    router.replace({
                      pathname: '/(screens)/projectJournalScreen',
                      params: {
                        project: currentProjectData.id.toString(),
                      },
                    })
                  }}
                >
                  <Icon as={NotebookPen} color={'white'} />
                </Pressable>
              ) : (
                <Button
                  style={{ borderRadius: 8 }}
                  variant="outline"
                  onHoverIn={() => setJournalHover(true)}
                  onHoverOut={() => setJournalHover(false)}
                  onPress={() => {
                    router.replace({
                      pathname: '/(screens)/projectJournalScreen',
                      params: {
                        project: currentProjectData.id.toString(),
                      },
                    })
                  }}
                >
                  <ButtonIcon
                    as={NotebookPen}
                    color={journalHover ? 'black' : 'white'}
                  />

                  <ButtonText
                    style={{ color: journalHover ? 'black' : 'white' }}
                  >
                    Project Journal
                  </ButtonText>
                </Button>
              )}

              <Menu
                placement="top"
                offset={5}
                disabledKeys={['Settings']}
                trigger={({ ...triggerProps }) => {
                  return (
                    <Pressable
                      {...triggerProps}
                      style={{ borderWidth: 0, borderColor: 'white' }}
                    >
                      <EllipsisVertical color={'white'} />
                    </Pressable>
                  )
                }}
              >
                <MenuItem
                  textValue="Add account"
                  onPress={() => {
                    isMobile
                      ? router.replace(
                          `./editProjectScreen?project=${projectID}&origin=projectWindow`
                        )
                      : setShowEditProjectModal(true)
                  }}
                >
                  <SquarePen />
                  <MenuItemLabel
                    size="md"
                    style={{ marginLeft: 10, fontWeight: 'bold' }}
                  >
                    Edit project
                  </MenuItemLabel>
                </MenuItem>

                {currentProjectData.status === 'Closed' ? (
                  <MenuItem
                    textValue="Add account"
                    onPress={() => setShowReopenProjectModal(true)}
                  >
                    <Repeat />
                    <MenuItemLabel
                      size="md"
                      style={{ marginLeft: 10, fontWeight: 'bold' }}
                    >
                      Reopen project
                    </MenuItemLabel>
                  </MenuItem>
                ) : (
                  <MenuItem
                    textValue="Add account"
                    onPress={() => setShowCloseProjectModal(true)}
                  >
                    <CircleX />
                    <MenuItemLabel
                      size="md"
                      style={{ marginLeft: 10, fontWeight: 'bold' }}
                    >
                      Close project
                    </MenuItemLabel>
                  </MenuItem>
                )}

                <MenuItem
                  textValue="Add account"
                  onPress={() => setShowDeleteProjectModal(true)}
                >
                  <Trash color={'red'} />
                  <MenuItemLabel
                    size="md"
                    style={{
                      marginLeft: 10,
                      fontWeight: 'bold',
                      color: 'red',
                    }}
                  >
                    Delete project
                  </MenuItemLabel>
                </MenuItem>
              </Menu>
            </HStack>
          </HStack>
        </Box>

        <Box style={{ borderWidth: 0 }}>
          {isMobile ? (
            <VStack>
              <Pressable
                onPress={() => {
                  router.replace({
                    pathname: '/(screens)/projectJournalScreen',
                    params: {
                      project: currentProjectData.id.toString(),
                    },
                  })
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    marginBottom: 5,
                    fontSize: 12,
                    borderWidth: 0,
                  }}
                >
                  {truncate(currentProjectData.description, 50, 'words')}
                </Text>
              </Pressable>

              <HStack
                style={{
                  alignItems: 'center',
                  marginBottom: 10,
                }}
                space="md"
              >
                <Text style={{ color: '#CDCCCC', fontSize: 16 }}>Status</Text>
                <Text style={{ color: 'white', fontSize: 16 }}>
                  {currentProjectData.deadline &&
                  currentProjectData.deadline?.toDate() < new Date() &&
                  currentProjectData.status === 'Closed'
                    ? 'Overdue/Closed'
                    : currentProjectData.deadline &&
                        currentProjectData.deadline?.toDate() < new Date()
                      ? 'Overdue'
                      : currentProjectData.status}
                </Text>
              </HStack>

              <HStack
                style={{
                  alignItems: 'center',
                  marginBottom: 10,
                }}
                space="md"
              >
                <Text style={{ color: '#CDCCCC', fontSize: 16 }}>Deadline</Text>
                <Text style={{ color: 'white', fontSize: 16 }}>
                  {currentProjectData.deadline &&
                    currentProjectData.deadline
                      .toDate()
                      .toLocaleDateString('en-US')}
                </Text>
              </HStack>

              <HStack
                style={{
                  alignItems: 'center',
                  marginBottom: 10,
                }}
                space="sm"
              >
                <Text style={{ color: '#CDCCCC', fontSize: 16 }}>
                  Assigned Members
                </Text>
                <ProjectUsers projectID={currentProjectData.id} />
              </HStack>

              <Divider
                orientation="horizontal"
                style={{ backgroundColor: 'gray' }}
              />

              <Box>
                <Text
                  style={{
                    color: '#CDCCCC',
                    fontSize: 15,
                    marginBottom: 10,
                    marginTop: 10,
                  }}
                >
                  Task Summary
                </Text>
                <TaskSummary projectID={currentProjectData.id} />
              </Box>
            </VStack>
          ) : (
            <HStack>
              {/* Description / Status / Deadline / Assigned users */}
              <Box style={{ flex: 3, paddingRight: 20 }}>
                {/* Description */}
                <Pressable
                  onPress={() => {
                    router.replace({
                      pathname: '/(screens)/projectJournalScreen',
                      params: {
                        project: currentProjectData.id.toString(),
                      },
                    })
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      marginBottom: 20,
                    }}
                  >
                    {truncate(currentProjectData.description, 50, 'words')}
                  </Text>
                </Pressable>

                <Box style={{ borderWidth: 0, flex: 1 }}>
                  <HStack style={{ flex: 1, alignItems: 'center' }}>
                    {/* Status */}
                    <HStack
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 10,
                      }}
                      space="md"
                    >
                      <Text style={{ color: '#CDCCCC', fontSize: 18 }}>
                        Status
                      </Text>
                      <Text style={{ color: 'white', fontSize: 18 }}>
                        {currentProjectData.deadline &&
                        currentProjectData.deadline?.toDate() < new Date() &&
                        currentProjectData.status === 'Closed'
                          ? 'Overdue/Closed'
                          : currentProjectData.deadline &&
                              currentProjectData.deadline?.toDate() < new Date()
                            ? 'Overdue'
                            : currentProjectData.status}
                      </Text>
                    </HStack>

                    {/* Vertical Divider */}
                    <Divider
                      orientation="vertical"
                      style={{ backgroundColor: 'gray' }}
                    />

                    {/* Deadline */}
                    <HStack
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 10,
                      }}
                      space="md"
                    >
                      <Text style={{ color: '#CDCCCC', fontSize: 18 }}>
                        Deadline
                      </Text>
                      <Text style={{ color: 'white', fontSize: 18 }}>
                        {currentProjectData.deadline &&
                          currentProjectData.deadline
                            .toDate()
                            .toLocaleDateString('en-US')}
                      </Text>
                    </HStack>

                    {/* Vertical Divider */}
                    <Divider
                      orientation="vertical"
                      style={{ backgroundColor: 'gray' }}
                    />

                    {/* Assigned Users */}
                    <HStack
                      style={{
                        flex: 2,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 10,
                      }}
                      space="md"
                    >
                      <Text style={{ color: '#CDCCCC', fontSize: 18 }}>
                        Assigned Members
                      </Text>
                      <ProjectUsers projectID={currentProjectData.id} />
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
                  marginLeft: 20,
                }}
              >
                <Box>
                  <Text
                    style={{ color: '#CDCCCC', fontSize: 15, marginBottom: 10 }}
                  >
                    Task Summary
                  </Text>
                  <TaskSummary projectID={currentProjectData.id} />
                </Box>
              </Box>
            </HStack>
          )}
        </Box>

        <Box
          style={{
            borderWidth: 0,
            marginTop: 20,
            marginBottom: isMobile ? 20 : 10,
          }}
        >
          <TaskProgressBar
            projectID={currentProjectData.id}
            origin="projectWindow"
          />
        </Box>

        {isMobile ? (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack space="sm" style={{ alignItems: 'stretch' }}>
                <Box style={{ minWidth: 300, maxWidth: 400 }}>
                  <TodoTasks projectID={currentProjectData.id} />
                </Box>

                <Box style={{ minWidth: 300, maxWidth: 400 }}>
                  <OngoingTasks projectID={currentProjectData.id} />
                </Box>

                <Box style={{ minWidth: 300, maxWidth: 400 }}>
                  <CompletedTasks projectID={currentProjectData.id} />
                </Box>
              </HStack>
            </ScrollView>
          </>
        ) : (
          <Box style={{ borderWidth: 0, flex: 1 }}>
            <HStack space="sm" style={{ alignItems: 'stretch' }}>
              <Box style={{ flex: 1 }}>
                <TodoTasks projectID={currentProjectData.id} />
              </Box>

              <Box style={{ flex: 1 }}>
                <OngoingTasks projectID={currentProjectData.id} />
              </Box>

              <Box style={{ flex: 1 }}>
                <CompletedTasks projectID={currentProjectData.id} />
              </Box>
            </HStack>
          </Box>
        )}
      </ScrollView>

      <ProjectEditModal
        projectID={currentProjectData.id}
        visible={showEditProjectModal}
        onClose={() => setShowEditProjectModal(false)}
      />

      <TaskAddModal
        visible={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
      />

      <ProjectDeleteModal
        projectID={currentProjectData.id}
        visible={showDeleteProjectModal}
        onClose={() => setShowDeleteProjectModal(false)}
      />

      <ProjectCloseModal
        projectID={currentProjectData.id}
        visible={showCloseProjectModal}
        onClose={() => setShowCloseProjectModal(false)}
      />

      <ProjectReopenModal
        projectID={currentProjectData.id}
        visible={showReopenProjectModal}
        onClose={() => setShowReopenProjectModal(false)}
      />
    </>
  )
}

const styles = StyleSheet.create({
  inputs: {
    borderWidth: 1,
    borderColor: '#0000005b',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: '#000000ff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#0000005b',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  pickerBox: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  cancelButton: {
    marginTop: 10,
  },
  modalContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  confirmButton: {
    marginTop: 10,
    alignSelf: 'center',
  },
  boxLabel: {
    borderWidth: 0,
    alignItems: 'center',
    padding: 10,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    backgroundColor: '#dbdbdbff',
    // flex: 1,
  },
  starMenuDrawer: {
    // flexDirection: "row",
    // alignItems: "center",
    flex: 1,
    gap: 0,
  },
  starnum: {
    position: 'absolute',
    left: 21,
  },
})
