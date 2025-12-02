import React, { useState } from 'react'
import { Pressable, ScrollView, useWindowDimensions } from 'react-native'
import { useProject } from '@/context/projectContext'
import { Box } from '@/components/ui/box'
import { HStack } from '@/components/ui/hstack'
import { VStack } from '@/components/ui/vstack'
import { Divider } from '@/components/ui/divider'
import { EllipsisVertical, SquarePen, Trash } from 'lucide-react-native'
import TaskEditModal from '@/modals/taskEditModal'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu'
import { getDateLabel } from '@/helpers/getDateLabel'
import TaskStateButton from '@/components/taskStateButton'
import TaskDeleteModal from '@/modals/taskDeleteModal'
import TaskCommentSection from '@/components/taskCommentSection'
import TasktUsers from '@/components/taskAssignedUsers'

export default function TaskWindow() {
  const { selectedProject, tasks, selectedTask, project } = useProject()

  const dimensions = useWindowDimensions()
  const isLargeScreen = dimensions.width >= 1280 // computer UI condition
  const isMediumScreen = dimensions.width <= 1280 && dimensions.width > 768 // tablet UI condition
  const currentTask = tasks.find(
    (t) => t.projectID === selectedProject && t.id === selectedTask
  );
  const currentProjectData = project.find((t) => t.id === selectedProject);

  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  if (!currentTask || !currentProjectData) return;

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
          paddingTop: 30,
          paddingHorizontal: 15,
          backgroundColor: '#000000',
        }}
        showsVerticalScrollIndicator={false}
      >
        <HStack
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            borderLeftWidth: 8,
            borderColor:
              currentTask.status === "To-do" &&
                currentTask.start &&
                currentTask.start.toDate() > new Date()
                ? "green"
                : currentTask.status === "To-do" &&
                  currentTask.start &&
                  currentTask.start.toDate() < new Date()
                  ? "#D76C1F"
                  : currentTask.status === "Ongoing" &&
                    currentTask.end &&
                    currentTask.end.toDate() > new Date()
                    ? "green"
                    : currentTask.status === "Ongoing" &&
                      currentTask.end &&
                      currentTask.end.toDate() < new Date()
                      ? "#B91C1C"
                      : currentTask.status === "CompleteAndOnTime"
                        ? "green"
                        : currentTask.status === "CompleteAndOverdue"
                          ? "#D76C1F"
                          : "red",
            paddingLeft: 8,
          }}
        >
          <Box>
            <Text style={{ color: '#ffffff' }}>
              {currentProjectData?.title}
            </Text>
            <Heading style={{ color: '#ffffff' }}>{currentTask?.title}</Heading>
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
              <MenuItem
                textValue="Add account"
                onPress={() => {
                  setShowEditTaskModal(true)
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

        <HStack style={{ borderWidth: 0, marginTop: 10 }}>
          <Text
            style={{
              color: 'white',
              flex: 2,
            }}
          >
            {currentTask.description}
          </Text>
          <Divider orientation="vertical" style={{ backgroundColor: 'gray' }} />
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
                    currentTask.start && currentTask.start.toDate() > new Date()
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
              <Text style={{ color: '#CDCCCC' }}>Status</Text>
              <TasktUsers taskID={currentTask.id} />
            </HStack>
          </VStack>
        </HStack>

        <TaskCommentSection taskID={currentTask.id} />

        <TaskEditModal
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
