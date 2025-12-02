import { Box } from "@/components/ui/box";
import { ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { CheckIcon, CloseIcon, Icon } from "@/components/ui/icon";
import { View } from "@/components/Themed";
import { useUser } from "@/context/profileContext";
import { useProject } from "@/context/projectContext";
import { Heading } from "@/components/ui/heading";
import { Divider } from "@/components/ui/divider";
import {
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Modal,
} from "@/components/ui/modal";
import { useEffect, useState } from "react";
import React from "react";
import { TextInput } from "react-native-gesture-handler";
import { auth, db } from "@/firebase/firebaseConfig";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { HStack } from "@/components/ui/hstack";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
} from "@/components/ui/checkbox";
import { VStack } from "@/components/ui/vstack";
import {
  Avatar,
  AvatarFallbackText,
  AvatarBadge,
} from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import DateTimePicker from "@/components/DateTimePicker";
import { Textarea, TextareaInput } from "@/components/ui/textarea";

type tasktModalType = {
  visible: boolean;
  onClose: () => void;
};

export default function TaskAddModal({ visible, onClose }: tasktModalType) {
  // UseStates
  const [tempTitle, setTempTitle] = useState<string>("");
  const [tempDescription, setTempDescription] = useState<string>("");
  const [tempStart, setTempStart] = useState<Date | null>(null);
  const [tempEnd, setTempEnd] = useState<Date | null>(null);
  const [tempDeadline, setTempDeadline] = useState<Date | null>(null);
  const [tempAssigned, setTempAssigned] = useState<string[]>([]);
  // const [tempStarRate, setTempStarRate] = useState<Number>(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Contexts
  const { selectedProject, project, assignedUser } = useProject();
  const { profiles, profile } = useUser();

  // On Load Innitializations
  const currentProjectData = project.find((t) => t.id === selectedProject);
  const projectDeadline =
    currentProjectData?.deadline && "toDate" in currentProjectData.deadline
      ? currentProjectData.deadline.toDate()
      : null;

  useEffect(() => {
    if (!visible) return;

    // Initiallize Fields
    setTempTitle("");
    setTempDescription("");
    setTempStart(null);
    setTempEnd(null);
    setTempAssigned([]);
  }, [visible]);

  // Functions
  const addTask = async () => {
    if (
      !tempTitle.trim() ||
      !tempDescription.trim() ||
      !tempStart ||
      !tempEnd ||
      !auth.currentUser
    )
      return;

    setIsSaving(true);
    try {
      const toLocalStart = new Date(tempStart);
      const toLocalEnd = new Date(tempEnd);
      toLocalStart.setHours(0, 0, 0, 0);
      toLocalEnd.setHours(0, 0, 0, 0);

      const docRef = await addDoc(collection(db, "tasks"), {
        title: tempTitle.trim(),
        description: tempDescription.trim(),
        projectID: selectedProject,
        status: "To-do",
        start: Timestamp.fromDate(toLocalStart),
        end: Timestamp.fromDate(toLocalEnd),
        starPoints: 0,
      });

      const taskID = docRef.id;

      await handleSaveAssignedUsers(taskID);
      await handleLog(taskID);
    } catch (error: any) {
      console.log("Error adding task:", error.message);
    } finally {
      setIsSaving(false);
      onClose();
    }
  };

  const handleSaveAssignedUsers = async (taskID: string) => {
    try {
      const userRef = collection(db, "assignedUser");
      for (const uid of tempAssigned) {
        await addDoc(userRef, {
          taskID,
          uid,
        });
      }
    } catch (err) {
      console.error("Error saving task assignments:", err);
    }
  };

  const handleLog = async (taskID: string) => {
    try {
      const logRef = collection(db, "taskLogs");
      await addDoc(logRef, {
        taskID,
        uid: profile?.uid,
        createdAt: serverTimestamp(),
        text: "created this task",
      });
    } catch (error) { }
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
            Add Task
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
                    color: "#ffffff",
                  }}
                  placeholder="Enter the Task Title"
                  placeholderTextColor="#999"
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
                    onChangeText={setTempDescription}
                    style={{ backgroundColor: "#ffffff" }}
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
          <Button onPress={addTask} style={{ backgroundColor: "white" }}>
            <ButtonText style={{ color: "black" }}>
              {isSaving ? <Spinner size="small" color="grey" /> : "Add task"}
            </ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
