import { Box } from '@/components/ui/box'
import { ScrollView } from 'react-native'
import { Text } from '@/components/ui/text'
import { Button, ButtonText } from '@/components/ui/button'
import { CheckIcon, CloseIcon, Icon } from '@/components/ui/icon'
import { View } from '@/components/Themed'
import { useUser } from '@/context/profileContext'
import { useProject } from '@/context/projectContext'
import { useEffect, useState } from 'react'
import React from 'react'
import { TextInput } from 'react-native-gesture-handler'
import { db } from '@/firebase/firebaseConfig'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
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
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Pressable } from '@/components/ui/pressable'
import { ArrowLeft } from 'lucide-react-native'

export default function EditProjectScreen() {
  // UseStates
  const [tempTitle, setTempTitle] = useState<string>('')
  const [tempDescription, setTempDescription] = useState<string>('')
  const [tempDeadline, setTempDeadline] = useState<Date | null>(null)
  const [tempAssigned, setTempAssigned] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const router = useRouter()
  const params = useLocalSearchParams()
  const projectID = params.project as string
  const origin = params.origin as string

  // Contexts
  const { project, assignedUser, roles } = useProject()
  const { profiles } = useUser()

  // On Load Innitializations
  const currentProjectData = project.find((t) => t.id === projectID)
  const projectDeadline =
    currentProjectData?.deadline && 'toDate' in currentProjectData.deadline
      ? currentProjectData.deadline.toDate()
      : null

  // Remove other tempAssigned effects and use only this one:
  useEffect(() => {
    if (!projectID || !currentProjectData) return

    // Initialize assigned users for this project when modal opens
    const assignedUids = assignedUser
      .filter((a) => a.projectID === projectID)
      .map((a) => a.uid)

    setTempAssigned(assignedUids)

    // Initialize other fields
    const projectDeadline =
      currentProjectData.deadline && 'toDate' in currentProjectData.deadline
        ? currentProjectData.deadline.toDate()
        : null
    setTempTitle(currentProjectData.title)
    setTempDescription(currentProjectData.description)
    setTempDeadline(projectDeadline)
  }, [params.project as string, currentProjectData])

  // Functions
  const handleSave = async () => {
    if (!tempTitle.trim() || !tempDescription.trim() || !tempDeadline) return
    setIsSaving(true)
    try {
      const projectRef = doc(db, 'project', projectID)
      const localDeadline = new Date(tempDeadline)
      localDeadline.setHours(0, 0, 0, 0)

      await updateDoc(projectRef, {
        title: tempTitle.trim(),
        description: tempDescription.trim(),
        deadline: Timestamp.fromDate(localDeadline),
      })

      await handleSaveAssignedUsers() // ✅ Save assigned users last
    } catch (err) {
      console.error('Error saving project details: ', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveAssignedUsers = async () => {
    try {
      const userRef = collection(db, 'assignedUser')

      // Get current assignments for this project
      const q = query(userRef, where('projectID', '==', projectID))
      const snapshot = await getDocs(q)

      // Map current assignments
      const currentAssignments = snapshot.docs.map((doc) => ({
        id: doc.id,
        uid: doc.data().uid,
        ref: doc.ref,
      }))

      const currentUIDs = new Set(currentAssignments.map((a) => a.uid))
      const tempUIDs = new Set(tempAssigned)

      // Find users to remove (in current but not in temp)
      const toRemove = currentAssignments.filter((a) => !tempUIDs.has(a.uid))

      // Find users to add (in temp but not in current)
      const toAdd = tempAssigned.filter((uid) => !currentUIDs.has(uid))

      // Batch delete users not in tempAssigned
      const deletePromises = toRemove.map((a) => deleteDoc(a.ref))

      // Batch add new users
      const addPromises = toAdd.map((uid) =>
        addDoc(userRef, {
          projectID: projectID,
          uid,
        })
      )

      // Execute all operations in parallel
      await Promise.all([...deletePromises, ...addPromises])

      {
        origin === 'projectWindow'
          ? router.replace(`/projectWindow?project=${projectID}`)
          : router.replace('/(screens)/project')
      }
    } catch (err) {
      console.error('Error saving assignments:', err)
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#000000', padding: 12 }}
      showsVerticalScrollIndicator={false}
    >
      <Pressable
        onPress={() => {
          origin === 'projectWindow'
            ? router.replace(`/projectWindow?project=${projectID}`)
            : router.replace('/(screens)/project')
        }}
        style={{ marginBottom: 10 }}
      >
        <HStack style={{ alignItems: 'center' }} space="sm">
          <ArrowLeft color={'white'} />
          <Text style={{ color: 'white', fontSize: 15 }}>Edit Project</Text>
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
          placeholder="Enter your Project Title"
          placeholderTextColor="#999"
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
          style={{ maxHeight: 200 }}
        >
          <TextareaInput
            style={{ color: '#000000', backgroundColor: '#ffffff' }}
            placeholder="Enter your Project Description"
            value={tempDescription}
            onChangeText={setTempDescription}
          />
        </Textarea>
      </Box>

      <Box style={{ marginBottom: 10 }}>
        <Text style={{ color: '#ffffff', fontSize: 15 }}>Project Deadline</Text>
        <DateTimePicker
          value={tempDeadline ? tempDeadline : projectDeadline}
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
          onPress={() => {
            origin === 'projectWindow'
              ? router.replace(`/projectWindow?project=${projectID}`)
              : router.replace('/(screens)/project')
          }}
        >
          <ButtonText>Cancel</ButtonText>
        </Button>
        <Button onPress={handleSave} style={{ backgroundColor: 'white' }}>
          <ButtonText style={{ color: 'black' }}>
            {isSaving ? (
              <Spinner size="small" color="grey" />
            ) : (
              'Update project'
            )}
          </ButtonText>
        </Button>
      </VStack>
    </ScrollView>
  )
}
