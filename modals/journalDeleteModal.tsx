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
import { deleteDoc, doc } from 'firebase/firestore'
import React, { useState } from 'react'
import { Text, useWindowDimensions } from 'react-native'

type TaskDeleteModalType = {
  journalID: string
  visible: boolean
  onClose: () => void
}

export default function JournalDeleteModal({
  journalID,
  visible,
  onClose,
}: TaskDeleteModalType) {
  const [isHover, setIsHover] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const dimension = useWindowDimensions()
  const isMobile = dimension.width <= 1000

  const handleDeleteJournal = async () => {
    setIsSaving(true)
    try {
      const journalRef = doc(db, 'journal', journalID)
      await deleteDoc(journalRef)
    } catch (error) {
      console.log('Error deleting journal!', error)
    } finally {
      setIsSaving(false)
      onClose()
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
            Deleting Journal
          </Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} color="white" />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Text style={{ color: 'white', fontSize: isMobile ? 16 : 18 }}>
            Are you sure you want to delete this journal?
          </Text>
        </ModalBody>
        <ModalFooter>
          {isMobile ? (
            <>
              <Button
                onPress={handleDeleteJournal}
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
                    'Delete journal'
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
              <Button onPress={handleDeleteJournal} action="negative">
                <ButtonText>
                  {isSaving ? (
                    <Spinner
                      size="small"
                      color="white"
                      style={{ marginTop: 6 }}
                    />
                  ) : (
                    'Delete journal'
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
