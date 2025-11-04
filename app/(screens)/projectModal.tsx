import Gradient from "@/assets/icons/Gradient";
import Logo from "@/assets/icons/Logo";
import { Box } from "@/components/ui/box";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  CheckIcon,
  CloseIcon,
  Icon,
} from "@/components/ui/icon";
import { View } from "@/components/Themed";
import { useUser } from "@/context/profileContext";
import { useProject } from "@/context/projectContext";
import { Card } from "@/components/ui/card";
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
import { db, auth } from "@/firebase/firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { HStack } from "@/components/ui/hstack";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Center } from "@/components/ui/center";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
} from "@/components/ui/checkbox";
import { VStack } from "@/components/ui/vstack";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  AvatarBadge,
} from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import DateTimePicker from "@/components/DateTimePicker";
import TaskModal from "./taskModal";

export default function ProjectModal() {
  const { selectedProject, project, tasks, assignedUser, setSelectedTask } =
    useProject();
  const { profiles } = useUser();
  const currentProjectData = project.find((t) => t.id === selectedProject);
  const currentProjectTasks = tasks.filter(
    (t) => t.projectID === selectedProject
  );
  const currentProjectAssignedUsers = profiles.filter((profile) =>
    assignedUser.some(
      (a) => a.projectID === selectedProject && a.uid === profile.uid
    )
  );

  const pendingProject = project.filter(
    (t) => t.id === selectedProject && t.status === "Pending"
  );
  const router = useRouter();
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [tempAssigned, setTempAssigned] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);

  if (!currentProjectData) return;

  const projectDeadline =
    currentProjectData?.deadline && "toDate" in currentProjectData.deadline
      ? currentProjectData.deadline.toDate() // Firestore Timestamp → Date
      : null; // fallback to local state

  useEffect(() => {
    console.log("Current Project:", selectedProject);
    console.log(
      "Curernt Project Assigned Users: ",
      currentProjectAssignedUsers
    );
  }, []);

  useEffect(() => {
    // Initialize with currently assigned user IDs
    const assignedUids = assignedUser
      .filter((a) => a.projectID === selectedProject)
      .map((a) => a.uid);
    setTempAssigned(assignedUids);
  }, [assignedUser, selectedProject]);

  const handleSave = async () => {
    setLoading(true);

    try {
      const userRef = collection(db, "assignedUser");

      // Remove all current assignments for this project
      const q = query(userRef, where("projectID", "==", selectedProject));
      const snapshot = await getDocs(q);
      for (const docSnap of snapshot.docs) {
        await deleteDoc(docSnap.ref);
      }

      // Add new ones
      for (const uid of tempAssigned) {
        await addDoc(userRef, {
          projectID: selectedProject,
          uid,
        });
      }
    } catch (err) {
      console.error("Error saving assignments:", err);
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  const addTask = async () => {
    if (!titleInput.trim() || !auth.currentUser) return;
    try {
      await addDoc(collection(db, "tasks"), {
        title: titleInput,
        description: "",
        projectID: selectedProject,
        status: "active",
        start: null,
        end: null,
        starID: null,
      });
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setShowAddTaskModal(false);
    }

    setTitleInput("");
  };

  const handleDateChange = async (date: Date | null) => {
    if (!date) return setDeadline(null);
    if (!selectedProject) return;

    const midnightDate = new Date(date);
    midnightDate.setHours(0, 0, 0, 0);

    try {
      setSaving(true); // start spinner
      const projectRef = doc(db, "project", selectedProject);
      await updateDoc(projectRef, {
        deadline: Timestamp.fromDate(midnightDate),
      });
      setDeadline(midnightDate);
    } catch (error) {
      console.error("Error saving deadline:", error);
    } finally {
      setSaving(false); // stop spinner
    }
  };

  if (pendingProject.length != 0) {
    return (
      <View>
        <Box style={{ borderWidth: 0, width: 100 }}>
          <Pressable onPress={() => router.replace("/(screens)/project")}>
            <HStack style={{ alignItems: "center", alignContent: "center" }}>
              <Icon
                as={ArrowLeftIcon}
                className="text-typography-500 m-2 w-7 h-7 "
              />
              <Text style={{ fontSize: 23, fontWeight: "bold" }}>Back</Text>
            </HStack>
          </Pressable>
        </Box>

        <Box
          style={{
            borderWidth: 1,
            alignItems: "center",
          }}
        >
          <HStack>
            <View
              style={{
                height: 520,
                width: 730,
                margin: 5,
                borderWidth: 0,
                borderColor: "black",
                borderRadius: 15,
                padding: 10,
              }}
            >
              <Box style={{ borderWidth: 0 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  {currentProjectData.title}
                </Text>
              </Box>
              <Box style={{ borderWidth: 0, height: 100 }}>
                <ScrollView>
                  <Text>{currentProjectData.description}</Text>
                </ScrollView>
              </Box>
              <Box
                style={{ borderWidth: 0, alignItems: "flex-end", padding: 10 }}
              >
                <Button
                  style={{ width: 120 }}
                  onPress={() => setShowAddTaskModal(true)}
                >
                  <ButtonText>Add Task</ButtonText>
                </Button>
              </Box>
              <Box
                style={{
                  borderWidth: 1,
                  borderColor: "black",
                  borderRadius: 15,
                  height: 310,
                  padding: 10,
                }}
              >
                {currentProjectTasks.map((t) => (
                  <View key={t.id}>
                    <Center>
                      <Card
                        size="lg"
                        className="p-5 w-full m-1"
                        style={{ borderRadius: 20, borderWidth: 1 }}
                      >
                        <HStack style={{ alignItems: "center" }} space="md">
                          {/* 🟩 Section 1 */}
                          <Checkbox
                            hitSlop={{
                              top: 10,
                              bottom: 10,
                              left: 10,
                              right: 10,
                            }}
                            isChecked={!t.status}
                            onChange={() =>
                              updateDoc(doc(db, "tasks", t.id), {
                                status: !t.status,
                              })
                            }
                            value={t.id}
                            accessibilityLabel={t.title ? String(t.title) : ""}
                          >
                            <CheckboxIndicator>
                              <CheckboxIcon as={CheckIcon} />
                            </CheckboxIndicator>
                          </Checkbox>

                          <Divider orientation="vertical" />

                          {/* 🟨 Section 2 */}
                          <VStack style={{ flex: 1 }}>
                            <Text
                              style={{
                                padding: 4,
                                fontSize: 16,
                                flexWrap: "wrap",
                              }}
                            >
                              {t.title ? String(t.title) : ""}
                            </Text>
                          </VStack>
                          <Button
                            hitSlop={{
                              top: 10,
                              bottom: 10,
                              left: 10,
                              right: 10,
                            }}
                            size="xs"
                            className="h-6 px-1 right-2"
                            variant="outline"
                            style={{
                              backgroundColor: "transparent",
                              borderWidth: 0,
                            }}
                            onPress={() => {
                              setSelectedTask(t.id);
                              router.push("/(screens)/taskModal");
                            }}
                          >
                            <ButtonIcon as={CloseIcon} size={"lg"} />
                          </Button>
                        </HStack>
                      </Card>
                    </Center>
                  </View>
                ))}
              </Box>
            </View>

            <View
              style={{
                height: 520,
                width: 350,
                margin: 5,
                borderWidth: 0,
                borderColor: "black",
                borderRadius: 15,
                padding: 10,
              }}
            >
              <Box
                style={{
                  borderWidth: 1,
                  borderColor: "black",
                  borderRadius: 5,
                  height: 200,
                  marginBottom: 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {loading ? (
                  <Spinner size="large" color="grey" />
                ) : (
                  <ScrollView style={{ width: "100%" }}>
                    {(isEditing
                      ? profiles
                      : profiles.filter((p) =>
                          assignedUser.some(
                            (a) =>
                              a.projectID === selectedProject && a.uid === p.uid
                          )
                        )
                    ).map((t) => {
                      const isChecked = tempAssigned.includes(t.uid);

                      const toggleCheck = () => {
                        if (isChecked) {
                          setTempAssigned(
                            tempAssigned.filter((id) => id !== t.uid)
                          );
                        } else {
                          setTempAssigned([...tempAssigned, t.uid]);
                        }
                      };

                      return (
                        <View key={t.uid}>
                          <Box style={{ margin: 10 }}>
                            <HStack>
                              {isEditing && (
                                <Checkbox
                                  hitSlop={{
                                    top: 10,
                                    bottom: 10,
                                    left: 10,
                                    right: 10,
                                  }}
                                  isChecked={isChecked}
                                  onChange={toggleCheck}
                                  value={t.uid}
                                  accessibilityLabel={
                                    t.firstName + " " + t.lastName
                                  }
                                >
                                  <CheckboxIndicator>
                                    <CheckboxIcon as={CheckIcon} />
                                  </CheckboxIndicator>
                                </Checkbox>
                              )}

                              <Avatar size="xs" style={{ marginRight: 5 }}>
                                <AvatarFallbackText>
                                  {t.firstName + " " + t.lastName}
                                </AvatarFallbackText>
                                <AvatarBadge />
                              </Avatar>

                              <Text
                                style={{ marginRight: 5, fontWeight: "bold" }}
                              >
                                {t.firstName + " " + t.lastName}
                              </Text>

                              <Text style={{ color: "gray" }}>{t.role}</Text>
                            </HStack>
                          </Box>
                        </View>
                      );
                    })}
                  </ScrollView>
                )}
              </Box>

              <Button
                onPress={() => {
                  if (isEditing) handleSave();
                  else setIsEditing(true);
                }}
                isDisabled={loading}
              >
                <ButtonText>{isEditing ? "Save" : "Edit"}</ButtonText>
              </Button>

              <Box style={{ marginTop: 10 }}>
                <Text>Set Deadline</Text>
                <DateTimePicker
                  value={projectDeadline}
                  onChange={handleDateChange}
                  mode="date"
                  placeholder="Select a date and time"
                  loading={saving}
                />
              </Box>
            </View>
          </HStack>
        </Box>

        {/* Modals */}
        <Modal
          isOpen={showAddTaskModal}
          onClose={() => {
            setShowAddTaskModal(false);
          }}
          size="md"
        >
          <ModalBackdrop />
          <ModalContent>
            <ModalHeader>
              <Heading size="lg">Title</Heading>
              <ModalCloseButton>
                <Icon as={CloseIcon} />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <TextInput
                style={styles.inputs}
                placeholder="Input the Task Title"
                value={titleInput}
                onChangeText={setTitleInput}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                variant="outline"
                action="secondary"
                className="mr-3"
                onPress={() => {
                  setShowAddTaskModal(false);
                }}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button onPress={addTask}>
                <ButtonText>Save</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </View>
    );
  }

  return (
    <>
      <Box style={{ borderWidth: 0, width: 100 }}>
        <Pressable onPress={() => router.replace("/(screens)/project")}>
          <HStack style={{ alignItems: "center", alignContent: "center" }}>
            <Icon
              as={ArrowLeftIcon}
              className="text-typography-500 m-2 w-7 h-7 "
            />
            <Text style={{ fontSize: 23, fontWeight: "bold" }}>Back</Text>
          </HStack>
        </Pressable>
      </Box>

      <Box style={{ borderWidth: 0, alignItems: "center" }}>
        <HStack>
          <View
            style={{
              height: 150,
              width: 500,
              margin: 10,
              borderWidth: 1,
              borderColor: "black",
              borderRadius: 15,
            }}
          >
            <Box>
              <Text></Text>
            </Box>
            <Box>
              <Text></Text>
            </Box>
          </View>

          <View
            style={{
              height: 150,
              width: 500,
              margin: 10,
              borderWidth: 1,
              borderColor: "black",
              borderRadius: 15,
            }}
          >
            {" "}
          </View>
        </HStack>
      </Box>

      <Box
        style={{
          borderWidth: 0,
          paddingTop: 20,
          paddingLeft: 50,
          paddingRight: 50,
          marginBottom: 10,
        }}
      >
        <HStack
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Task</Text>
          <Button onPress={() => setShowAddTaskModal(true)}>
            <ButtonText>Add Task</ButtonText>
          </Button>
        </HStack>
        <Progress value={50} size="sm" orientation="horizontal">
          <ProgressFilledTrack />
        </Progress>
      </Box>

      <Box style={{ borderWidth: 0 }}>
        <HStack
          style={{
            justifyContent: "space-between",
            paddingLeft: 50,
            paddingRight: 50,
          }}
        >
          <Box
            style={{
              height: 270,
              width: 500,
              borderWidth: 1,
              borderColor: "black",
              borderRadius: 15,
            }}
          ></Box>
          <Box
            style={{
              height: 270,
              width: 500,
              borderWidth: 1,
              borderColor: "black",
              borderRadius: 15,
            }}
          ></Box>
        </HStack>
      </Box>

      {/* Modals */}
      <Modal
        isOpen={showAddTaskModal}
        onClose={() => {
          setShowAddTaskModal(false);
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg">Modal Title</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text>This is the modal body. You can add any content here.</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              className="mr-3"
              onPress={() => {
                setShowAddTaskModal(false);
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              onPress={() => {
                setShowAddTaskModal(false);
              }}
            >
              <ButtonText>Save</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  inputs: {
    borderWidth: 1,
    borderColor: "#0000005b",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: "#000000ff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#0000005b",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  pickerBox: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  cancelButton: {
    marginTop: 10,
  },
  modalContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  confirmButton: {
    marginTop: 10,
    alignSelf: "center",
  },
});
