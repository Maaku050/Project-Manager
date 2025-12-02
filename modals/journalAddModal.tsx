import DateTimePicker from '@/components/DateTimePicker'
import { Box } from '@/components/ui/box'
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
import { Textarea, TextareaInput } from '@/components/ui/textarea'
import { useUser } from '@/context/profileContext'
import { db } from '@/firebase/firebaseConfig'
import { useLocalSearchParams } from 'expo-router'
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Text, TextInput } from 'react-native'

type JournalAddModalType = {
  visible: boolean
  onClose: () => void
}

export default function JournalAddModal({
  visible,
  onClose,
}: JournalAddModalType) {
  const { profile } = useUser()
  const params = useLocalSearchParams()
  const [tempTitle, setTempTitle] = useState<string>('')
  const [tempDescription, setTempDescription] = useState<string>('')
  const [tempDate, setTempDate] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState<boolean>(false)

  useEffect(() => {
    if (!visible) return

    // Initiallize Fields
    setTempTitle('')
    setTempDescription('')
    setTempDate(null)
  }, [visible])

  const addJournal = async () => {
    if (!tempTitle.trim() || !tempDescription.trim() || !tempDate) return

    setIsSaving(true)
    try {
      const toLocalDate = new Date(tempDate)
      toLocalDate.setHours(0, 0, 0, 0)

      await addDoc(collection(db, 'journal'), {
        title: tempTitle.trim(),
        description: tempDescription.trim(),
        projectID: params.project as string,
        date: Timestamp.fromDate(toLocalDate),
        createdBy: profile?.uid,
      })
    } catch (error: any) {
      console.log('Error creating journal:', error.message)
    } finally {
      setIsSaving(false)
      onClose()
    }
  }

  return (
    <Modal isOpen={visible} onClose={onClose} size="full">
      <ModalBackdrop />
      <ModalContent
        style={{
          borderColor: 'red',
          borderWidth: 0,
          backgroundColor: '#000000',
          width: 892,
          height: 530,
        }}
      >
        <ModalHeader>
          <Heading size="lg" style={{ color: '#ffffffff' }}>
            Add Journal
          </Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} color="white" />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Box
            style={{
              borderWidth: 0,
              flex: 1,
              marginTop: 30,
            }}
          >
            <Box style={{ marginBottom: 20 }}>
              <Text
                style={{
                  marginBottom: 5,
                  color: '#ffffffff',
                }}
              >
                Journal name
              </Text>
              <TextInput
                style={{
                  padding: 8,
                  fontSize: 16,
                  backgroundColor: 'white',
                  borderRadius: 8,
                }}
                placeholder="Enter the Task Title"
                placeholderTextColor="#999"
                onChangeText={setTempTitle}
              />
            </Box>

            <Box style={{ marginBottom: 20 }}>
              <Text style={{ color: '#ffffffff' }}>Journal date</Text>
              <Box style={{ flex: 1 }}>
                <DateTimePicker
                  value={tempDate}
                  onChange={setTempDate}
                  mode="date"
                  placeholder="Select a date and time"
                />
              </Box>
            </Box>

            <Box>
              <Text
                style={{
                  marginBottom: 5,
                  color: '#ffffffff',
                }}
              >
                Journal description
              </Text>
              <Textarea size="md" isReadOnly={false} isInvalid={false}>
                <TextareaInput
                  placeholder="Enter Journal Details"
                  onChangeText={setTempDescription}
                  style={{ backgroundColor: '#ffffff' }}
                />
              </Textarea>
            </Box>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="outline"
            action="secondary"
            className="mr-3"
            onPress={onClose}
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button onPress={addJournal} style={{ backgroundColor: 'white' }}>
            <ButtonText style={{ color: 'black' }}>
              {isSaving ? <Spinner size="small" color="grey" /> : 'Add journal'}
            </ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
