import { useUser } from '@/context/profileContext'
import { useProject } from '@/context/projectContext'
import React from 'react'
import { HStack } from './ui/hstack'
import { Avatar, AvatarFallbackText, AvatarGroup } from './ui/avatar'
import { Tooltip, TooltipContent } from './ui/tooltip'
import { VStack } from './ui/vstack'
import { Text, useWindowDimensions } from 'react-native'
import { Heading } from './ui/heading'

type ProjectUsersType = {
  taskID: string
}

export default function TasktUsers({ taskID }: ProjectUsersType) {
  const { profiles } = useUser()
  const { assignedUser, tasks } = useProject()
  const dimensions = useWindowDimensions()
  const isMobile = dimensions.width <= 1000

  const currentTask = tasks.find((t) => t.id === taskID)
  if (!currentTask) return

  return (
    <HStack style={{ justifyContent: 'flex-end', gap: 8 }}>
      {profiles
        .filter((p) =>
          assignedUser.some(
            (a) => a.taskID === currentTask.id && a.uid === p.uid
          )
        )
        .slice(0, 2) // first 2 avatars
        .map((t) => (
          <Tooltip
            key={t.id}
            placement="top"
            trigger={(triggerProps) => (
              <Avatar size={isMobile ? 'sm' : 'xs'} {...triggerProps}>
                <AvatarFallbackText>{t.firstName}</AvatarFallbackText>
              </Avatar>
            )}
          >
            <TooltipContent className="p-2 rounded-md bg-background-50">
              <Text className="text-sm">{t.firstName}</Text>
            </TooltipContent>
          </Tooltip>
        ))}

      {/* Extra avatars */}
      {profiles.filter((p) =>
        assignedUser.some((a) => a.taskID === currentTask.id && a.uid === p.uid)
      ).length > 2 && (
        <Tooltip
          placement="top"
          trigger={(triggerProps) => (
            <Avatar size={isMobile ? 'sm' : 'xs'} {...triggerProps}>
              <AvatarFallbackText>
                {`+ ${
                  profiles.filter((p) =>
                    assignedUser.some(
                      (a) => a.taskID === currentTask.id && a.uid === p.uid
                    )
                  ).length - 2
                }`}
              </AvatarFallbackText>
            </Avatar>
          )}
        >
          <TooltipContent className="p-4 rounded-md max-w-72 bg-background-50">
            <VStack space="sm">
              <Heading size="sm">Other members</Heading>
              {profiles
                .filter((p) =>
                  assignedUser.some(
                    (a) => a.taskID === currentTask.id && a.uid === p.uid
                  )
                )
                .slice(2) // remaining users after the first 2
                .map((t) => (
                  <Text key={t.id} className="text-sm">
                    {t.firstName}
                  </Text>
                ))}
            </VStack>
          </TooltipContent>
        </Tooltip>
      )}
    </HStack>
  )
}
