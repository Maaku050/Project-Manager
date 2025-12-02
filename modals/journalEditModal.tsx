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
import { useProject } from '@/context/projectContext'
import { db } from '@/firebase/firebaseConfig'
import { useLocalSearchParams } from 'expo-router'
import {
  addDoc,
  collection,
  doc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Text, TextInput } from 'react-native'

type JournalEditModalType = {
  visible: boolean
  onClose: () => void
  journalID: string
}

export default function JournalEditModal({
  visible,
  onClose,
  journalID,
}: JournalEditModalType) {
  const { journal } = useProject()
  const [tempTitle, setTempTitle] = useState<string>('')
  const [tempDescription, setTempDescription] = useState<string>('')
  const [tempDate, setTempDate] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const currentJournal = journal.find((journal) => journal.id === journalID)

  useEffect(() => {
    if (!visible || !currentJournal) return

    setTempTitle(currentJournal.title)
    setTempDescription(currentJournal.description)
    setTempDate(currentJournal.date.toDate())
  }, [visible])

  const handleSave = async () => {
    if (!tempTitle.trim() || !tempDescription.trim() || !tempDate) return

    setIsSaving(true)
    try {
      const toLocalDate = new Date(tempDate)
      toLocalDate.setHours(0, 0, 0, 0)

      const journalRef = doc(db, 'journal', journalID)
      await updateDoc(journalRef, {
        title: tempTitle.trim(),
        description: tempDescription.trim(),
        date: Timestamp.fromDate(toLocalDate),
      })
    } catch (error) {
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
            Edit Journal
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
                value={tempTitle}
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
                  value={tempDescription}
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
          <Button onPress={handleSave} style={{ backgroundColor: 'white' }}>
            <ButtonText style={{ color: 'black' }}>
              {isSaving ? (
                <Spinner size="small" color="grey" />
              ) : (
                'Save changes'
              )}
            </ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
