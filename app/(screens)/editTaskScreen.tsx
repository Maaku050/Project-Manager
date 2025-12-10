import DateTimePicker from '@/components/DateTimePicker'
import { View } from '@/components/Themed'
import { Avatar, AvatarBadge, AvatarFallbackText } from '@/components/ui/avatar'
import { Box } from '@/components/ui/box'
import { Button, ButtonText } from '@/components/ui/button'
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
} from '@/components/ui/checkbox'
import { Divider } from '@/components/ui/divider'
import { Heading } from '@/components/ui/heading'
import { HStack } from '@/components/ui/hstack'
import { CheckIcon, CloseIcon, Icon } from '@/components/ui/icon'
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
import { Text } from '@/components/ui/text'
import { Textarea, TextareaInput } from '@/components/ui/textarea'
import { VStack } from '@/components/ui/vstack'
import { useUser } from '@/context/profileContext'
import { useProject } from '@/context/projectContext'
import { db } from '@/firebase/firebaseConfig'
import { useLocalSearchParams, useRouter } from 'expo-router'
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
import { ArrowLeft, Search } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { Pressable, ScrollView } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

export default function TaskEditModal() {
  // UseStates
  const [tempTitle, setTempTitle] = useState<string>('')
  const [tempDescription, setTempDescription] = useState<string>('')
  const [tempStart, setTempStart] = useState<Date | null>(null)
  const [tempEnd, setTempEnd] = useState<Date | null>(null)
  const [tempAssigned, setTempAssigned] = useState<string[]>([])
  const [tempChildTasks, setTempChildTasks] = useState<string[]>([])
  const [searchInput, setSearchInput] = useState<string>('')
  const [isSaving, setIsSaving] = useState<boolean>(false)

  // Contexts
  const { tasks, assignedUser, roles } = useProject()
  const { profiles } = useUser()
  const params = useLocalSearchParams()
  const router = useRouter()
  const taskID = params.task as string
  // On Load Innitializations
  const currentTaskData = tasks.find((t) => t.id === taskID)
  const projectID = currentTaskData?.projectID || (params.project as string) // ✅ Get projectID from task

  useEffect(() => {
    if (!currentTaskData || !projectID) return

    // Initialize other fields
    if (currentTaskData) {
      const taskStartDeadline =
        currentTaskData.start && 'toDate' in currentTaskData.start
          ? currentTaskData.start.toDate()
          : null

      const taskEndDeadline =
        currentTaskData.end && 'toDate' in currentTaskData.end
          ? currentTaskData.end.toDate()
          : null

      setTempTitle(currentTaskData.title)
      setTempDescription(currentTaskData.description)
      setTempStart(taskStartDeadline)
      setTempEnd(taskEndDeadline)

      // Initialize assigned users for this project when modal opens
      const assignedUids = assignedUser
        .filter((a) => a.taskID === taskID)
        .map((a) => a.uid)

      setTempAssigned(assignedUids)
      setTempChildTasks(currentTaskData.childTasks || []) // ✅ Handle undefined
    }
  }, [taskID, currentTaskData, projectID])

  // Functions
  const updateTask = async () => {
    if (
      !tempTitle.trim() ||
      !tempDescription.trim() ||
      !tempStart ||
      !tempEnd ||
      !taskID
    )
      return

    setIsSaving(true)
    try {
      const toLocalStart = new Date(tempStart)
      const toLocalEnd = new Date(tempEnd)
      toLocalStart.setHours(0, 0, 0, 0)
      toLocalEnd.setHours(0, 0, 0, 0)

      const taskRef = doc(db, 'tasks', taskID)

      await updateDoc(taskRef, {
        title: tempTitle.trim(),
        description: tempDescription.trim(),
        start: Timestamp.fromDate(toLocalStart),
        end: Timestamp.fromDate(toLocalEnd),
        childTasks: tempChildTasks,
      })

      await Promise.all([handleSaveAssignedUsers(), handleSaveChildTasks()])
    } catch (error: any) {
      console.log('Error updating task:', error.message)
    } finally {
      setIsSaving(false)
      router.replace(
        `/(screens)/taskWindow?project=${projectID}&task=${taskID}`
      )
    }
  }

  const handleSaveChildTasks = async () => {
    try {
      const taskRef = collection(db, 'tasks')

      // Get current child tasks for this parent task
      const q = query(taskRef, where('parentTasks', '==', taskID))
      const snapshot = await getDocs(q)

      // Map current child tasks
      const currentChildTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ref: doc.ref,
      }))

      const currentTaskIDs = new Set(currentChildTasks.map((t) => t.id))
      const tempTaskIDs = new Set(tempChildTasks)

      // Find tasks to remove parent from (in current but not in temp)
      const toRemove = currentChildTasks.filter((t) => !tempTaskIDs.has(t.id))

      // Find tasks to add parent to (in temp but not in current)
      const toAdd = tempChildTasks.filter(
        (childTaskID) => !currentTaskIDs.has(childTaskID)
      )

      console.log(
        'Child tasks - toRemove:',
        toRemove.map((t) => t.id)
      )
      console.log('Child tasks - toAdd:', toAdd)

      // Batch remove parent from tasks not in tempChildTasks
      const removePromises = toRemove.map((t) =>
        updateDoc(t.ref, {
          parentTasks: null,
        })
      )

      // ✅ FIXED: Batch add parent to new child tasks with correct parent ID
      const addPromises = toAdd.map((childTaskID) => {
        const taskDocRef = doc(db, 'tasks', childTaskID)
        return updateDoc(taskDocRef, {
          parentTasks: taskID, // ✅ Set to the PARENT's ID (the task being edited)
        })
      })

      // Execute all operations in parallel
      await Promise.all([...removePromises, ...addPromises])

      console.log('Child tasks updated successfully')
    } catch (err) {
      console.error('Error saving child tasks:', err)
    }
  }

  const handleSaveAssignedUsers = async () => {
    try {
      const userRef = collection(db, 'assignedUser')

      // Get current assignments for this task
      const q = query(userRef, where('taskID', '==', taskID))
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
          taskID: taskID,
          uid,
        })
      )

      // Execute all operations in parallel
      await Promise.all([...deletePromises, ...addPromises])

      console.log('Assigned users updated successfully')
    } catch (err) {
      console.error('Error saving task assignments:', err)
    }
  }

  if (!currentTaskData) {
    return null
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#000000', padding: 12 }}
      showsVerticalScrollIndicator={false}
    >
      <Pressable
        onPress={() => {
          router.replace(
            `/(screens)/taskWindow?project=${projectID}&task=${taskID}`
          )
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
          value={tempTitle}
          onChangeText={setTempTitle}
        />
      </Box>

      <Box style={{ marginBottom: 10 }}>
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
            value={tempDescription}
            onChangeText={setTempDescription}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 8,
            }}
          />
        </Textarea>
      </Box>

      <Box style={{ marginBottom: 10 }}>
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
              placeholder="Select a date and time"
            />
          </Box>

          {/* End */}
          <Box style={{ flex: 1 }}>
            <DateTimePicker
              value={tempEnd}
              onChange={setTempEnd}
              placeholder="Select a date and time"
            />
          </Box>
        </HStack>
      </Box>

      <Box style={{ borderWidth: 0, flex: 1, marginBottom: 10 }}>
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

      {currentTaskData?.parentTasks ? null : (
        <Box style={{ borderWidth: 0, flex: 1, marginBottom: 10 }}>
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
              {tasks.filter((task) => {
                // ✅ Use projectID variable instead of selectedProject
                if (task.projectID !== projectID) return false

                // Must be To-do or Ongoing
                if (task.status !== 'To-do' && task.status !== 'Ongoing')
                  return false

                // Exclude the current task being edited
                if (task.id === taskID) return false

                if (
                  !task.title.toLowerCase().includes(searchInput.toLowerCase())
                )
                  return false

                // If this task is already a child of the current task, include it
                if (task.parentTasks === taskID) return true

                // Otherwise, only include tasks with no parent and no children
                return (
                  !task.parentTasks &&
                  (!task.childTasks || task.childTasks.length === 0)
                )
              }).length === 0 ? (
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
                  .filter((task) => {
                    // ✅ Use projectID variable instead of selectedProject
                    if (task.projectID !== projectID) return false

                    // Must be To-do or Ongoing
                    if (task.status !== 'To-do' && task.status !== 'Ongoing')
                      return false

                    // Exclude the current task being edited
                    if (task.id === taskID) return false

                    if (
                      !task.title
                        .toLowerCase()
                        .includes(searchInput.toLowerCase())
                    )
                      return false

                    // If this task is already a child of the current task, include it
                    if (task.parentTasks === taskID) return true

                    // Otherwise, only include tasks with no parent and no children
                    return (
                      !task.parentTasks &&
                      (!task.childTasks || task.childTasks.length === 0)
                    )
                  })
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
      )}

      <VStack style={{ marginTop: 20, marginBottom: 20 }} space="xs">
        <Button
          variant="solid"
          onPress={() => {
            router.replace(
              `/(screens)/taskWindow?project=${projectID}&task=${taskID}`
            )
          }}
        >
          <ButtonText>Cancel</ButtonText>
        </Button>
        <Button onPress={updateTask} style={{ backgroundColor: 'white' }}>
          <ButtonText style={{ color: 'black' }}>
            {isSaving ? <Spinner size="small" color="grey" /> : 'Save changes'}
          </ButtonText>
        </Button>
      </VStack>
    </ScrollView>
  )
}
