import React from 'react'
import { Badge, BadgeText } from './ui/badge'
import { useProject } from '@/context/projectContext'
import { useWindowDimensions } from 'react-native'

type ProjectBadgeType = {
  projectID: string
}

export default function ProjectBadge({ projectID }: ProjectBadgeType) {
  const dimensions = useWindowDimensions()
  const isMobile = dimensions.width <= 786
  const { project } = useProject()

  const currentProject = project.find((t) => t.id === projectID)
  return (
    <Badge
      size={isMobile ? 'md' : 'lg'}
      variant="solid"
      action={
        currentProject?.deadline &&
        currentProject.deadline.toDate() < new Date() &&
        currentProject.status != 'Closed'
          ? 'error'
          : currentProject?.status === 'Ongoing'
            ? 'success'
            : currentProject?.status === 'Closed'
              ? 'muted'
              : 'muted'
      }
    >
      <BadgeText>
        {currentProject?.deadline &&
        currentProject.deadline.toDate() < new Date() &&
        currentProject.status != 'Closed'
          ? 'OVERDUE'
          : currentProject?.status === 'Ongoing' ||
              currentProject?.status === 'Pending'
            ? 'ONGOING'
            : currentProject?.status === 'Closed'
              ? 'CLOSED'
              : ''}
      </BadgeText>
    </Badge>
  )
}
