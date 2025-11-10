import Gradient from "@/assets/icons/Gradient";
import Logo from "@/assets/icons/Logo";
import { Box } from "@/components/ui/box";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
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
  TrashIcon,
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
import TaskModal from "./taskWindow";
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
import ProjectEditModal from "@/modals/projectEditModal";
import TaskAddModal from "@/modals/taskAddModal";

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
  const [showTodoConfirmationModal, setTodoConfirmationModal] = useState(false);
  const [showOngoingConfirmationModal, setOngoingConfirmationModal] =
    useState(false);

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

  if (!currentProjectData) {
    return <Text>Loading project data...</Text>;
  }

  // Pending Project
  // if (pendingProject.length != 0) {
  //   return (
  //     <View style={{ flex: 1, padding: 15, backgroundColor: "black" }}>
  //       <HStack
  //         style={{
  //           borderWidth: 0,
  //           justifyContent: "space-between",
  //           // backgroundColor: "black",
  //         }}
  //       >
  //         <Box>
  //           <Pressable onPress={() => router.replace("/(screens)/project")}>
  //             <HStack style={{ alignItems: "center" }}>
  //               <Icon
  //                 as={ArrowLeftIcon}
  //                 className="text-typography-500 w-7 h-7 "
  //               />
  //               <Text
  //                 style={{ fontSize: 23, fontWeight: "bold", color: "white" }}
  //               >
  //                 Back
  //               </Text>
  //             </HStack>
  //           </Pressable>
  //         </Box>

  //         <Box style={{ borderWidth: 0 }}>
  //           <HStack style={{ alignItems: "center" }}>
  //             <Pressable onPress={() => setShowEditProjectModal(true)}>
  //               <SquarePen color={"gray"} />
  //             </Pressable>

  //             <Divider
  //               orientation="vertical"
  //               style={{ marginLeft: 20, marginRight: 20 }}
  //             />

  //             <Button
  //               action="positive"
  //               style={{
  //                 width: 150,
  //                 alignItems: "center",
  //                 justifyContent: "center",
  //               }}
  //             >
  //               <ButtonText>Deploy</ButtonText>
  //             </Button>
  //           </HStack>
  //         </Box>
  //       </HStack>

  //       {/* top section titel wit\d othes */}
  //       <View style={{ marginTop: 20, backgroundColor: "#1F1F1F" }}>
  //         <Box
  //           style={{
  //             // borderWidth: 1,
  //             // borderColor: "yellow",
  //             alignItems: "stretch",
  //             alignContent: "space-evenly",
  //             padding: 10,
  //           }}
  //         >
  //           <HStack
  //             style={{
  //               flex: 1,
  //               flexDirection: isLargeScreen
  //                 ? "row"
  //                 : isMediumScreen
  //                 ? "row"
  //                 : "column",
  //             }}
  //           >
  //             <View
  //               style={{
  //                 margin: 4,
  //                 // borderWidth: 1,
  //                 // borderColor: "red",
  //                 borderRadius: 10,
  //                 padding: 10,
  //                 flex: 1,
  //                 backgroundColor: "#5C5C5C",
  //               }}
  //             >
  //               <Box
  //                 style={{
  //                   borderWidth: 0,
  //                   marginBottom: isLargeScreen ? 16 : 12,
  //                 }}
  //               >
  //                 <Text
  //                   style={{ fontSize: 24, fontWeight: "bold", color: "white" }}
  //                 >
  //                   {currentProjectData.title}
  //                 </Text>
  //               </Box>
  //               <Box style={{ borderWidth: 0 }}>
  //                 {descriptionPressed ? (
  //                   <Pressable onPress={() => setDescriptionPressed(false)}>
  //                     <Text style={{ fontSize: 16, color: "white" }}>
  //                       {truncateWords(currentProjectData.description, 1000)}
  //                     </Text>
  //                   </Pressable>
  //                 ) : (
  //                   <Pressable onPress={() => setDescriptionPressed(true)}>
  //                     <Text style={{ fontSize: 16, color: "#CDCCCC" }}>
  //                       {truncateWords(
  //                         currentProjectData.description,
  //                         isLargeScreen ? 50 : isMediumScreen ? 30 : 15
  //                       )}
  //                     </Text>
  //                   </Pressable>
  //                 )}
  //               </Box>
  //             </View>

  //             <View
  //               style={{
  //                 margin: 4,
  //                 // borderWidth: 5,
  //                 // borderColor: "#333333",
  //                 borderRadius: 10,
  //                 padding: 10,
  //                 flex: 1,
  //                 // alignContent: "flex-start",
  //                 alignItems: "flex-start",
  //                 backgroundColor: "#5C5C5C",
  //               }}
  //             >
  //               <VStack
  //                 style={{
  //                   flex: 1,
  //                   alignItems: "flex-start",
  //                   justifyContent: "flex-start",
  //                   paddingLeft: 8,
  //                   gap: isLargeScreen ? 16 : 12,
  //                 }}
  //               >
  //                 <HStack
  //                   style={{
  //                     alignItems: "flex-start",
  //                     justifyContent: "space-between",

  //                     // borderWidth: 4,
  //                   }}
  //                 >
  //                   <Box
  //                     style={{
  //                       borderWidth: 0,
  //                       marginRight: isLargeScreen ? 32 : 20,
  //                       alignItems: "flex-start",
  //                     }}
  //                   >
  //                     <Text
  //                       style={{
  //                         fontSize: 18,
  //                         fontWeight: "bold",
  //                         color: "white",
  //                       }}
  //                     >
  //                       Status
  //                     </Text>
  //                   </Box>
  //                   <Box style={{ borderWidth: 0 }}>
  //                     <Text style={{ fontSize: 15, color: "white" }}>
  //                       {currentProjectData.status}
  //                     </Text>
  //                   </Box>
  //                 </HStack>

  //                 <HStack
  //                   style={{
  //                     alignItems: "flex-start",
  //                     justifyContent: "space-between",

  //                     // borderWidth: 4,
  //                   }}
  //                 >
  //                   <Box
  //                     style={{
  //                       borderWidth: 0,
  //                       marginRight: isLargeScreen ? 32 : 20,
  //                     }}
  //                   >
  //                     <Text
  //                       style={{
  //                         fontSize: 18,
  //                         fontWeight: "bold",
  //                         color: "white",
  //                       }}
  //                     >
  //                       Deadline
  //                     </Text>
  //                   </Box>
  //                   <Box style={{ borderWidth: 0 }}>
  //                     <Text style={{ fontSize: 15, color: "white" }}>
  //                       {currentProjectData.deadline
  //                         ?.toDate()
  //                         .toLocaleDateString()}
  //                     </Text>
  //                   </Box>
  //                 </HStack>

  //                 <HStack
  //                   style={{
  //                     alignItems: "flex-start",
  //                     justifyContent: "space-between",

  //                     // borderWidth: 4,
  //                   }}
  //                 >
  //                   <Box
  //                     style={{
  //                       borderWidth: 0,
  //                       marginRight: isLargeScreen ? 32 : 20,
  //                     }}
  //                   >
  //                     <Text
  //                       style={{
  //                         fontSize: 18,
  //                         fontWeight: "bold",
  //                         color: "white",
  //                       }}
  //                     >
  //                       Assigned Member
  //                     </Text>
  //                   </Box>
  //                   <Box style={{ borderWidth: 0, marginLeft: "auto" }}>
  //                     <HStack style={{ gap: 8 }}>
  //                       {profiles
  //                         .filter((p) =>
  //                           assignedUser.some(
  //                             (a) =>
  //                               a.projectID === selectedProject &&
  //                               a.uid === p.uid
  //                           )
  //                         )
  //                         .map((t) => {
  //                           return (
  //                             <Avatar size="sm" key={t.id}>
  //                               <AvatarFallbackText>
  //                                 {t.firstName}
  //                               </AvatarFallbackText>

  //                               <AvatarBadge />
  //                             </Avatar>
  //                           );
  //                         })}
  //                     </HStack>
  //                   </Box>
  //                 </HStack>
  //               </VStack>
  //             </View>
  //           </HStack>
  //         </Box>
  //       </View>
  //       {/* add task section */}
  //       <Box
  //         style={{
  //           borderWidth: 0,
  //           borderColor: "red",
  //           paddingRight: 30,
  //           paddingLeft: 30,
  //         }}
  //       >
  //         <HStack
  //           style={{ justifyContent: "space-between", alignItems: "center" }}
  //         >
  //           <Text style={{ fontWeight: "bold", fontSize: 20, color: "white" }}>
  //             Task
  //           </Text>

  //           <Button
  //             style={{ width: 120 }}
  //             onPress={() => setShowAddTaskModal(true)}
  //           >
  //             <ButtonText>Add Task</ButtonText>
  //           </Button>
  //         </HStack>
  //         <Progress
  //           value={100}
  //           size="sm"
  //           orientation="horizontal"
  //           style={{ marginTop: 10, marginBottom: 10 }}
  //         >
  //           <ProgressFilledTrack />
  //         </Progress>
  //       </Box>

  //       <Box
  //         style={{
  //           borderWidth: 0,
  //           borderColor: "red",
  //           flex: 1,
  //         }}
  //       >
  //         {/* Task Window */}
  //         <ScrollView
  //           style={{
  //             // borderWidth: 2,
  //             // borderColor: "blue",
  //             borderRadius: 15,
  //             paddingLeft: 12,
  //             paddingRight: 12,
  //             paddingTop: 12,
  //             backgroundColor: "#ffffffff",
  //           }}
  //         >
  //           {currentProjectTasks.map((t) => (
  //             <View
  //               key={t.id}
  //               style={{
  //                 backgroundColor: "transparent",
  //                 margin: 0,
  //                 padding: 4,
  //               }}
  //             >
  //               <Pressable
  //                 onPress={() => {
  //                   setSelectedTask(t.id);
  //                   router.push("/(screens)/taskWindow");
  //                 }}
  //                 onHoverIn={() => setIsHover(t.id)}
  //                 onHoverOut={() => setIsHover(null)}
  //               >
  //                 <Center>
  //                   <Card
  //                     size="lg"
  //                     className="p-5 w-full m-1"
  //                     style={{
  //                       borderRadius: 12,
  //                       borderWidth: 1,
  //                       borderColor: isHover === t.id ? "black" : "",
  //                       backgroundColor: "#CDCCCC",
  //                     }}
  //                   >
  //                     <HStack style={{ alignItems: "center" }} space="md">
  //                       <VStack style={{ flex: 1 }}>
  //                         <Text
  //                           style={{
  //                             padding: 4,
  //                             fontSize: 16,
  //                             flexWrap: "wrap",
  //                             fontWeight: "bold",
  //                             color: "black",
  //                           }}
  //                         >
  //                           {t.title ? String(t.title) : ""}
  //                         </Text>
  //                       </VStack>
  //                     </HStack>
  //                   </Card>
  //                 </Center>
  //               </Pressable>
  //             </View>
  //           ))}
  //         </ScrollView>
  //       </Box>

  //       <ProjectEditModal
  //         visible={showEditProjectModal}
  //         onClose={() => setShowEditProjectModal(false)}
  //       />

  //       <TaskAddModal
  //         visible={showAddTaskModal}
  //         onClose={() => setShowAddTaskModal(false)}
  //       />
  //     </View>
  //   );
  // }

  // Ongoing Project
  return (
    <View style={{ flex: 1, padding: 15, backgroundColor: "black" }}>
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
              <SquarePen color={"gray"} />
            </Pressable>

            <Divider
              orientation="vertical"
              style={{ marginLeft: 20, marginRight: 20 }}
            />

            <Button
              action="positive"
              style={{
                width: 150,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ButtonText>Deploy</ButtonText>
            </Button>
          </HStack>
        </Box>
      </HStack>

      <View style={{ marginTop: 20, backgroundColor: "#1F1F1F" }}>
        <Box
          style={{
            // borderWidth: 1,
            // borderColor: "yellow",
            alignItems: "stretch",
            alignContent: "space-evenly",
            padding: 10,
          }}
        >
          <HStack
            style={{
              flex: 1,
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
                borderRadius: 10,
                padding: 10,
                flex: 1,
                backgroundColor: "#5C5C5C",
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
                    <Text style={{ fontSize: 16, color: "white" }}>
                      {truncateWords(currentProjectData.description, 1000)}
                    </Text>
                  </Pressable>
                ) : (
                  <Pressable onPress={() => setDescriptionPressed(true)}>
                    <Text style={{ fontSize: 16, color: "#CDCCCC" }}>
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
                // alignContent: "flex-start",
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
                    <HStack style={{ gap: 8 }}>
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
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Task</Text>
          <Button onPress={() => setShowAddTaskModal(true)}>
            <ButtonText>Add Task</ButtonText>
          </Button>
        </HStack>
        <Progress value={50} size="sm" orientation="horizontal">
          <ProgressFilledTrack />
        </Progress>
      </Box>

      <Box style={{ borderWidth: 0, flex: 1 }}>
        <HStack
          style={{
            justifyContent: "space-between",
            paddingLeft: 50,
            paddingRight: 50,
            flex: 1,
          }}
        >
          {/* To-do Tasks */}
          <Box
            style={{
              borderWidth: 1,
              borderColor: "black",
              borderRadius: 15,
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
            >
              {todoTasks.map((t) => (
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
                        borderColor: isHover === t.id ? "black" : "",
                        backgroundColor: "#CDCCCC",
                      }}
                    >
                      <HStack style={{ alignItems: "center" }} space="md">
                        <Checkbox
                          hitSlop={{
                            top: 10,
                            bottom: 10,
                            left: 10,
                            right: 10,
                          }}
                          onChange={() =>
                            // updateDoc(doc(db, "tasks", t.id), {
                            //   status: !t.status,
                            // })
                            setTodoConfirmationModal(true)
                          }
                          value={t.id}
                        >
                          <CheckboxIndicator>
                            <CheckboxIcon as={CheckIcon} />
                          </CheckboxIndicator>
                        </Checkbox>

                        <Divider orientation="vertical" />
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
                                padding: 4,
                                fontSize: 16,
                                flexWrap: "wrap",
                                fontWeight: isHover ? "bold" : "normal",
                                color: "black",
                              }}
                            >
                              {t.title ? String(t.title) : ""}
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

          {/* Ongoing Tasks */}
          <Box
            style={{
              borderWidth: 1,
              borderColor: "black",
              borderRadius: 15,
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
                  <Pressable
                    onPress={() => {
                      setSelectedTask(t.id);
                      router.push("/(screens)/taskWindow");
                    }}
                    onHoverIn={() => setIsHover(t.id)}
                    onHoverOut={() => setIsHover(null)}
                  >
                    <Center>
                      <Card
                        size="lg"
                        className="p-5 w-full m-1"
                        style={{
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: isHover === t.id ? "black" : "",
                          backgroundColor: "#CDCCCC",
                        }}
                      >
                        <HStack style={{ alignItems: "center" }} space="md">
                          <VStack style={{ flex: 1 }}>
                            <Text
                              style={{
                                padding: 4,
                                fontSize: 16,
                                flexWrap: "wrap",
                                fontWeight: "bold",
                                color: "black",
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

          {/* Completed Tasks */}
          <Box
            style={{
              borderWidth: 1,
              borderColor: "black",
              borderRadius: 15,
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
                  <Pressable
                    onPress={() => {
                      setSelectedTask(t.id);
                      router.push("/(screens)/taskWindow");
                    }}
                    onHoverIn={() => setIsHover(t.id)}
                    onHoverOut={() => setIsHover(null)}
                  >
                    <Center>
                      <Card
                        size="lg"
                        className="p-5 w-full m-1"
                        style={{
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: isHover === t.id ? "black" : "",
                          backgroundColor: "#CDCCCC",
                        }}
                      >
                        <HStack style={{ alignItems: "center" }} space="md">
                          <VStack style={{ flex: 1 }}>
                            <Text
                              style={{
                                padding: 4,
                                fontSize: 16,
                                flexWrap: "wrap",
                                fontWeight: "bold",
                                color: "black",
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
        </HStack>
      </Box>

      <Modal
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
      </Modal>

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
});
