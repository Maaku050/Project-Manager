import React, { useState } from 'react'
import { Text, useWindowDimensions } from 'react-native'
import { HStack } from './ui/hstack'
import { useProject } from '@/context/projectContext'
import { Button, ButtonIcon, ButtonText } from './ui/button'
import { PlusIcon } from 'lucide-react-native'
import { Progress, ProgressFilledTrack } from './ui/progress'
import TaskAddModal from '@/modals/taskAddModal'
import { useRouter } from 'expo-router'

type TaskProgressBarType = {
  projectID: string
  origin: string
}

export default function TaskProgressBar({
  projectID,
  origin,
}: TaskProgressBarType) {
  const dimensions = useWindowDimensions()
  const isMobile = dimensions.width <= 768
  const router = useRouter()
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const { tasks } = useProject()

  const currentProjectTasks = tasks.filter(
    (t) =>
      t.projectID === projectID &&
      ['To-do', 'Ongoing', 'CompleteAndOnTime', 'CompleteAndOverdue'].includes(
        t.status
      )
  )

  const currentTotalTasks = currentProjectTasks.length

  const todoTasks = currentProjectTasks.filter(
    (t) => t.status === 'To-do'
  ).length
  const ongoingTasks = currentProjectTasks.filter(
    (t) => t.status === 'Ongoing'
  ).length
  const completedTasks = currentProjectTasks.filter(
    (t) => t.status === 'CompleteAndOnTime' || t.status === 'CompleteAndOverdue'
  ).length

  // Weighted progress: To-do = 0, Ongoing = 50%, Completed = 100%
  const progress =
    currentTotalTasks > 0
      ? ((todoTasks * 0 + ongoingTasks * 0.5 + completedTasks * 1) /
          currentTotalTasks) *
        100
      : 0

  if (origin === 'dashboard') {
    return (
      <HStack style={{ alignItems: 'center', flex: 1 }} space="sm">
        <Progress
          value={progress}
          size="sm"
          orientation="horizontal"
          style={{ backgroundColor: '#333333' }}
        >
          <ProgressFilledTrack style={{ backgroundColor: '#ffffffff' }} />
        </Progress>
        <Text style={{ color: 'white', fontSize: 18 }}>
          {progress.toFixed(0)}%
        </Text>
      </HStack>
    )
  }

  return (
    <>
      <HStack style={{ justifyContent: 'space-between', marginBottom: 20 }}>
        <HStack style={{ alignItems: 'center' }} space={isMobile ? 'xs' : 'sm'}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            {currentTotalTasks} total tasks
          </Text>
          <Text style={{ color: 'white', fontSize: 15 }}>
            ({progress.toFixed(0)}% complete)
          </Text>
        </HStack>
        <Button
          action="secondary"
          style={{ backgroundColor: 'white' }}
          onPress={() => {
            isMobile
              ? router.replace(`/(screens)/addTaskScreen?project=${projectID}`)
              : setShowAddTaskModal(true)
          }}
          size={isMobile ? 'sm' : 'md'}
        >
          <ButtonIcon as={PlusIcon} />
          <ButtonText>Add Task</ButtonText>
        </Button>
      </HStack>
      <Progress
        value={progress}
        size="sm"
        orientation="horizontal"
        style={{ backgroundColor: '#333333' }}
      >
        <ProgressFilledTrack style={{ backgroundColor: '#FFFFFF' }} />
      </Progress>

      <TaskAddModal
        visible={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
      />
    </>
  )
}
