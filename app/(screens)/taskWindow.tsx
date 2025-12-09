import React, { useState } from 'react'
import { Pressable, ScrollView, useWindowDimensions } from 'react-native'
import { useProject } from '@/context/projectContext'
import { Box } from '@/components/ui/box'
import { HStack } from '@/components/ui/hstack'
import { VStack } from '@/components/ui/vstack'
import { Divider } from '@/components/ui/divider'
import {
  ArrowLeft,
  EllipsisVertical,
  SquarePen,
  Trash,
  Undo2,
} from 'lucide-react-native'
import TaskEditModal from '@/modals/taskEditModal'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu'
import { getDateLabel } from '@/helpers/getDateLabel'
import TaskStateButton from '@/components/taskStateButton'
import TaskDeleteModal from '@/modals/taskDeleteModal'
import TaskCommentSection from '@/components/taskCommentSection'
import TasktUsers from '@/components/taskAssignedUsers'
import TaskCard from '@/components/taskCard'
import { useLocalSearchParams, useRouter } from 'expo-router'
import TaskWindowSkeleton from '@/components/Skeleton/taskWindowSkeleton'
import { handleUnstartTask } from '@/helpers/taskStateHandler'

export default function TaskWindow() {
  const { tasks, project } = useProject() // ✅ Removed selectedProject
  const params = useLocalSearchParams()

  const dimensions = useWindowDimensions()
  const isMobile = dimensions.width <= 1000
  const router = useRouter()

  // ✅ Get IDs from URL params instead of context
  const projectId = params.project as string
  const taskId = params.task as string

  // ✅ Find task and project using params
  const currentTask = tasks.find((t) => t.id === taskId)
  const currentProjectData = project.find((t) => t.id === projectId)

  const [showEditTaskModal, setShowEditTaskModal] = useState(false)
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false)

  // ✅ Better error handling
  // if (!currentTask || !currentProjectData) {
  if (!currentTask || !currentProjectData) {
    return (
      <Box
        style={{
          flex: 1,
          padding: isMobile ? 12 : 30,
          backgroundColor: '#000000',
        }}
      >
        <TaskWindowSkeleton />
      </Box>
    )
  }

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
          padding: isMobile ? 12 : 30,
          backgroundColor: '#000000',
        }}
        showsVerticalScrollIndicator={false}
      >
        {isMobile ? (
          <Pressable
            onPress={() =>
              router.replace(`/(screens)/projectWindow?project=${projectId}`)
            }
            style={{ marginBottom: 20 }}
          >
            <HStack style={{ alignItems: 'center', borderWidth: 0 }} space="sm">
              <ArrowLeft color={'white'} />
              <Text style={{ color: 'white', fontSize: 15 }}>Task Details</Text>
            </HStack>
          </Pressable>
        ) : null}
        <HStack
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            borderLeftWidth: 8,
            borderColor:
              currentTask.status === 'To-do' &&
              currentTask.start &&
              currentTask.start.toDate() > new Date()
                ? 'green'
                : currentTask.status === 'To-do' &&
                    currentTask.start &&
                    currentTask.start.toDate() < new Date()
                  ? '#D76C1F'
                  : currentTask.status === 'Ongoing' &&
                      currentTask.end &&
                      currentTask.end.toDate() > new Date()
                    ? 'green'
                    : currentTask.status === 'Ongoing' &&
                        currentTask.end &&
                        currentTask.end.toDate() < new Date()
                      ? '#B91C1C'
                      : currentTask.status === 'CompleteAndOnTime'
                        ? 'green'
                        : currentTask.status === 'CompleteAndOverdue'
                          ? '#D76C1F'
                          : 'red',
            paddingLeft: 8,
          }}
          space="md"
        >
          <Box style={{ maxWidth: isMobile ? 165 : null, borderWidth: 0 }}>
            <Text
              style={{
                color: '#ffffff',
                fontSize: isMobile ? 10 : 16,
                lineHeight: 1,
              }}
            >
              {currentProjectData?.title}
            </Text>
            <Heading
              style={{
                color: '#ffffff',
                lineHeight: 1,
                fontSize: isMobile ? 15 : 16,
              }}
            >
              {currentTask?.title}
            </Heading>
          </Box>
          <HStack style={{ alignItems: 'center' }} space="lg">
            <TaskStateButton taskID={currentTask.id} from="taskWindow" />
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
              {isMobile && currentTask.status === 'Ongoing' ? (
                <MenuItem
                  textValue="Add account"
                  onPress={() => handleUnstartTask(currentTask.id)}
                >
                  <Undo2 />
                  <MenuItemLabel
                    size="md"
                    style={{ marginLeft: 10, fontWeight: 'bold' }}
                  >
                    Unstart task
                  </MenuItemLabel>
                </MenuItem>
              ) : null}

              <MenuItem
                textValue="Add account"
                onPress={() => {
                  isMobile
                    ? router.replace(
                        `/(screens)/editTaskScreen?project=${projectId}&task=${taskId}`
                      )
                    : setShowEditTaskModal(true)
                }}
              >
                <SquarePen />
                <MenuItemLabel
                  size="md"
                  style={{ marginLeft: 10, fontWeight: 'bold' }}
                >
                  Edit task
                </MenuItemLabel>
              </MenuItem>

              <MenuItem
                textValue="Add account"
                onPress={() => setShowDeleteTaskModal(true)}
              >
                <Trash color={'red'} />
                <MenuItemLabel
                  size="md"
                  style={{ marginLeft: 10, fontWeight: 'bold', color: 'red' }}
                >
                  Delete task
                </MenuItemLabel>
              </MenuItem>
            </Menu>
          </HStack>
        </HStack>

        {isMobile ? (
          <VStack style={{ marginTop: 10 }}>
            <Text
              style={{
                color: 'white',
                marginBottom: 20,
                fontSize: 12,
              }}
            >
              {currentTask.description}
            </Text>

            <VStack space="md">
              <HStack space="sm">
                <Text style={{ color: '#CDCCCC', fontSize: 14 }}>Status</Text>
                <Text
                  style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}
                >
                  {currentTask.status}
                </Text>
              </HStack>

              <HStack space="sm">
                <Text style={{ color: '#CDCCCC', fontSize: 14 }}>Timeline</Text>

                <Text
                  style={{
                    color:
                      currentTask.start &&
                      currentTask.start.toDate() > new Date()
                        ? 'white'
                        : '#B91C1C',
                    fontWeight: 'bold',
                    fontSize: 14,
                  }}
                >
                  {getDateLabel(currentTask.start, 'start')}
                </Text>
                <Text style={{ color: '#CDCCCC' }}>-</Text>
                <Text
                  style={{
                    color:
                      currentTask.end && currentTask.end.toDate() > new Date()
                        ? 'white'
                        : '#B91C1C',
                    fontWeight: 'bold',
                    fontSize: 14,
                  }}
                >
                  {getDateLabel(currentTask.end, 'due')}
                </Text>
              </HStack>

              <HStack space="sm" style={{ alignItems: 'center' }}>
                <Text style={{ color: '#CDCCCC', fontSize: 14 }}>
                  Assignees
                </Text>
                <TasktUsers taskID={currentTask.id} />
              </HStack>
            </VStack>
          </VStack>
        ) : (
          <HStack style={{ borderWidth: 0, marginTop: 10 }}>
            <Text
              style={{
                color: 'white',
                flex: 2,
              }}
            >
              {currentTask.description}
            </Text>
            <Divider
              orientation="vertical"
              style={{ backgroundColor: '#414141' }}
            />
            <VStack style={{ borderWidth: 0, flex: 1 }} space="lg">
              <HStack
                style={{
                  marginLeft: 30,
                }}
                space="sm"
              >
                <Text style={{ color: '#CDCCCC' }}>Status</Text>
                <Text style={{ color: 'white' }}>{currentTask.status}</Text>
              </HStack>
              <HStack
                style={{
                  marginLeft: 30,
                }}
                space="sm"
              >
                <Text style={{ color: '#CDCCCC' }}>Timeline</Text>

                <Text
                  style={{
                    color:
                      currentTask.start &&
                      currentTask.start.toDate() > new Date()
                        ? 'white'
                        : '#B91C1C',
                    fontSize: 12,
                  }}
                >
                  {getDateLabel(currentTask.start, 'start')}
                </Text>
                <Text style={{ color: '#CDCCCC' }}>-</Text>
                <Text
                  style={{
                    color:
                      currentTask.end && currentTask.end.toDate() > new Date()
                        ? 'white'
                        : '#B91C1C',
                    fontSize: 12,
                  }}
                >
                  {getDateLabel(currentTask.end, 'due')}
                </Text>
              </HStack>
              <HStack
                style={{
                  marginLeft: 30,
                }}
                space="sm"
              >
                <Text style={{ color: '#CDCCCC' }}>Assignees</Text>
                <TasktUsers taskID={currentTask.id} />
              </HStack>
            </VStack>
          </HStack>
        )}

        {/* Prerequisite tasks section */}
        {currentTask.childTasks?.length > 0 ? (
          <>
            <Divider
              orientation="horizontal"
              style={{ backgroundColor: '#414141', marginVertical: 10 }}
            />
            <Text style={{ color: '#F3F3F3', marginBottom: 10 }}>
              {currentTask.childTasks.length} prerequisite task
              {currentTask.childTasks.length > 1 ? 's' : ''}
            </Text>
            <Box style={{ borderWidth: 0, borderColor: 'red' }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 16 }}
              >
                <HStack space="md">
                  {currentTask.childTasks.map((taskid) => (
                    <TaskCard
                      key={taskid}
                      taskID={taskid}
                      origin="taskWindow"
                    />
                  ))}
                </HStack>
              </ScrollView>
            </Box>
          </>
        ) : null}

        {/* Blocking task section */}
        {currentTask.parentTasks ? (
          <>
            <Divider
              orientation="horizontal"
              style={{ backgroundColor: '#414141', marginVertical: 10 }}
            />
            <Text style={{ color: '#F3F3F3', marginBottom: 10 }}>
              1 blocking task
            </Text>
            <Box style={{ borderWidth: 0, borderColor: 'red' }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 16 }}
              >
                <TaskCard
                  taskID={currentTask.parentTasks}
                  origin="taskWindow"
                />
              </ScrollView>
            </Box>
          </>
        ) : null}

        <TaskCommentSection taskID={currentTask.id} />

        <TaskEditModal
          taskID={currentTask.id}
          visible={showEditTaskModal}
          onClose={() => setShowEditTaskModal(false)}
        />
        <TaskDeleteModal
          taskID={currentTask.id}
          visible={showDeleteTaskModal}
          onClose={() => setShowDeleteTaskModal(false)}
        />
      </ScrollView>
    </>
  )
}
