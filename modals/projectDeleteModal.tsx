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
import { db } from '@/firebase/firebaseConfig'
import { router } from 'expo-router'
import { doc, updateDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { Text } from 'react-native'

type ProjectDeleteModalType = {
  projectID: string
  visible: boolean
  onClose: () => void
}

export default function ProjectDeleteModal({
  projectID,
  visible,
  onClose,
}: ProjectDeleteModalType) {
  const [isHover, setIsHover] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const handleDeleteProject = async () => {
    try {
      setIsSaving(true)
      const projectRef = doc(db, 'project', projectID)
      await updateDoc(projectRef, {
        status: 'Archived',
      })
    } catch (error) {
      console.log('Error deleting project!', error)
    } finally {
      setIsSaving(false)
      onClose()
      router.replace('/(screens)/project')
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
          <Heading size="xl" style={{ color: 'white' }}>
            Deleting Project
          </Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} color="white" />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Text style={{ color: 'white', fontSize: 18 }}>
            Are you sure you want to delete project?
          </Text>
        </ModalBody>
        <ModalFooter>
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
          <Button onPress={handleDeleteProject} action="negative">
            <ButtonText>
              {isSaving ? (
                <Spinner size="small" color="white" style={{ marginTop: 6 }} />
              ) : (
                'Delete Project'
              )}
            </ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
