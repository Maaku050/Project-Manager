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
import { ChevronDownIcon, SquarePen } from "lucide-react-native";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
} from "@/components/ui/select";

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
  const [isHover, setIsHover] = useState<string | null>(null);
  const [descriptionPressed, setDescriptionPressed] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);

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

  const truncateWords = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + " ..."
      : text;
  };

  // Pending Project
  if (pendingProject.length != 0) {
    return (
      <View style={{ flex: 1, padding: 15 }}>
        <HStack
          style={{
            borderWidth: 0,
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Pressable onPress={() => router.replace("/(screens)/project")}>
              <HStack style={{ alignItems: "center" }}>
                <Icon
                  as={ArrowLeftIcon}
                  className="text-typography-500 w-7 h-7 "
                />
                <Text style={{ fontSize: 23, fontWeight: "bold" }}>Back</Text>
              </HStack>
            </Pressable>
          </Box>

          <Box style={{ borderWidth: 0 }}>
            <HStack style={{ alignItems: "center" }}>
              <Pressable onPress={() => setShowEditProjectModal(true)}>
                <SquarePen />
              </Pressable>

              <Divider
                orientation="vertical"
                style={{ marginLeft: 20, marginRight: 20 }}
              />

              <Button action="positive" style={{ width: 150 }}>
                <ButtonText>Deploy</ButtonText>
              </Button>
            </HStack>
          </Box>
        </HStack>

        <Box
          style={{
            borderWidth: 0,
            borderColor: "blue",
            alignItems: "center",
            padding: 10,
          }}
        >
          <HStack style={{ flex: 1 }}>
            <View
              style={{
                margin: 5,
                borderWidth: 1,
                borderColor: "gray",
                borderRadius: 10,
                padding: 10,
                flex: 1,
              }}
            >
              <Box style={{ borderWidth: 0 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  {currentProjectData.title}
                </Text>
              </Box>
              <Box style={{ borderWidth: 0 }}>
                <ScrollView>
                  {descriptionPressed ? (
                    <Pressable onPress={() => setDescriptionPressed(false)}>
                      <Text style={{ fontSize: 15 }}>
                        {truncateWords(currentProjectData.description, 1000)}
                      </Text>
                    </Pressable>
                  ) : (
                    <Pressable onPress={() => setDescriptionPressed(true)}>
                      <Text style={{ fontSize: 15 }}>
                        {truncateWords(currentProjectData.description, 50)}
                      </Text>
                    </Pressable>
                  )}
                </ScrollView>
              </Box>
            </View>

            <View
              style={{
                margin: 5,
                borderWidth: 1,
                borderColor: "gray",
                borderRadius: 10,
                padding: 10,
                flex: 1,
              }}
            >
              <VStack>
                <HStack
                  style={{
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingRight: 260,
                    margin: 10,
                  }}
                >
                  <Box style={{ borderWidth: 0 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                      Status
                    </Text>
                  </Box>
                  <Box style={{ borderWidth: 0 }}>
                    <Text style={{ fontSize: 15, color: "gray" }}>
                      {currentProjectData.status}
                    </Text>
                  </Box>
                </HStack>

                <HStack
                  style={{
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingRight: 240,
                    margin: 10,
                  }}
                >
                  <Box style={{ borderWidth: 0 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                      Deadline
                    </Text>
                  </Box>
                  <Box style={{ borderWidth: 0 }}>
                    <Text style={{ fontSize: 15, color: "gray" }}>
                      {currentProjectData.deadline
                        ?.toDate()
                        .toLocaleDateString()}
                    </Text>
                  </Box>
                </HStack>

                <HStack
                  style={{
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingRight: 250,
                    margin: 10,
                  }}
                >
                  <Box style={{ borderWidth: 0 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                      Assigned Member
                    </Text>
                  </Box>
                  <Box style={{ borderWidth: 0, marginLeft: 15 }}>
                    <HStack>
                      {profiles
                        .filter((p) =>
                          assignedUser.some(
                            (a) =>
                              a.projectID === selectedProject && a.uid === p.uid
                          )
                        )
                        .map((t) => {
                          return (
                            <Avatar size="sm" key={t.id}>
                              <AvatarFallbackText>
                                {t.firstName}
                              </AvatarFallbackText>

                              <AvatarBadge />
                            </Avatar>
                          );
                        })}
                    </HStack>
                  </Box>
                </HStack>
              </VStack>
            </View>

            {/* Assigning Window */}
            {/* <View
              style={{
                width: 350,
                margin: 5,
                borderWidth: 1,
                borderColor: "red",
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
            </View> */}
          </HStack>
        </Box>

        <Box
          style={{
            borderWidth: 0,
            borderColor: "red",
            paddingRight: 30,
            paddingLeft: 30,
          }}
        >
          <HStack
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>Task</Text>

            <Button
              style={{ width: 120 }}
              onPress={() => setShowAddTaskModal(true)}
            >
              <ButtonText>Add Task</ButtonText>
            </Button>
          </HStack>
          <Progress
            value={100}
            size="sm"
            orientation="horizontal"
            style={{ marginTop: 10, marginBottom: 10 }}
          >
            <ProgressFilledTrack />
          </Progress>
        </Box>

        <Box
          style={{
            borderWidth: 0,
            borderColor: "red",
            flex: 1,
          }}
        >
          {/* Task Window */}
          <ScrollView
            style={{
              borderWidth: 0,
              borderColor: "black",
              borderRadius: 15,
              paddingLeft: 20,
              paddingRight: 20,
            }}
          >
            {currentProjectTasks.map((t) => (
              <View key={t.id}>
                <Pressable
                  onPress={() => {
                    setSelectedTask(t.id);
                    router.push("/(screens)/taskModal");
                  }}
                  onHoverIn={() => setIsHover(t.id)}
                  onHoverOut={() => setIsHover(null)}
                >
                  <Center>
                    <Card
                      size="lg"
                      className="p-5 w-full m-1"
                      style={{
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: isHover === t.id ? "black" : "",
                      }}
                    >
                      <HStack style={{ alignItems: "center" }} space="md">
                        {/* <Checkbox
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

                      <Divider orientation="vertical" /> */}

                        <VStack style={{ flex: 1 }}>
                          <Text
                            style={{
                              padding: 4,
                              fontSize: 16,
                              flexWrap: "wrap",
                              fontWeight: "bold",
                            }}
                          >
                            {t.title ? String(t.title) : ""}
                          </Text>
                        </VStack>
                      </HStack>
                    </Card>
                  </Center>
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </Box>

        {/* Add Task Modal */}
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
              <Heading size="lg">Add Task</Heading>
              <ModalCloseButton>
                <Icon as={CloseIcon} />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <Text>Task Name</Text>
              <TextInput
                style={styles.inputs}
                placeholder="Enter Task Name"
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

        {/* Edit Project Modal */}
        <Modal
          isOpen={showEditProjectModal}
          onClose={() => {
            setShowEditProjectModal(false);
          }}
          size="lg"
        >
          <ModalBackdrop />
          <ModalContent>
            <ModalHeader>
              <Heading size="lg">Edit Project</Heading>
              <ModalCloseButton>
                <Icon as={CloseIcon} />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <Box style={{ margin: 5 }}>
                <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                  Project Name
                </Text>
                <TextInput
                  style={{
                    borderBottomWidth: 1,
                    borderColor: "#000", // or your theme color
                    paddingVertical: 8,
                    fontSize: 16,
                  }}
                  placeholder="Enter your Project Title"
                  placeholderTextColor="#999"
                />
              </Box>

              <Box style={{ margin: 5 }}>
                <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                  Project Description
                </Text>
                <Textarea
                  size="md"
                  isReadOnly={false}
                  isInvalid={false}
                  isDisabled={false}
                >
                  <TextareaInput placeholder="Enter your Project Description" />
                </Textarea>
              </Box>

              <Box style={{ margin: 5 }}>
                <Text style={{ fontWeight: "bold" }}>Project Deadline</Text>
                <DateTimePicker
                  value={projectDeadline}
                  onChange={handleDateChange}
                  mode="date"
                  placeholder="Select a date and time"
                  loading={saving}
                />
              </Box>

              <Box style={{ margin: 5 }}>
                <Text style={{ fontWeight: "bold" }}>Project Members</Text>
                <Select>
                  <SelectTrigger variant="outline" size="md">
                    <SelectInput placeholder="@ Select Members" />
                    <SelectIcon className="mr-3" as={ChevronDownIcon} />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <SelectItem label="UX Research" value="ux" />
                      <SelectItem label="Web Development" value="web" />
                      <SelectItem
                        label="Cross Platform Development Process"
                        value="Cross Platform Development Process"
                      />
                      <SelectItem
                        label="UI Designing"
                        value="ui"
                        isDisabled={true}
                      />
                      <SelectItem label="Backend Development" value="backend" />
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="outline"
                action="secondary"
                className="mr-3"
                onPress={() => {
                  setShowEditProjectModal(false);
                }}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                onPress={() => {
                  setShowEditProjectModal(false);
                }}
              >
                <ButtonText>Save</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </View>
    );
  }

  // Ongoing Project
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
