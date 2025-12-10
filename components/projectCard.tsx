import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Pressable, useWindowDimensions } from 'react-native'
import { Card } from './ui/card'
import { HStack } from './ui/hstack'
import { Heading } from './ui/heading'
import { useProject } from '@/context/projectContext'
import ProjectBadge from './projectBadge'
import {
  CircleX,
  EllipsisVertical,
  Repeat,
  SquarePen,
  Trash,
} from 'lucide-react-native'
import ProjectUsers from './projectAssignedUsers'
import { Menu, MenuItem, MenuItemLabel } from './ui/menu'
import ProjectEditModal from '@/modals/projectEditModal'
import ProjectDeleteModal from '@/modals/projectDeleteModal'
import ProjectCloseModal from '@/modals/projectCloseModal'
import ProjectReopenModal from '@/modals/projectReopenModal'

type ProjectCardType = {
  projectID: string
  origin: string
}

export default function ProjectCard({ projectID, origin }: ProjectCardType) {
  const dimensions = useWindowDimensions()
  const isMobile = dimensions.width <= 768
  const router = useRouter()
  const { project, setSelectedProject } = useProject()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [showEditProjectModal, setShowEditProjectModal] = useState(false)
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false)
  const [showCloseProjectModal, setShowCloseProjectModal] = useState(false)
  const [showReopenProjectModal, setShowReopenProjectModal] = useState(false)
  const currentProject = project.find((t) => t.id === projectID)
  if (!currentProject) return

  return (
    <>
      <Pressable
        style={{
          width: isMobile ? '100%' : origin === 'homeScreen' ? '48%' : '32%', // ← ensures 3 cards per row
          marginBottom: 12,
        }}
        onPress={() => {
          router.push({
            pathname: '/projectWindow',
            params: { project: projectID },
          })
        }}
        onHoverIn={() => setHoveredId(currentProject.id)}
        onHoverOut={() => setHoveredId(null)}
      >
        <Card
          size="md"
          variant="outline"
          style={{
            backgroundColor: '#000000',
            borderRadius: 12,
            padding: 12,
            borderLeftWidth: 10,
            borderColor:
              currentProject.deadline &&
                currentProject.deadline.toDate() < new Date() &&
                currentProject.status != 'Closed'
                ? 'red'
                : currentProject.status === 'Ongoing'
                  ? 'green'
                  : currentProject.status === 'Closed'
                    ? '#535252'
                    : '',
            height: '100%', // ensures card fills container
            display: 'flex',
            flexDirection: 'column', // stack items vertically
          }}
        >
          <HStack
            style={{
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: 10,
            }}
          >
            <Heading
              size="md"
              className="mb-1"
              style={{
                textDecorationLine:
                  hoveredId === currentProject.id ? 'underline' : 'none',
                color: 'white',
              }}
            >
              {currentProject.title}
            </Heading>
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
                    ? router.replace(`./editProjectScreen?project=${projectID}`)
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

              {currentProject.status === 'Closed' ? (
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
                  style={{ marginLeft: 10, fontWeight: 'bold', color: 'red' }}
                >
                  Delete project
                </MenuItemLabel>
              </MenuItem>
            </Menu>
          </HStack>

          <HStack
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 'auto',
            }}
          >
            <ProjectBadge projectID={currentProject.id} />
            <ProjectUsers projectID={currentProject.id} />
          </HStack>
        </Card>
      </Pressable>

      <ProjectEditModal
        projectID={currentProject.id}
        visible={showEditProjectModal}
        onClose={() => setShowEditProjectModal(false)}
      />

      <ProjectDeleteModal
        projectID={currentProject.id}
        visible={showDeleteProjectModal}
        onClose={() => setShowDeleteProjectModal(false)}
      />

      <ProjectCloseModal
        projectID={currentProject.id}
        visible={showCloseProjectModal}
        onClose={() => setShowCloseProjectModal(false)}
      />

      <ProjectReopenModal
        projectID={currentProject.id}
        visible={showReopenProjectModal}
        onClose={() => setShowReopenProjectModal(false)}
      />
    </>
  )
}
