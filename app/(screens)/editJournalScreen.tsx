import DateTimePicker from '@/components/DateTimePicker'
import { Box } from '@/components/ui/box'
import { Button, ButtonText } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { HStack } from '@/components/ui/hstack'
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
import { Pressable } from '@/components/ui/pressable'
import { Spinner } from '@/components/ui/spinner'
import { Textarea, TextareaInput } from '@/components/ui/textarea'
import { VStack } from '@/components/ui/vstack'
import { useUser } from '@/context/profileContext'
import { useProject } from '@/context/projectContext'
import { db } from '@/firebase/firebaseConfig'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {
  addDoc,
  collection,
  doc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'
import { ArrowLeft } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { ScrollView, Text, TextInput } from 'react-native'

export default function EditJournalScreen() {
  const { journal } = useProject()
  const params = useLocalSearchParams()
  const router = useRouter()
  const [tempTitle, setTempTitle] = useState<string>('')
  const [tempDescription, setTempDescription] = useState<string>('')
  const [tempDate, setTempDate] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const currentJournal = journal.find(
    (journal) => journal.id === (params.journalID as string)
  )

  useEffect(() => {
    if (!currentJournal) return

    setTempTitle(currentJournal.title)
    setTempDescription(currentJournal.description)
    setTempDate(currentJournal.date.toDate())
  }, [params.journalID as string])

  const handleSave = async () => {
    if (!tempTitle.trim() || !tempDescription.trim() || !tempDate) return

    setIsSaving(true)
    try {
      const toLocalDate = new Date(tempDate)
      toLocalDate.setHours(0, 0, 0, 0)

      const journalRef = doc(db, 'journal', params.journalID as string)
      await updateDoc(journalRef, {
        title: tempTitle.trim(),
        description: tempDescription.trim(),
        date: Timestamp.fromDate(toLocalDate),
      })
    } catch (error) {
    } finally {
      setIsSaving(false)
      router.replace(
        `/(screens)/projectJournalScreen?project=${params.project as string}`
      )
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#000000', padding: 12 }}>
      <Pressable
        onPress={() =>
          router.replace(
            `/(screens)/projectJournalScreen?project=${params.project as string}`
          )
        }
        style={{ marginBottom: 10 }}
      >
        <HStack style={{ alignItems: 'center' }} space="sm">
          <ArrowLeft color={'white'} />
          <Text style={{ color: 'white', fontSize: 15 }}>Edit Journal</Text>
        </HStack>
      </Pressable>

      <Box style={{ borderWidth: 0, marginBottom: 10 }}>
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

      <Box style={{ marginBottom: 10 }}>
        <Text style={{ color: '#ffffffff', marginBottom: 5 }}>
          Journal date
        </Text>
        <DateTimePicker
          value={tempDate}
          onChange={setTempDate}
          placeholder="Select a date and time"
        />
      </Box>

      <Box style={{ marginBottom: 10 }}>
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

      <VStack style={{ marginTop: 20, marginBottom: 20 }} space="xs">
        <Button
          variant="solid"
          onPress={() =>
            router.replace(
              `/(screens)/projectJournalScreen?project=${params.project as string}`
            )
          }
        >
          <ButtonText>Cancel</ButtonText>
        </Button>
        <Button onPress={handleSave} style={{ backgroundColor: 'white' }}>
          <ButtonText style={{ color: 'black' }}>
            {isSaving ? <Spinner size="small" color="grey" /> : 'Save changes'}
          </ButtonText>
        </Button>
      </VStack>
    </ScrollView>
  )
}
