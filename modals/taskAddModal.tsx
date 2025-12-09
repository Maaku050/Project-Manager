import { Box } from '@/components/ui/box'
import { ScrollView } from 'react-native'
import { Text } from '@/components/ui/text'
import { Button, ButtonText } from '@/components/ui/button'
import { CheckIcon, CloseIcon, Icon } from '@/components/ui/icon'
import { View } from '@/components/Themed'
import { useUser } from '@/context/profileContext'
import { useProject } from '@/context/projectContext'
import { Heading } from '@/components/ui/heading'
import { Divider } from '@/components/ui/divider'
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
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
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
import { Search } from 'lucide-react-native'
import { useGlobalSearchParams, useLocalSearchParams } from 'expo-router'

type tasktModalType = {
  visible: boolean
  onClose: () => void
}

export default function TaskAddModal({ visible, onClose }: tasktModalType) {
  // UseStates
  const [tempTitle, setTempTitle] = useState<string>('')
  const [tempDescription, setTempDescription] = useState<string>('')
  const [tempStart, setTempStart] = useState<Date | null>(null)
  const [tempEnd, setTempEnd] = useState<Date | null>(null)
  const [tempAssigned, setTempAssigned] = useState<string[]>([])
  const [tempChildTasks, setTempChildTasks] = useState<string[]>([])
  const [searchInput, setSearchInput] = useState<string>('')
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const params = useLocalSearchParams()
  const projectID = params.project as string
  console.log('taskAddModal project ID: ', projectID)

  // Contexts
  const { tasks, roles } = useProject()
  const { profiles, profile } = useUser()

  // On Load Innitializations
  useEffect(() => {
    if (!visible) return

    // Initiallize Fields
    setTempTitle('')
    setTempDescription('')
    setTempStart(null)
    setTempEnd(null)
    setTempAssigned([])
    setTempChildTasks([])
  }, [visible])

  useEffect(() => {
    console.log('Child Tasks added: ', tempChildTasks)
  }, [tempChildTasks])

  // Functions
  const addTask = async () => {
    if (
      !tempTitle.trim() ||
      !tempDescription.trim() ||
      !tempStart ||
      !tempEnd ||
      !auth.currentUser
    )
      return

    setIsSaving(true)
    try {
      const toLocalStart = new Date(tempStart)
      const toLocalEnd = new Date(tempEnd)
      toLocalStart.setHours(0, 0, 0, 0)
      toLocalEnd.setHours(0, 0, 0, 0)

      const docRef = await addDoc(collection(db, 'tasks'), {
        title: tempTitle.trim(),
        description: tempDescription.trim(),
        projectID: projectID,
        status: 'To-do',
        start: Timestamp.fromDate(toLocalStart),
        end: Timestamp.fromDate(toLocalEnd),
        starPoints: 0,
        childTasks: tempChildTasks,
        parentTasks: null,
      })

      const taskID = docRef.id

      // Update parent tasks for all selected child tasks
      if (tempChildTasks.length !== 0) {
        const updatePromises = tempChildTasks.map((childTaskID) => {
          const taskRef = doc(db, 'tasks', childTaskID)
          return updateDoc(taskRef, {
            parentTasks: taskID, // Fixed: was using taskID instead of the loop variable
          })
        })
        await Promise.all(updatePromises) // Execute all updates in parallel
      }

      await handleSaveAssignedUsers(taskID)
      await handleLog(taskID)
    } catch (error: any) {
      console.log('Error adding task:', error.message)
    } finally {
      setIsSaving(false)
      onClose()
    }
  }

  const handleSaveAssignedUsers = async (taskID: string) => {
    try {
      const userRef = collection(db, 'assignedUser')
      for (const uid of tempAssigned) {
        await addDoc(userRef, {
          taskID,
          uid,
        })
      }
    } catch (err) {
      console.error('Error saving task assignments:', err)
    }
  }

  const handleLog = async (taskID: string) => {
    try {
      const logRef = collection(db, 'taskLogs')
      await addDoc(logRef, {
        taskID,
        uid: profile?.uid,
        createdAt: serverTimestamp(),
        text: 'created this task',
      })
    } catch (error) {}
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
            Add Task
          </Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} color="white" />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody showsVerticalScrollIndicator={false}>
          <HStack space="md" style={{ borderWidth: 0 }}>
            <Box
              style={{
                borderWidth: 0,
                flex: 1,
                marginTop: 25,
              }}
            >
              <Box style={{ flex: 1 }}>
                <Text
                  style={{
                    marginBottom: 5,
                    color: '#ffffffff',
                  }}
                >
                  Task name
                </Text>
                <TextInput
                  style={{
                    backgroundColor: 'white',
                    padding: 12,
                    fontSize: 16,
                    borderRadius: 8,
                  }}
                  placeholder="Enter the Task Title"
                  placeholderTextColor="#999"
                  onChangeText={setTempTitle}
                />
              </Box>

              <Box style={{ flex: 1 }}>
                <Text style={{ color: '#ffffffff' }}>Task timeline</Text>
                <HStack
                  style={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  space="sm"
                >
                  {/* Start */}
                  <Box style={{ flex: 1 }}>
                    <DateTimePicker
                      value={tempStart}
                      onChange={setTempStart}
                      mode="date"
                      placeholder="Select a date and time"
                    />
                  </Box>

                  {/* End */}
                  <Box style={{ flex: 1 }}>
                    <DateTimePicker
                      value={tempEnd}
                      onChange={setTempEnd}
                      mode="date"
                      placeholder="Select a date and time"
                    />
                  </Box>
                </HStack>
              </Box>
            </Box>

            <Box
              style={{
                borderWidth: 0,
                flex: 1,
                marginTop: 25,
              }}
            >
              <Text
                style={{
                  marginBottom: 5,
                  color: '#ffffffff',
                }}
              >
                Task description
              </Text>
              <Textarea
                size="sm"
                isReadOnly={false}
                isInvalid={false}
                style={{ flex: 1, borderRadius: 8 }}
              >
                <TextareaInput
                  placeholder="Enter the Task Description"
                  onChangeText={setTempDescription}
                  style={{ backgroundColor: '#ffffff', borderRadius: 8 }}
                />
              </Textarea>
            </Box>
          </HStack>

          <HStack space="sm">
            {/* Members */}
            <Box style={{ borderWidth: 0, flex: 1, marginTop: 25 }}>
              <Text style={{ color: '#ffffffff' }}>Task Assignee</Text>

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

            {/* Pre-requisite tasks */}
            <Box style={{ borderWidth: 0, flex: 1, marginTop: 25 }}>
              <Text style={{ color: '#ffffffff' }}>
                Pre-requisite task/s (Optional)
              </Text>

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
                <Box
                  style={{
                    borderWidth: 1,
                    borderColor: 'gray',
                    borderRadius: 8,
                    position: 'relative',
                    marginBottom: 10,
                  }}
                >
                  <TextInput
                    style={{
                      backgroundColor: 'white',
                      padding: 12,
                      paddingRight: 40,
                      fontSize: 16,
                      borderRadius: 8,
                    }}
                    placeholder="Search task name"
                    placeholderTextColor="#999"
                    value={searchInput}
                    onChangeText={setSearchInput}
                  />
                  <Icon
                    as={Search}
                    color="gray"
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: 14,
                    }}
                  />
                </Box>

                {/* Tasks List */}
                <VStack space="sm">
                  {tasks.filter(
                    (task) =>
                      task.projectID === projectID &&
                      (task.status === 'To-do' || task.status === 'Ongoing') &&
                      !task.parentTasks &&
                      (!task.childTasks || task.childTasks.length === 0) &&
                      task.title
                        .toLowerCase()
                        .includes(searchInput.toLowerCase())
                  ).length === 0 ? (
                    <Text
                      style={{
                        textAlign: 'center',
                        color: 'gray',
                        padding: 20,
                      }}
                    >
                      No tasks found
                    </Text>
                  ) : (
                    tasks
                      .filter(
                        (task) =>
                          task.projectID === projectID &&
                          (task.status === 'To-do' ||
                            task.status === 'Ongoing') &&
                          !task.parentTasks &&
                          (!task.childTasks || task.childTasks.length === 0) &&
                          task.title
                            .toLowerCase()
                            .includes(searchInput.toLowerCase()) // Add search filter
                      )
                      .map((task) => {
                        const isChecked = tempChildTasks.includes(task.id)

                        const toggleCheck = () => {
                          setTempChildTasks((prev) =>
                            isChecked
                              ? prev.filter((id) => id !== task.id)
                              : [...prev, task.id]
                          )
                        }

                        return (
                          <HStack
                            key={task.id}
                            style={{
                              alignItems: 'center',
                              paddingVertical: 6,
                            }}
                          >
                            <Checkbox
                              isChecked={isChecked}
                              onChange={toggleCheck}
                              value={task.id}
                              accessibilityLabel={task.title}
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

                            <Text
                              style={{
                                fontSize: 13,
                                marginLeft: 10,
                                flex: 1,
                              }}
                            >
                              {task.title}
                            </Text>
                          </HStack>
                        )
                      })
                  )}
                </VStack>
              </ScrollView>
            </Box>
          </HStack>
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
          <Button onPress={addTask} style={{ backgroundColor: 'white' }}>
            <ButtonText style={{ color: 'black' }}>
              {isSaving ? <Spinner size="small" color="grey" /> : 'Add task'}
            </ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
