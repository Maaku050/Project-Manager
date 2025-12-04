import React from 'react'
import { Text } from 'react-native'
import { Box } from './ui/box'
import { HStack } from './ui/hstack'
import { useProject } from '@/context/projectContext'
import { Dot } from 'lucide-react-native'
import { VStack } from './ui/vstack'
import TaskCard from './taskCard'

type TodoTasksType = {
  projectID: string
}

export default function TodoTasks({ projectID }: TodoTasksType) {
  const { tasks } = useProject()
  const currentProjectTasks = tasks.filter((t) => t.projectID === projectID)
  const allTodoTasks = currentProjectTasks
    .filter((t) => t.status === 'To-do' && t.start)
    .sort((a, b) => {
      const aTime = a.start ? a.start.toDate().getTime() : Infinity
      const bTime = b.start ? b.start.toDate().getTime() : Infinity
      return aTime - bTime
    })

  const todoTasks = allTodoTasks.filter(
    (t) => t.start && t.start.toDate() > new Date()
  ).length
  const overdueTasks = allTodoTasks.filter(
    (t) => t.start && t.start.toDate() < new Date()
  ).length

  return (
    <VStack style={{ flex: 1 }}>
      <Box
        style={{
          backgroundColor: '#171717',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          paddingTop: 10,
          paddingRight: 15,
          paddingLeft: 15,
        }}
      >
        <HStack
          style={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>
            To Do
          </Text>
          <Box>
            <HStack style={{ alignItems: 'center' }}>
              <Dot color={'green'} size={40} />
              <Text style={{ color: 'white', fontSize: 15 }}>{todoTasks}</Text>
              <Dot color={'#D76C1F'} size={40} />
              <Text style={{ color: 'white', fontSize: 15 }}>
                {overdueTasks}
              </Text>
            </HStack>
          </Box>
        </HStack>
      </Box>
      <Box
        style={{
          backgroundColor: '#171717',
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          paddingBottom: 10,
          paddingRight: 15,
          paddingLeft: 15,
          borderWidth: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {allTodoTasks.length != 0 ? (
          <>
            {allTodoTasks.map((t) => (
              <TaskCard key={t.id} taskID={t.id} origin="projectWindow" />
            ))}
          </>
        ) : (
          <>
            <Text style={{ color: 'gray', fontWeight: 'bold', fontSize: 20 }}>
              No Task
            </Text>
            <Text style={{ color: 'gray', fontWeight: 600 }}>
              There is no To Do Task for now
            </Text>
          </>
        )}
      </Box>
    </VStack>
  )
}
