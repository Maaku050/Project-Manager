import { Button, ButtonText } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { CloseIcon, Icon } from '@/components/ui/icon'
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@/components/ui/modal'
import { Spinner } from '@/components/ui/spinner'
import { useProject } from '@/context/projectContext'
import { db } from '@/firebase/firebaseConfig'
import { router, useGlobalSearchParams } from 'expo-router'
import { arrayRemove, doc, getDoc, updateDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { Text, useWindowDimensions } from 'react-native'

type TaskDeleteModalType = {
  taskID: string
  visible: boolean
  onClose: () => void
}

export default function TaskDeleteModal({
  taskID,
  visible,
  onClose,
}: TaskDeleteModalType) {
  const dimensions = useWindowDimensions()
  const isMobile = dimensions.width <= 1000
  const [isHover, setIsHover] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { tasks } = useProject()
  const params = useGlobalSearchParams()

  const handleDeleteTask = async () => {
    try {
      setIsSaving(true)

      const taskRef = doc(db, 'tasks', taskID)

      // 1. Loop through ALL tasks in context
      const updates = tasks.map(async (t) => {
        const tRef = doc(db, 'tasks', t.id)

        // --- Case 1: If t.childTasks contains this taskID → remove it
        if (Array.isArray(t.childTasks) && t.childTasks.includes(taskID)) {
          const newChildTasks = t.childTasks.filter((id) => id !== taskID)

          return updateDoc(tRef, {
            childTasks: newChildTasks,
          })
        }

        // --- Case 2: If t.parentTasks matches this taskID → clear it
        if (t.parentTasks === taskID) {
          return updateDoc(tRef, {
            parentTasks: null,
          })
        }

        return null
      })

      // Wait for all relationship updates
      await Promise.all(updates)

      // 2. Archive the task being deleted
      await updateDoc(taskRef, {
        status: 'Archived',
        parentTasks: null,
        childTasks: [],
      })
    } catch (error) {
      console.log('Error deleting task!', error)
    } finally {
      setIsSaving(false)
      onClose()
      router.replace({
        pathname: '/(screens)/projectWindow',
        params: { project: params.project as string },
      })
    }
  }

  return (
    <Modal isOpen={visible} onClose={onClose} size="md">
      <ModalBackdrop />
      <ModalContent
        style={{
          borderColor: 'red',
          borderWidth: 0,
          backgroundColor: '#000000',
        }}
      >
        <ModalHeader>
          <Heading size={isMobile ? 'lg' : 'xl'} style={{ color: 'white' }}>
            Deleting Task
          </Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} color="white" />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Text style={{ color: 'white', fontSize: isMobile ? 16 : 18 }}>
            Are you sure you want to delete task?
          </Text>
        </ModalBody>
        <ModalFooter>
          {isMobile ? (
            <>
              <Button
                onPress={handleDeleteTask}
                action="negative"
                style={{ flex: 1 }}
              >
                <ButtonText>
                  {isSaving ? (
                    <Spinner
                      size="small"
                      color="white"
                      style={{ marginTop: 6 }}
                    />
                  ) : (
                    'Delete Task'
                  )}
                </ButtonText>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="mr-3"
                onPress={onClose}
                onHoverIn={() => setIsHover(true)}
                onHoverOut={() => setIsHover(false)}
                style={{ backgroundColor: isHover ? 'gray' : '' }}
              >
                <ButtonText style={{ color: 'white' }}>Cancel</ButtonText>
              </Button>
              <Button onPress={handleDeleteTask} action="negative">
                <ButtonText>
                  {isSaving ? (
                    <Spinner
                      size="small"
                      color="white"
                      style={{ marginTop: 6 }}
                    />
                  ) : (
                    'Delete Task'
                  )}
                </ButtonText>
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
