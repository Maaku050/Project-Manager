import { Box } from "@/components/ui/box";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { ArrowLeftIcon, Icon, InfoIcon } from "@/components/ui/icon";
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
  ModalBody,
  ModalFooter,
  Modal,
} from "@/components/ui/modal";
import { useEffect, useState } from "react";
import React from "react";
import { db, auth } from "@/firebase/firebaseConfig";
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
import { HStack } from "@/components/ui/hstack";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";
import {
  Avatar,
  AvatarFallbackText,
  AvatarBadge,
} from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { EllipsisVertical, SquarePen } from "lucide-react-native";
import ProjectEditModal from "@/modals/projectEditModal";
import TaskAddModal from "@/modals/taskAddModal";
import { Star } from 'lucide-react-native';

export default function ProjectWindow() {
  const { selectedProject, project, tasks, assignedUser, setSelectedTask } =
    useProject();
  const { profiles } = useUser();
  const currentProjectData = project.find((t) => t.id === selectedProject);
  const currentProjectTasks = tasks.filter(
    (t) => t.projectID === selectedProject
  );

  const todoTasks = currentProjectTasks.filter((t) => t.status === "To-do");

  const ongoingTasks = currentProjectTasks.filter(
    (t) => t.status === "Ongoing"
  );

  const completedTasks = currentProjectTasks.filter(
    (t) => t.status === "Completed"
  );

  const totalTasks = currentProjectTasks.length;
  const completedCount = completedTasks.length;

  const progress =
    ((ongoingTasks.length * 0.5 + completedTasks.length * 1) / totalTasks) *
    100;

  const currentProjectAssignedUsers = profiles.filter((profile) =>
    assignedUser.some(
      (a) => a.projectID === selectedProject && a.uid === profile.uid
    )
  );

  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 1400; // computer UI condition
  const isMediumScreen = dimensions.width <= 1400 && dimensions.width > 860; // tablet UI condition

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
  const [showConfirmationModal, setConfirmationModal] = useState(false);
  const [showDeleteConfirmationModal, setDeleteConfirmationModal] =
    useState(false);
  const [todoOrOngoing, setTodoOrOngoing] = useState(true);
  const [taskID, setTaskID] = useState("");
  const [taskIdToDelete, setTaskIdToDelete] = useState("");

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
    console.log("Current project tasks: ", currentProjectTasks);
    console.log("To-do tasks: ", todoTasks);
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

  const truncateWords = (text: string | undefined, wordLimit: number) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + " ...see more"
      : text;
  };

  const handleStartAndCompleteTask = async (state: string) => {
    if (!taskID) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, "tasks", taskID), {
        status: state,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

    setConfirmationModal(false);
  };

  const handleDeleteTask = async () => {
    if (!taskIdToDelete) return;
    setLoading(true);

    try {
      await updateDoc(doc(db, "tasks", taskIdToDelete), {
        status: "Archive",
      });
    } catch (error) {
      console.log("Erron deleting task: ", error);
    } finally {
      setLoading(false);
    }

    setDeleteConfirmationModal(false);
  };

  if (!currentProjectData) {
    return <Text>Loading project data...</Text>;
  }

  // Ongoing Project
  return (
    <View style={{ flex: 1, padding: 12, backgroundColor: "#000000" }}>
      <ScrollView
        style={{
          flex: 1,
          padding: 15,
          backgroundColor: "#1F1F1F",
          borderRadius: 12,
        }}
      >
        <HStack
          style={{
            borderWidth: 0,
            justifyContent: "space-between",
            // backgroundColor: "black",
          }}
        >
          <Box>
            <Pressable onPress={() => router.replace("/(screens)/project")}>
              <HStack style={{ alignItems: "center" }}>
                <Icon
                  as={ArrowLeftIcon}
                  className="text-typography-500 w-7 h-7 "
                />
                <Text
                  style={{ fontSize: 23, fontWeight: "bold", color: "white" }}
                >
                  Back
                </Text>
              </HStack>
            </Pressable>
          </Box>

          <Box style={{ borderWidth: 0 }}>
            <HStack style={{ alignItems: "center" }}>
              <Pressable onPress={() => setShowEditProjectModal(true)}>
                <SquarePen color={"white"} />
              </Pressable>

              <Divider
                orientation="vertical"
                style={{ marginLeft: 20, marginRight: 20 }}
              />

              <Button
                action="positive"
                isDisabled={progress != 100}
                style={{
                  width: 150,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ButtonText>Complete</ButtonText>
              </Button>
            </HStack>
          </Box>
        </HStack>

        <View style={{ marginTop: 20, backgroundColor: "transparent" }}>
          <Box
            style={{
              // borderWidth: 1,
              // borderColor: "yellow",
              alignItems: "stretch",
              alignContent: "space-evenly",
              padding: 10,
              height: "auto",
            }}
          >
            <HStack
              style={{
                // borderWidth: 3,
                flex: 1,
                height: "auto",
                flexDirection: isLargeScreen
                  ? "row"
                  : isMediumScreen
                  ? "row"
                  : "column",
              }}
            >
              <View
                style={{
                  margin: 4,
                  // borderWidth: 1,
                  // borderColor: "red",
                  borderRadius: 12,
                  padding: 10,
                  flex: 1,
                  backgroundColor: "#5C5C5C",
                  height: "auto",
                }}
              >
                <Box
                  style={{
                    borderWidth: 0,
                    marginBottom: isLargeScreen ? 16 : 12,
                  }}
                >
                  <Text
                    style={{ fontSize: 24, fontWeight: "bold", color: "white" }}
                  >
                    {currentProjectData.title}
                  </Text>
                </Box>
                <Box style={{ borderWidth: 0 }}>
                  {descriptionPressed ? (
                    <Pressable onPress={() => setDescriptionPressed(false)}>
                      <Text
                        style={{ fontSize: 16, color: "white", marginTop: 4 }}
                      >
                        {truncateWords(currentProjectData.description, 1000)}
                      </Text>
                    </Pressable>
                  ) : (
                    <Pressable onPress={() => setDescriptionPressed(true)}>
                      <Text
                        style={{ fontSize: 16, color: "#CDCCCC", marginTop: 4 }}
                      >
                        {truncateWords(
                          currentProjectData.description,
                          isLargeScreen ? 50 : isMediumScreen ? 30 : 15
                        )}
                      </Text>
                    </Pressable>
                  )}
                </Box>
              </View>

              <View
                style={{
                  margin: 4,
                  // borderWidth: 5,
                  // borderColor: "#333333",
                  borderRadius: 10,
                  padding: 10,
                  flex: 1,
                  // alignContent: "center",
                  alignItems: "flex-start",
                  backgroundColor: "#5C5C5C",
                }}
              >
                <VStack
                  style={{
                    flex: 1,
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    paddingLeft: 8,
                    gap: isLargeScreen ? 16 : 12,
                  }}
                >
                  <HStack
                    style={{
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      // borderWidth: 4,
                    }}
                  >
                    <Box
                      style={{
                        borderWidth: 0,
                        marginRight: isLargeScreen ? 32 : 20,
                        alignItems: "flex-start",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          color: "white",
                        }}
                      >
                        Status
                      </Text>
                    </Box>
                    <Box style={{ borderWidth: 0 }}>
                      <Text style={{ fontSize: 15, color: "white" }}>
                        {currentProjectData.status}
                      </Text>
                    </Box>
                  </HStack>

                  <HStack
                    style={{
                      alignItems: "flex-start",
                      justifyContent: "space-between",

                      // borderWidth: 4,
                    }}
                  >
                    <Box
                      style={{
                        borderWidth: 0,
                        marginRight: isLargeScreen ? 32 : 20,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          color: "white",
                        }}
                      >
                        Deadline
                      </Text>
                    </Box>
                    <Box style={{ borderWidth: 0 }}>
                      <Text style={{ fontSize: 15, color: "white" }}>
                        {currentProjectData.deadline
                          ?.toDate()
                          .toLocaleDateString()}
                      </Text>
                    </Box>
                  </HStack>

                  <HStack
                    style={{
                      alignItems: "flex-start",
                      justifyContent: "space-between",

                      // borderWidth: 4,
                    }}
                  >
                    <Box
                      style={{
                        borderWidth: 0,
                        marginRight: isLargeScreen ? 32 : 20,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          color: "white",
                        }}
                      >
                        Assigned Member
                      </Text>
                    </Box>
                    <Box style={{ borderWidth: 0, marginLeft: "auto" }}>
                      <HStack>
                        {profiles
                          .filter((p) =>
                            assignedUser.some(
                              (a) =>
                                a.projectID === selectedProject &&
                                a.uid === p.uid
                            )
                          )
                          .map((t) => {
                            return (
                              <Avatar size="sm" key={t.id} style={{marginLeft: -8, borderWidth: 1, borderColor: "#383838"}}>
                                <AvatarFallbackText>
                                  {t.firstName}
                                </AvatarFallbackText>

                                {/* <AvatarBadge /> */}
                              </Avatar>
                            );
                          })}
                      </HStack>
                    </Box>
                  </HStack>
                </VStack>
              </View>
            </HStack>
          </Box>
        </View>

        <Box
          style={{
            borderWidth: 0,
            paddingTop: 20,
            paddingLeft: 50,
            paddingRight: 50,
            marginBottom: 10,
            // backgroundColor: "black",
            // borderColor: "black",
          }}
        >
          <HStack
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#ffff" }}>
              Task
            </Text>
            <Button onPress={() => setShowAddTaskModal(true)}>
              <ButtonText>Add Task</ButtonText>
            </Button>
          </HStack>
          <Text style={{ color: "white" }}>{progress.toFixed(0)}%</Text>
          <Progress value={progress} size="sm" orientation="horizontal">
            <ProgressFilledTrack />
          </Progress>
        </Box>


{/* ----------------------------start of the three doom------------------------------- */}
        <Box style={{ 
          borderWidth: 0, 
          paddingBottom:0,
          justifyContent: "flex-start",
          alignItems: "stretch", 
          flexDirection: "column",
          }}>
          <HStack
            style={{
              justifyContent: "flex-start",
              alignItems: "stretch",
              paddingLeft: 40,
              paddingRight: 40,
              flexDirection: isLargeScreen ? "row" : isMediumScreen ? "column" : "column",
              flexBasis: "100%",
              borderColor: "#be2424ff",
              borderWidth: 0,
              rowGap: 12,
              columnGap: 12,
              // minHeight: "100%",
              // flex: 1,
            }}
          >
            {/* To-do Tasks */}
            <VStack style={{ 
              flexBasis: "33.33%",
              minHeight: "auto",

             }}>
              <Box style={styles.boxLabel}>
                <Text>To-Do</Text>
              </Box>
              <Box
                style={{
                  borderWidth: 0,
                  borderColor: "black",
                  borderBottomLeftRadius: 15,
                  borderBottomRightRadius: 15,
                  backgroundColor: "#ffffffff",
                  flex: 1,
                }}
              >
                <View
                  style={{
                    borderRadius: 15,
                    paddingLeft: 12,
                    paddingRight: 12,
                    paddingTop: 12,
                    backgroundColor: "#ffffffff",
                    flex: 1, 
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "stretch",
                  }}
                >
                  {todoTasks.map((t) => (
                    <View
                      key={t.id}
                      style={{
                      backgroundColor: "transparent",
                      margin: 0,
                      padding: 4,
                      flexBasis: "auto",
                      minHeight: "auto",
                      }}
                    >
                      
                        <Card
                          size="lg"
                          className="p-5 w-full m-1"
                          style={{
                            borderRadius: 12,
                            borderWidth: 1,
                            backgroundColor: "#CDCCCC",
                            padding: 12,
                            borderLeftWidth: 10,
                            borderLeftColor:
                              t.end && t.end.toDate() < new Date()
                                ? "red"
                                : "green",
                            justifyContent: "space-between",
                            flex: 1,
                          }}
                        >

                          <HStack
                            style={{
                              alignItems: "center",
                              flex: 1,
                              borderWidth: 0,

                            }}
                            space="md"
                          >
                            <Pressable
                              onPress={() => {
                                setSelectedTask(t.id);
                                router.push("/(screens)/taskWindow");
                              }}
                              onHoverIn={() => setIsHover(t.id)}
                              onHoverOut={() => setIsHover(null)}
                              style={{flex: 1}}
                            >
                                <Text
                                  style={{
                                    fontSize: 17,
                                    flexWrap: "wrap",
                                    fontWeight:
                                      isHover === t.id ? "bold" : "normal",
                                    color: "black",
                                    flex: 1,
                                  }}
                                >
                                  {t.title ? String(t.title) : ""}
                                </Text>
                            </Pressable>


                                    {/* --------------------------star-------------------------- */}
                            <Pressable style={{alignItems: "flex-start", alignSelf: "baseline" }}>
                              <Star color={"gold"}  fill={"gold"} style={{height: 32, width: 32}} />
                              <Text style={{position: "absolute", top: 3.5, right: 12}}>5</Text> 
                                    {/* --------------------------star-------------------------- */}

                            </Pressable>

                      </HStack>


                      
                            <HStack style={{
                              marginTop: 12,
                              justifyContent: "space-between",
                              alignItems: "stretch"
                            }}>

                              <HStack style={{
                                gap: 12,
                              }}>

                                <Text style={{ fontSize: 13 }}>
                                  {t.end?.toDate().toLocaleDateString()}
                                </Text>

                                <Box style={{ borderWidth: 0, marginLeft: "auto" }}>
                                  <HStack style={{borderWidth: 0}}>
                                    {profiles
                                      .filter((p) =>
                                        assignedUser.some(
                                          (a) =>
                                            a.projectID === selectedProject &&
                                            a.uid === p.uid
                                        )
                                      )
                                      .map((t) => {
                                        return (
                                          <Avatar 
                                          size={isLargeScreen ? "sm" : isMediumScreen ? "sm" : "xs"}  
                                          key={t.id} 
                                          style={{
                                            marginLeft: isLargeScreen ? -8 : isMediumScreen ? 8 : 2,
                                            borderWidth: 1, 
                                            borderColor: "#1f1f1f"
                                            }} >
                                              
                                            <AvatarFallbackText>
                                              {t.firstName}
                                            </AvatarFallbackText>

                                            {/* <AvatarBadge /> */}
                                          </Avatar>
                                        );
                                      })}
                                  </HStack>
                                </Box>

                              </HStack>

                              

                              
                            <HStack style={{gap: 4}}>
                                <Button
                                  action="positive"
                                  size="xs"
                                  onPress={() => {
                                    setTaskID(t.id);
                                    setTodoOrOngoing(true);
                                    setConfirmationModal(true);
                                  }}
                                >
                                  <ButtonText>Start</ButtonText>
                                </Button>

                                <Button
                                  action="negative"
                                  size="xs"
                                  onPress={() => {
                                    setTaskIdToDelete(t.id);
                                    setDeleteConfirmationModal(true);
                                  }}
                                >
                                  <ButtonText>Delete</ButtonText>
                                </Button>
                            </HStack>

                            </HStack>


                    </Card>
                </View>
              ))}
            </View>
          </Box>
          </VStack>

            {/* Ongoing Tasks */}
            <VStack style={{ 
               flexBasis: "33.33%",
               minHeight: "auto",
             }}>
              <Box style={styles.boxLabel}>
                <Text>On-Going</Text>
              </Box>
              <Box
                style={{
                  borderWidth: 0,
                  borderColor: "black",
                  borderBottomLeftRadius: 15,
                  borderBottomRightRadius: 15,
                  backgroundColor: "#ffffffff",
                  flex: 1,
                }}
              >
                <View
                  style={{
                    borderRadius: 15,
                    paddingLeft: 12,
                    paddingRight: 12,
                    paddingTop: 12,
                    backgroundColor: "#ffffffff",
                  }}
                >
                  {ongoingTasks.map((t) => (
                    <View
                      key={t.id}
                      style={{
                        backgroundColor: "transparent",
                        margin: 0,
                        padding: 4,
                      }}
                    >
                      <Center>
                        <Card
                          size="lg"
                          className="p-5 w-full m-1"
                          style={{
                            borderRadius: 12,
                            borderWidth: 1,
                            backgroundColor: "#CDCCCC",
                            padding: 15,
                            borderLeftWidth: 10,
                            borderLeftColor:
                              t.end && t.end.toDate() < new Date()
                                ? "red"
                                : "green",
                          }}
                        >
                          <HStack
                            style={{
                              alignItems: "center",
                            }}
                            space="md"
                          >
                            <Button
                              action="positive"
                              size="xs"
                              onPress={() => {
                                setTaskID(t.id);
                                setTodoOrOngoing(false);
                                setConfirmationModal(true);
                              }}
                            >
                              <ButtonText>Done</ButtonText>
                            </Button>

                            <Button
                              action="negative"
                              size="xs"
                              onPress={() => {
                                setTaskIdToDelete(t.id);
                                setDeleteConfirmationModal(true);
                              }}
                            >
                              <ButtonText>Delete</ButtonText>
                            </Button>

                            <Divider
                              orientation="vertical"
                              style={{ backgroundColor: "black" }}
                            />
                            <Pressable
                              onPress={() => {
                                setSelectedTask(t.id);
                                router.push("/(screens)/taskWindow");
                              }}
                              onHoverIn={() => setIsHover(t.id)}
                              onHoverOut={() => setIsHover(null)}
                            >
                              <VStack style={{ flex: 1 }}>
                                <Text
                                  style={{
                                    fontSize: 17,
                                    flexWrap: "wrap",
                                    fontWeight:
                                      isHover === t.id ? "bold" : "normal",
                                    color: "black",
                                  }}
                                >
                                  {t.title ? String(t.title) : ""}
                                </Text>
                                <Text style={{ fontSize: 13 }}>
                                  {t.end?.toDate().toLocaleDateString()}
                                </Text>
                              </VStack>
                            </Pressable>
                          </HStack>
                        </Card>
                      </Center>
                    </View>
                  ))}
                </View>
              </Box>
            </VStack>

            {/* Completed Tasks */}
            <VStack style={{ 
              flexBasis: "33.33%",
              minHeight: "auto",
             }}>
              <Box style={styles.boxLabel}>
                <Text>Completed</Text>
              </Box>
              <Box
                style={{
                  borderWidth: 0,
                  borderColor: "black",
                  borderBottomLeftRadius: 15,
                  borderBottomRightRadius: 15,
                  backgroundColor: "#ffffffff",
                  flex: 1,
                }}
              >
                <ScrollView
                  style={{
                    borderRadius: 15,
                    paddingLeft: 12,
                    paddingRight: 12,
                    paddingTop: 12,
                    backgroundColor: "#ffffffff",
                  }}
                  showsVerticalScrollIndicator={false}
                >
                  {completedTasks.map((t) => (
                    <View
                      key={t.id}
                      style={{
                        backgroundColor: "transparent",
                        margin: 0,
                        padding: 4,
                      }}
                    >
                      <Center>
                        <Card
                          size="lg"
                          className="p-5 w-full m-1"
                          style={{
                            borderRadius: 12,
                            borderWidth: 1,
                            backgroundColor: "#CDCCCC",
                            padding: 15,
                            borderLeftWidth: 10,
                            borderLeftColor:
                              t.end && t.end.toDate() < new Date()
                                ? "red"
                                : "green",
                          }}
                        >
                          <HStack
                            style={{
                              alignItems: "center",
                            }}
                            space="md"
                          >
                            <Button
                              action="positive"
                              size="xs"
                              onPress={() =>
                                updateDoc(doc(db, "tasks", t.id), {
                                  status: "To-do",
                                })
                              }
                            >
                              <ButtonText>Revert</ButtonText>
                            </Button>

                            <Button
                              action="negative"
                              size="xs"
                              onPress={() => {
                                setTaskIdToDelete(t.id);
                                setDeleteConfirmationModal(true);
                              }}
                            >
                              <ButtonText>Delete</ButtonText>
                            </Button>

                            <Divider
                              orientation="vertical"
                              style={{ backgroundColor: "black" }}
                            />
                            <Pressable
                              onPress={() => {
                                setSelectedTask(t.id);
                                router.push("/(screens)/taskWindow");
                              }}
                              onHoverIn={() => setIsHover(t.id)}
                              onHoverOut={() => setIsHover(null)}
                            >
                              <VStack style={{ flex: 1 }}>
                                <Text
                                  style={{
                                    fontSize: 17,
                                    flexWrap: "wrap",
                                    fontWeight:
                                      isHover === t.id ? "bold" : "normal",
                                    color: "black",
                                  }}
                                >
                                  {t.title ? String(t.title) : ""}
                                </Text>
                                <Text style={{ fontSize: 13 }}>
                                  {t.end?.toDate().toLocaleDateString()}
                                </Text>
                              </VStack>
                            </Pressable>
                          </HStack>
                        </Card>
                      </Center>
                    </View>
                  ))}
                </ScrollView>
              </Box>
            </VStack>
          </HStack>
        </Box>
{/* ----------------------------end of the three doom------------------------------- */}


      </ScrollView>

      <Modal
        isOpen={showConfirmationModal}
        onClose={() => {
          setConfirmationModal(false);
        }}
      >
        <ModalBackdrop />
        <ModalContent className="max-w-[305px] items-center">
          <ModalHeader>
            <Box className="w-[56px] h-[56px] rounded-full bg-background-error items-center justify-center">
              <Icon as={InfoIcon} className="stroke-error-600" size="xl" />
            </Box>
          </ModalHeader>
          <ModalBody className="mt-0 mb-4">
            <Heading size="md" className="text-typography-950 mb-2 text-center">
              Confirmation
            </Heading>
            {todoOrOngoing ? (
              <Text size="sm" className="text-typography-500 text-center">
                Are you sure you want to start this task?
              </Text>
            ) : (
              <Text size="sm" className="text-typography-500 text-center">
                Are you sure this task is complete?
              </Text>
            )}
          </ModalBody>
          <ModalFooter className="w-full">
            <Button
              variant="outline"
              action="secondary"
              size="sm"
              onPress={() => {
                setConfirmationModal(false);
              }}
              className="flex-grow"
            >
              <ButtonText>No</ButtonText>
            </Button>
            <Button
              onPress={() => {
                handleStartAndCompleteTask(
                  todoOrOngoing ? "Ongoing" : "Completed"
                );
              }}
              size="sm"
              className="flex-grow"
              action="positive"
            >
              <ButtonText>
                {loading ? <Spinner size="small" color="grey" /> : "Yes"}
              </ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={showDeleteConfirmationModal}
        onClose={() => {
          setDeleteConfirmationModal(false);
        }}
      >
        <ModalBackdrop />
        <ModalContent className="max-w-[305px] items-center">
          <ModalHeader>
            <Box className="w-[56px] h-[56px] rounded-full bg-background-error items-center justify-center">
              <Icon as={InfoIcon} className="stroke-error-600" size="xl" />
            </Box>
          </ModalHeader>
          <ModalBody className="mt-0 mb-4">
            <Heading size="md" className="text-typography-950 mb-2 text-center">
              Confirmation
            </Heading>
            <Text size="sm" className="text-typography-500 text-center">
              Are you sure you want to delete this task?
            </Text>
          </ModalBody>
          <ModalFooter className="w-full">
            <Button
              variant="outline"
              action="secondary"
              size="sm"
              onPress={() => {
                setDeleteConfirmationModal(false);
              }}
              className="flex-grow"
            >
              <ButtonText>No</ButtonText>
            </Button>
            <Button
              onPress={handleDeleteTask}
              size="sm"
              className="flex-grow"
              action="positive"
            >
              <ButtonText>
                {loading ? <Spinner size="small" color="grey" /> : "Yes"}
              </ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* <Modal
        isOpen={showTodoConfirmationModal}
        onClose={() => {
          setTodoConfirmationModal(false);
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg">Confirmation</Heading>
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
                setTodoConfirmationModal(false);
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              onPress={() => {
                setTodoConfirmationModal(false);
              }}
            >
              <ButtonText>Save</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}

      <ProjectEditModal
        visible={showEditProjectModal}
        onClose={() => setShowEditProjectModal(false)}
      />

      <TaskAddModal
        visible={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
      />
    </View>
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
  boxLabel: {
    borderWidth: 0,
    alignItems: "center",
    padding: 10,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    backgroundColor: "#dbdbdbff",
    // flex: 1,
  },
});
