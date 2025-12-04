import { useProject } from '@/context/projectContext'
import React, { useMemo } from 'react'
import { Text } from 'react-native'
import { HStack } from './ui/hstack'
import { Link } from 'lucide-react-native'
import { Tooltip, TooltipContent, TooltipText } from './ui/tooltip'

type TaskLinkTagType = {
  taskID: string
}

export default function TaskLinkTag({ taskID }: TaskLinkTagType) {
  const { tasks } = useProject()
  const currentTask = tasks.find((task) => task.id === taskID)
  if (!currentTask?.id) return
  const blockingTask = useMemo(
    () =>
      currentTask?.id
        ? tasks.find((task) => task.childTasks?.includes(currentTask.id))
        : undefined,
    [tasks, currentTask?.id]
  )

  if (currentTask?.parentTasks) {
    return (
      <HStack style={{ alignItems: 'center' }} space="xs">
        <Link color={'#84D3A2'} />
        <Tooltip
          placement="top"
          trigger={(triggerProps) => {
            return (
              <Text
                style={{
                  color:
                    blockingTask?.status === 'To-do' &&
                    blockingTask.start &&
                    blockingTask.start?.toDate() < new Date()
                      ? '#FECDAA'
                      : blockingTask?.status === 'Ongoing' &&
                          blockingTask.end &&
                          blockingTask.end?.toDate() < new Date()
                        ? '#FCA5A5'
                        : '#84D3A2',
                }}
                {...triggerProps}
              >
                BLOCKING
              </Text>
            )
          }}
        >
          <TooltipContent className="p-2 rounded-md bg-background-50">
            <Text className="text-sm">{blockingTask?.title}</Text>
          </TooltipContent>
        </Tooltip>
      </HStack>
    )
  } else if (currentTask?.childTasks?.length) {
    // Get the actual task objects for the child tasks
    const childTaskObjects = currentTask.childTasks
      .map((childId) => tasks.find((task) => task.id === childId))
      .filter(Boolean) // Remove any undefined values

    // Determine how many to display (max 2)
    const displayTasks = childTaskObjects.slice(0, 2)
    const hasMore = childTaskObjects.length > 2

    return (
      <HStack style={{ alignItems: 'center' }} space="xs">
        <Link color={'#84D3A2'} />
        {displayTasks.map((childTask, index) => {
          const taskColor =
            childTask?.status === 'To-do' &&
            childTask.start &&
            childTask.start?.toDate() < new Date()
              ? '#FECDAA'
              : childTask?.status === 'Ongoing' &&
                  childTask.end &&
                  childTask.end?.toDate() < new Date()
                ? '#FCA5A5'
                : '#84D3A2'

          return (
            <HStack
              key={childTask?.id}
              style={{ alignItems: 'center' }}
              space="xs"
            >
              {index > 0 && <Text style={{ color: '#414141' }}>|</Text>}
              <Tooltip
                placement="top"
                trigger={(triggerProps) => {
                  return (
                    <Text style={{ color: taskColor }} {...triggerProps}>
                      PRE-REQ {index + 1}
                    </Text>
                  )
                }}
              >
                <TooltipContent className="p-2 rounded-md bg-background-50">
                  <Text className="text-sm">{childTask?.title}</Text>
                </TooltipContent>
              </Tooltip>
            </HStack>
          )
        })}

        {hasMore && (
          <>
            <Text style={{ color: '#414141' }}>|</Text>
            <Tooltip
              placement="top"
              trigger={(triggerProps) => {
                return (
                  <Text style={{ color: '#84D3A2' }} {...triggerProps}>
                    ...
                  </Text>
                )
              }}
            >
              <TooltipContent className="p-2 rounded-md bg-background-50">
                <Text className="text-sm">
                  +{childTaskObjects.length - 2} more task
                  {childTaskObjects.length - 2 > 1 ? 's' : ''}
                </Text>
              </TooltipContent>
            </Tooltip>
          </>
        )}
      </HStack>
    )
  }

  return null
}
