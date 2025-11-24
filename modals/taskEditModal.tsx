import DateTimePicker from "@/components/DateTimePicker";
import { View } from "@/components/Themed";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
} from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
} from "@/components/ui/checkbox";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { CheckIcon, CloseIcon, Icon } from "@/components/ui/icon";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { VStack } from "@/components/ui/vstack";
import { useUser } from "@/context/profileContext";
import { useProject } from "@/context/projectContext";
import { db } from "@/firebase/firebaseConfig";
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
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { TextInput } from "react-native-gesture-handler";

type tasktModalType = {
  visible: boolean;
  onClose: () => void;
};

export default function TaskEditModal({ visible, onClose }: tasktModalType) {
  // UseStates
  const [tempTitle, setTempTitle] = useState<string>("");
  const [tempDescription, setTempDescription] = useState<string>("");
  const [tempStart, setTempStart] = useState<Date | null>(null);
  const [tempEnd, setTempEnd] = useState<Date | null>(null);
  const [tempAssigned, setTempAssigned] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Contexts
  const { selectedTask, tasks, assignedUser, selectedProject } = useProject();
  const { profiles } = useUser();

  // On Load Innitializations
  const currentTaskData = tasks.find((t) => t.id === selectedTask);

  useEffect(() => {
    if (!visible) return;

    // Initialize other fields
    if (currentTaskData) {
      const taskStartDeadline =
        currentTaskData.start && "toDate" in currentTaskData.start
          ? currentTaskData.start.toDate()
          : null;

      const taskEndDeadline =
        currentTaskData.end && "toDate" in currentTaskData.end
          ? currentTaskData.end.toDate()
          : null;

      setTempTitle(currentTaskData.title);
      setTempDescription(currentTaskData.description);
      setTempStart(taskStartDeadline);
      setTempEnd(taskEndDeadline);

      // Initialize assigned users for this project when modal opens
      const assignedUids = assignedUser
        .filter((a) => a.taskID === selectedTask)
        .map((a) => a.uid);

      setTempAssigned(assignedUids);
    }
  }, [visible]);

  // Functions
  const updateTask = async () => {
    if (
      !tempTitle.trim() ||
      !tempDescription.trim() ||
      !tempStart ||
      !tempEnd ||
      !selectedTask
    )
      return;

    setIsSaving(true);
    try {
      const toLocalStart = new Date(tempStart);
      const toLocalEnd = new Date(tempEnd);
      toLocalStart.setHours(0, 0, 0, 0);
      toLocalEnd.setHours(0, 0, 0, 0);

      const taskRef = doc(db, "tasks", selectedTask);

      await updateDoc(taskRef, {
        title: tempTitle.trim(),
        description: tempDescription.trim(),
        projectID: selectedProject,
        status: "To-do",
        start: Timestamp.fromDate(toLocalStart),
        end: Timestamp.fromDate(toLocalEnd),
        starID: null,
      });

      await handleSaveAssignedUsers();
    } catch (error: any) {
      console.log("Error adding task:", error.message);
    } finally {
      setIsSaving(false);
      onClose();
    }
  };

  const handleSaveAssignedUsers = async () => {
    try {
      const userRef = collection(db, "assignedUser");

      // Get current assignments for this task
      const q = query(userRef, where("taskID", "==", selectedTask));
      const snapshot = await getDocs(q);

      // Map current assignments
      const currentAssignments = snapshot.docs.map((doc) => ({
        id: doc.id,
        uid: doc.data().uid,
        ref: doc.ref,
      }));

      const currentUIDs = new Set(currentAssignments.map((a) => a.uid));
      const tempUIDs = new Set(tempAssigned);

      // Find users to remove (in current but not in temp)
      const toRemove = currentAssignments.filter((a) => !tempUIDs.has(a.uid));

      // Find users to add (in temp but not in current)
      const toAdd = tempAssigned.filter((uid) => !currentUIDs.has(uid));

      // Batch delete users not in tempAssigned
      const deletePromises = toRemove.map((a) => deleteDoc(a.ref));

      // Batch add new users
      const addPromises = toAdd.map((uid) =>
        addDoc(userRef, {
          taskID: selectedTask,
          uid,
        })
      );

      // Execute all operations in parallel
      await Promise.all([...deletePromises, ...addPromises]);
    } catch (err) {
      console.error("Error saving task assignments:", err);
    }
  };

  return (
    <Modal isOpen={visible} onClose={onClose} size="full">
      <ModalBackdrop />
      <ModalContent
        style={{
          borderColor: "red",
          borderWidth: 0,
          backgroundColor: "#000000",
          width: 892,
          height: 530,
        }}
      >
        <ModalHeader>
          <Heading size="lg" style={{ color: "#ffffffff" }}>
            Edit Task
          </Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} color="white" />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <HStack>
            <Box
              style={{
                borderWidth: 0,
                flex: 1,
                marginRight: 10,
                marginTop: 25,
              }}
            >
              <Box style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    marginBottom: 5,
                    color: "#ffffffff",
                  }}
                >
                  Task name
                </Text>
                <TextInput
                  style={{
                    borderBottomWidth: 1,
                    borderColor: "#ffffffff",
                    paddingVertical: 8,
                    fontSize: 16,
                    color: "#ffffffff",
                  }}
                  placeholder="Enter the Task Title"
                  placeholderTextColor="#999"
                  value={tempTitle}
                  onChangeText={setTempTitle}
                />
              </Box>

              <Box style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    marginBottom: 5,
                    color: "#ffffffff",
                  }}
                >
                  Task description
                </Text>
                <Textarea size="sm" isReadOnly={false} isInvalid={false}>
                  <TextareaInput
                    placeholder="Enter the Task Description"
                    value={tempDescription}
                    onChangeText={setTempDescription}
                    style={{
                      backgroundColor: "#ffffff",
                    }}
                  />
                </Textarea>
              </Box>

              <Box style={{ marginBottom: 20 }}>
                <Text style={{ color: "#ffffffff" }}>Task timeline</Text>
                <HStack
                  style={{
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
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

                  <Text style={{ marginHorizontal: 10, fontSize: 18 }}>
                    {" "}
                    -{" "}
                  </Text>

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

            {/* Members */}
            <Box
              style={{ borderWidth: 0, flex: 1, marginLeft: 10, marginTop: 25 }}
            >
              <Text style={{ color: "#ffffffff" }}>Task Assignee</Text>

              <ScrollView
                style={{
                  marginTop: 5,
                  borderWidth: 0,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  padding: 10,
                  backgroundColor: "#fff",
                  height: 302,
                }}
                showsVerticalScrollIndicator={false}
              >
                {/* Members List */}
                <VStack space="sm">
                  {[
                    "Project Manager",
                    "UI/UX",
                    "Fullstack Developer",
                    "Front-End Developer",
                    "Back-End Developer",
                    "Mobile Developer",
                    "Game Developer",
                    "Quality Assurance",
                    "Intern",
                  ]
                    .filter((role) =>
                      profiles.some(
                        (profile) =>
                          profile.role?.toLowerCase() === role.toLowerCase()
                      )
                    )
                    .map((role, i) => {
                      const matchingProfiles = profiles.filter(
                        (profile) =>
                          profile.role?.toLowerCase() === role.toLowerCase()
                      );

                      return (
                        <View key={i}>
                          <HStack
                            style={{
                              alignItems: "center",
                              justifyContent: "space-between",
                              paddingVertical: 6,
                            }}
                          >
                            <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                              {role}
                            </Text>
                          </HStack>

                          <VStack>
                            {matchingProfiles.map((p) => {
                              const isChecked = tempAssigned.includes(p.uid);

                              const toggleCheck = () => {
                                setTempAssigned((prev) =>
                                  isChecked
                                    ? prev.filter((uid) => uid !== p.uid)
                                    : [...prev, p.uid]
                                );
                              };

                              return (
                                <HStack
                                  key={p.uid}
                                  style={{
                                    alignItems: "center",
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
                              );
                            })}
                          </VStack>
                        </View>
                      );
                    })}
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
          <Button onPress={updateTask} style={{ backgroundColor: "white" }}>
            <ButtonText style={{ color: "black" }}>
              {isSaving ? (
                <Spinner size="small" color="grey" />
              ) : (
                "Save changes"
              )}
            </ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
