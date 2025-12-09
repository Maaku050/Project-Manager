import { Box } from '@/components/ui/box'
import { Pressable, ScrollView, useWindowDimensions } from 'react-native'
import { Text } from '@/components/ui/text'
import { Button, ButtonText } from '@/components/ui/button'
import { CheckIcon, CloseIcon, Icon } from '@/components/ui/icon'
import { View } from '@/components/Themed'
import { useUser } from '@/context/profileContext'
import { useProject } from '@/context/projectContext'
import { Heading } from '@/components/ui/heading'
import {
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Modal,
} from '@/components/ui/modal'
import { useEffect, useState } from 'react'
import React from 'react'
import { TextInput } from 'react-native-gesture-handler'
import { auth, db } from '@/firebase/firebaseConfig'
import { addDoc, collection, Timestamp } from 'firebase/firestore'
import { HStack } from '@/components/ui/hstack'
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
} from '@/components/ui/checkbox'
import { VStack } from '@/components/ui/vstack'
import { Avatar, AvatarFallbackText, AvatarBadge } from '@/components/ui/avatar'
import { Spinner } from '@/components/ui/spinner'
import DateTimePicker from '@/components/DateTimePicker'
import { Textarea, TextareaInput } from '@/components/ui/textarea'
import { useFocusEffect, useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'

export default function AddProjectScreen() {
  // UseStates
  const [tempTitle, setTempTitle] = useState<string>('')
  const [tempDescription, setTempDescription] = useState<string>('')
  const [tempDeadline, setTempDeadline] = useState<Date | null>(null)
  const [tempAssigned, setTempAssigned] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const router = useRouter()
  const dimensions = useWindowDimensions()
  const isMobile = dimensions.width <= 768
  const isDesktop = dimensions.width >= 1280

  // Contexts
  const { roles } = useProject()
  const { profiles } = useUser()

  // On Load Innitializations

  useFocusEffect(
    React.useCallback(() => {
      // Reset fields every time screen comes into focus
      setTempTitle('')
      setTempDescription('')
      setTempDeadline(null)
      setTempAssigned([])
    }, [])
  )

  // Functions
  const addProject = async () => {
    if (
      !tempTitle.trim() ||
      !tempDescription.trim() ||
      !tempDeadline ||
      !auth.currentUser
    )
      return

    setIsSaving(true)
    try {
      const localDeadline = new Date(tempDeadline)
      localDeadline.setHours(0, 0, 0, 0)

      const docRef = await addDoc(collection(db, 'project'), {
        title: tempTitle.trim(),
        description: tempDescription.trim(),
        createdBy: auth.currentUser.uid,
        status: 'Ongoing',
        startedAt: Timestamp.now(),
        deadline: Timestamp.fromDate(localDeadline),
      })

      const projectID = docRef.id

      await handleSaveAssignedUsers(projectID)
    } catch (error: any) {
      console.log('Error adding task:', error.message)
    } finally {
      setIsSaving(false)
      router.replace('/(screens)/project')
    }
  }

  const handleSaveAssignedUsers = async (projectID: string) => {
    try {
      const userRef = collection(db, 'assignedUser')

      for (const uid of tempAssigned) {
        await addDoc(userRef, {
          projectID,
          uid,
        })
      }
    } catch (err) {
      console.error('Error saving task assignments:', err)
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#000000', paddingHorizontal: 10 }}
      showsVerticalScrollIndicator={false}
    >
      <Pressable
        onPress={() => router.replace('/(screens)/project')}
        style={{ marginBottom: 10 }}
      >
        <HStack style={{ alignItems: 'center' }} space="sm">
          <ArrowLeft color={'white'} size={20} />
          <Text style={{ color: 'white', fontSize: 15 }}>Add Project</Text>
        </HStack>
      </Pressable>

      <Box style={{ borderWidth: 0, marginBottom: 10 }}>
        <Text
          style={{
            marginBottom: 5,
            color: '#ffffff',
            fontSize: 15,
          }}
        >
          Project name
        </Text>
        <TextInput
          style={{
            backgroundColor: 'white',
            paddingVertical: 10,
            fontSize: 15,
            borderRadius: 8,
            paddingHorizontal: 10,
            outline: 'none',
            outlineWidth: 0,
            outlineColor: 'transparent',
          }}
          placeholder="Enter project name"
          value={tempTitle}
          onChangeText={setTempTitle}
        />
      </Box>

      <Box style={{ marginBottom: 10 }}>
        <Text
          style={{
            marginBottom: 5,
            color: '#ffffff',
            fontSize: 15,
          }}
        >
          Project Description
        </Text>
        <Textarea
          size="sm"
          isReadOnly={false}
          isInvalid={false}
          style={{
            backgroundColor: '#ffffff',
          }}
        >
          <TextareaInput
            placeholder="Enter your Project Description"
            value={tempDescription}
            onChangeText={setTempDescription}
          />
        </Textarea>
      </Box>

      <Box style={{ marginBottom: 10 }}>
        <Text style={{ color: '#ffffff', fontSize: 15 }}>Project Deadline</Text>
        <DateTimePicker
          value={tempDeadline}
          onChange={setTempDeadline}
          placeholder="Select a date and time"
        />
      </Box>

      <Box style={{ borderWidth: 0, flex: 1 }}>
        <Text style={{ color: '#ffffff', fontSize: 15 }}>Project Members</Text>

        <ScrollView
          style={{
            marginTop: 5,
            borderWidth: 0,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 10,
            backgroundColor: '#fff',
            height: 302,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Members List */}
          <VStack space="sm">
            {roles
              .filter((role) =>
                profiles.some((profile) => profile.role === role.role)
              )
              .map((role, i) => {
                const matchingProfiles = profiles.filter(
                  (profile) => profile.role === role.role
                )

                return (
                  <View key={i}>
                    <HStack
                      style={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: 6,
                      }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                        {role.role}
                      </Text>
                    </HStack>

                    <VStack>
                      {matchingProfiles.map((p) => {
                        const isChecked = tempAssigned.includes(p.uid)

                        const toggleCheck = () => {
                          setTempAssigned((prev) =>
                            isChecked
                              ? prev.filter((uid) => uid !== p.uid)
                              : [...prev, p.uid]
                          )
                          console.log(tempAssigned)
                        }

                        return (
                          <HStack
                            key={p.uid}
                            style={{
                              alignItems: 'center',
                              marginTop: 10,
                            }}
                          >
                            <Checkbox
                              isChecked={isChecked}
                              onChange={toggleCheck}
                              value={p.uid}
                              accessibilityLabel={`${p.firstName} ${p.lastName}`}
                              hitSlop={{
                                top: 10,
                                bottom: 10,
                                left: 10,
                                right: 10,
                              }}
                            >
                              <CheckboxIndicator>
                                <CheckboxIcon as={CheckIcon} />
                              </CheckboxIndicator>
                            </Checkbox>

                            <Avatar size="sm" style={{ marginLeft: 8 }}>
                              <AvatarFallbackText>
                                {p.firstName}
                              </AvatarFallbackText>
                              <AvatarBadge />
                            </Avatar>

                            <Text
                              style={{
                                fontSize: 13,
                                marginLeft: 10,
                              }}
                            >
                              {p.firstName} {p.lastName}
                            </Text>
                          </HStack>
                        )
                      })}
                    </VStack>
                  </View>
                )
              })}
          </VStack>
        </ScrollView>
      </Box>

      <VStack style={{ marginTop: 20, marginBottom: 20 }} space="xs">
        <Button
          variant="solid"
          onPress={() => router.replace('/(screens)/project')}
        >
          <ButtonText>Cancel</ButtonText>
        </Button>
        <Button onPress={addProject} style={{ backgroundColor: 'white' }}>
          <ButtonText style={{ color: 'black' }}>
            {isSaving ? <Spinner size="small" color="grey" /> : 'Add project'}
          </ButtonText>
        </Button>
      </VStack>
    </ScrollView>
  )
}
