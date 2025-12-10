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
import { Spinner } from '@/components/ui/spinner'
import { Textarea, TextareaInput } from '@/components/ui/textarea'
import { VStack } from '@/components/ui/vstack'
import { useUser } from '@/context/profileContext'
import { db } from '@/firebase/firebaseConfig'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { ArrowLeft } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { Pressable, ScrollView, Text, TextInput } from 'react-native'

export default function AddJournalScreen() {
  const { profile } = useUser()
  const params = useLocalSearchParams()
  const router = useRouter()
  const [tempTitle, setTempTitle] = useState<string>('')
  const [tempDescription, setTempDescription] = useState<string>('')
  const [tempDate, setTempDate] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState<boolean>(false)

  useEffect(() => {
    setTempTitle('')
    setTempDescription('')
    setTempDate(null)
  }, [])

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
          <Text style={{ color: 'white', fontSize: 15 }}>Add Journal</Text>
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
            padding: 10,
            fontSize: 13,
            backgroundColor: 'white',
            borderRadius: 8,
          }}
          placeholder="Enter the Task Title"
          placeholderTextColor="#999"
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
          placeholder="Select a date"
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
        <Textarea size="sm" isReadOnly={false} isInvalid={false}>
          <TextareaInput
            placeholder="Enter Journal Details"
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
        <Button onPress={addJournal} style={{ backgroundColor: 'white' }}>
          <ButtonText style={{ color: 'black' }}>
            {isSaving ? <Spinner size="small" color="grey" /> : 'Add journal'}
          </ButtonText>
        </Button>
      </VStack>
    </ScrollView>
  )
}
