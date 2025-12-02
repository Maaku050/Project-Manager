import { Button, ButtonText } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { CloseIcon, Icon } from '@/components/ui/icon'
import {
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Modal,
} from '@/components/ui/modal'
import { Spinner } from '@/components/ui/spinner'
import { useUser } from '@/context/profileContext'
import { db } from '@/firebase/firebaseConfig'
import { useLocalSearchParams } from 'expo-router/build/hooks'
import { doc, updateDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { Text } from 'react-native'

type UnarchiveEmployeeModalType = {
  visible: boolean
  onClose: () => void
}

export default function UnarchiveEmployeeModal({
  visible,
  onClose,
}: UnarchiveEmployeeModalType) {
  const { profiles } = useUser()
  const { id } = useLocalSearchParams()
  const [isHover, setIsHover] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const selectedEmployee = profiles?.find((user) => user.uid === id)

  const handleUnarchiveEmployee = async () => {
    if (!selectedEmployee) return
    setIsSaving(true)
    try {
      const employeeRef = doc(db, 'profile', selectedEmployee.id)
      await updateDoc(employeeRef, {
        status: 'Active',
      })

      console.log('Unarchived employee successfully!')
    } catch (error) {
      console.log('Unarchiving employee failed!', error)
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
          <Heading size="xl" style={{ color: 'white' }}>
            Unarchiving Employee
          </Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} color="white" />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Text style={{ color: 'white', fontSize: 18 }}>
            Are you sure you want to unarchive this employee?
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="outline"
            className="mr-3"
            onPress={onClose}
            onHoverIn={() => setIsHover(true)}
            onHoverOut={() => setIsHover(false)}
            style={{
              backgroundColor: isHover ? 'gray' : '',
              borderRadius: 8,
            }}
          >
            <ButtonText style={{ color: 'white' }}>Cancel</ButtonText>
          </Button>
          <Button onPress={handleUnarchiveEmployee}>
            <ButtonText>
              {isSaving ? (
                <Spinner size="small" color="white" style={{ marginTop: 6 }} />
              ) : (
                'Unarchive Employee'
              )}
            </ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
