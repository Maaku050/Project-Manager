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
  projectID: string
}

export default function ProjectUsers({ projectID }: ProjectUsersType) {
  const dimensions = useWindowDimensions()
  const isMobile = dimensions.width <= 786
  const { assignedUser, project } = useProject()
  const { profiles } = useUser()

  const currentProject = project.find((t) => t.id === projectID)
  if (!currentProject) return

  return (
    <HStack style={{ justifyContent: 'flex-end', gap: 5 }}>
      {profiles
        .filter((p) =>
          assignedUser.some(
            (a) => a.projectID === currentProject.id && a.uid === p.uid
          )
        )
        .slice(0, 4) // first 4 avatars
        .map((t) => (
          <Tooltip
            key={t.id}
            placement="top"
            trigger={(triggerProps) => (
              <Avatar size={isMobile ? 'xs' : 'sm'} {...triggerProps}>
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
        assignedUser.some(
          (a) => a.projectID === currentProject.id && a.uid === p.uid
        )
      ).length > 4 && (
        <Tooltip
          placement="top"
          trigger={(triggerProps) => (
            <Avatar size={isMobile ? 'xs' : 'sm'} {...triggerProps}>
              <AvatarFallbackText>
                {`+ ${
                  profiles.filter((p) =>
                    assignedUser.some(
                      (a) =>
                        a.projectID === currentProject.id && a.uid === p.uid
                    )
                  ).length - 4
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
                    (a) => a.projectID === currentProject.id && a.uid === p.uid
                  )
                )
                .slice(4) // remaining users after the first 4
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
