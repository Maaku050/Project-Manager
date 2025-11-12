import React, { useEffect, useState } from "react";
import { View, Pressable, ScrollView, useWindowDimensions } from "react-native";
import { useProject } from "@/context/projectContext";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon, ArrowLeftIcon, InfoIcon } from "@/components/ui/icon";
import { router } from "expo-router";
import { VStack } from "@/components/ui/vstack";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { CalendarDays, Clock4, SquarePen } from "lucide-react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { TextInput } from "react-native-gesture-handler";
import { db } from "@/firebase/firebaseConfig";
import {
  updateDoc,
  doc,
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { useUser } from "@/context/profileContext";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
} from "@/components/ui/avatar";
import TaskEditModal from "@/modals/taskEditModal";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { Spinner } from "@/components/ui/spinner";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export default function TaskModal() {
  const { selectedProject, comment, tasks, selectedTask, assignedUser } =
    useProject();

  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 1280; // computer UI condition
  const isMediumScreen = dimensions.width <= 1280 && dimensions.width > 768; // tablet UI condition

  const { user, profile, profiles } = useUser();

  const currentTask = tasks.find(
    (t) => t.projectID === selectedProject && t.id === selectedTask
  );

  const toDate = (t?: Timestamp | null) => (t ? t.toDate() : undefined);
  const toTimestamp = (d?: Date | null) => (d ? Timestamp.fromDate(d) : null);

  const editTitle = async (newText: string) => {
    console.log("Edit Function mounted!");
    if (!selectedTask) return; // 🧩 make sure a task is selected
    const trimmed = newText.trim();
    if (!trimmed) return;

    try {
      const taskRef = doc(db, "tasks", selectedTask);
      await updateDoc(taskRef, { title: trimmed });
      console.log("Task title updated successfully");
    } catch (error) {
      console.error("Error updating title:", error);
    }
  };

  const editDescription = async (newText: string) => {
    console.log("Edit Function mounted!");
    if (!selectedTask) return; // 🧩 make sure a task is selected
    const trimmed = newText.trim();
    if (!trimmed) return;

    try {
      const taskRef = doc(db, "tasks", selectedTask);
      await updateDoc(taskRef, { description: trimmed });
      console.log("Task description updated successfully");
    } catch (error) {
      console.error("Error updating description:", error);
    }
  };

  const handleAddComment = async () => {
    console.log("Comment Function Mounted!");

    // ✅ Basic validation
    if (!profile?.uid) {
      console.warn("No user profile found — cannot post comment.");
      return;
    }

    const trimmedComment = isComment.trim();
    if (!trimmedComment) {
      console.warn("Empty comment — skipping add.");
      return;
    }

    try {
      const commentRef = collection(db, "comment");

      await addDoc(commentRef, {
        text: trimmedComment,
        createdAt: serverTimestamp(),
        uid: profile.uid,
        taskID: selectedTask,
      });

      console.log("✅ Comment added successfully");

      // ✅ Clear input after success
      setIsComment("");
    } catch (error) {
      console.error("❌ Error adding comment:", error);
    }
  };

  const getInputValue = (e: any) =>
    e?.nativeEvent?.text ??
    (e?.target as HTMLInputElement | HTMLTextAreaElement)?.value ??
    "";

  useEffect(() => {
    console.log("Current Task ID: ", selectedTask);
    console.log("Comments: ", currentTaskComments);
  }, []);

  useEffect(() => {
    if (currentTask) {
      setTempTitle(currentTask.title ?? "");
      setTempDescription(currentTask.description ?? "");
      setTempStart(currentTask.start ?? null);
      setTempEnd(currentTask.end ?? null);
    }

    console.log("Tasks start: ", tempStart);
  }, [currentTask]);

  const currentTaskComments = comment
    .filter((t) => t.taskID === selectedTask)
    .sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      const aTime =
        a.createdAt instanceof Timestamp ? a.createdAt.toDate().getTime() : 0;
      const bTime =
        b.createdAt instanceof Timestamp ? b.createdAt.toDate().getTime() : 0;
      return bTime - aTime;
    });

  const [isEdit, setIsEdit] = useState(false);
  // const [descHeight, setDescHeight] = useState(40);
  const [isComment, setIsComment] = useState("");

  const [tempTitle, setTempTitle] = useState<string>("");
  const [tempDescription, setTempDescription] = useState<string>("");
  const [tempStart, setTempStart] = useState<Timestamp | null>(null);
  const [tempEnd, setTempEnd] = useState<Timestamp | null>(null);
  const [descriptionPressed, setDescriptionPressed] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showConfirmationModal, setConfirmationModal] = useState(false);
  const [todoOrOngoing, setTodoOrOngoing] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSaveChanges = async () => {
    if (
      !tempTitle.trim() ||
      !tempDescription.trim() ||
      !tempStart ||
      !tempEnd
    ) {
      console.log("Empty Fields!");
      return;
    }

    if (!selectedTask) {
      console.log("No selected task!");
      return;
    }

    try {
      const taskRef = doc(db, "tasks", selectedTask);
      await updateDoc(taskRef, {
        title: tempTitle,
        description: tempDescription,
        start: tempStart,
        end: tempEnd,
      });

      console.log("✅ Task updated successfully");
    } catch (error) {
      console.error("❌ Error updating task:", error);
    }
  };

  const truncateWords = (text: string | undefined, wordLimit: number) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + " ..."
      : text;
  };

  function timeAgo(date: Date | string | number) {
    const now = new Date();
    const then = new Date(date);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  const handleStartAndCompleteTask = async (state: string) => {
    if (!currentTask) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, "tasks", currentTask?.id), {
        status: state,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

    setConfirmationModal(false);
  };

  const isCodeBlock = (text: string) => {
    return text.startsWith("```") && text.endsWith("```");
  };

  const extractCode = (text: string) => {
    return text.replace(/^```/, "").replace(/```$/, "").trim();
  };

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 10,
        backgroundColor: "#000000ff",
      }}
    >
      {/* <View style={{backgroundColor: isLargeScreen ? "#1F1F1F" : isMediumScreen ? "#1F1F1F" : "transparent", margin: 12, padding: isLargeScreen ? 12 : isMediumScreen ? 12 : 8, borderRadius: 12}}> */}
      <Box
        style={{
          borderWidth: 0,
          paddingTop: isLargeScreen ? 12 : isMediumScreen ? 12 : 8,
          paddingBottom: 10,
          marginTop: 0,
        }}
      >
        <HStack
          style={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Pressable
            onPress={() => {
              setIsEdit(false);
              router.replace("/projectWindow");
            }}
          >
            <HStack style={{ alignItems: "center", alignContent: "center" }}>
              <Icon
                as={ArrowLeftIcon}
                className="text-typography-500 w-7 h-6 mr-1 mt-1"
                color="#ffffff"
              />
              <Text
                style={{ fontSize: 25, fontWeight: "bold", color: "#ffffff" }}
              >
                Back
              </Text>
            </HStack>
          </Pressable>
          <HStack
            style={{ alignContent: "space-between", alignItems: "center" }}
          >
            <Pressable
              onPress={() => {
                setShowEditTaskModal(true);
              }}
            >
              <SquarePen color={"#ffffff"} />
            </Pressable>

            <Divider
              orientation="vertical"
              style={{
                marginLeft: 20,
                marginRight: 20,
                borderColor: "#ffffff42",
                borderWidth: 1,
                height: 30,
              }}
            />

            <Button
              action="positive"
              style={{
                width: 150,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                setTodoOrOngoing(
                  currentTask?.status === "To-do" ? true : false
                );
                setConfirmationModal(true);
              }}
            >
              <ButtonText style={{ fontSize: 20, fontWeight: "bold" }}>
                {currentTask?.status === "To-do"
                  ? "Start"
                  : currentTask?.status === "Ongoing"
                  ? "Complete"
                  : "Revert"}
              </ButtonText>
            </Button>
          </HStack>
        </HStack>
      </Box>

      {/* Top container */}
      <View
        style={{
          borderWidth: 0,
          borderRadius: 8,
          marginTop: 12,
          paddingHorizontal: 20,
          paddingVertical: 12,
          backgroundColor: "#1f1f1f",
          height: "auto",
          gap: 0,
        }}
      >
        {/* content container */}
        <HStack
          style={{
            // flex: 1,
            width: isLargeScreen ? "auto" : "100%",
            flexDirection: isLargeScreen
              ? "row"
              : isMediumScreen
              ? "column"
              : "column",
            borderWidth: 0,
            gap: 8,
          }}
        >
          <Box
            style={{
              flex: 1,
              borderWidth: 0,
              padding: 20,
              backgroundColor: "#5C5C5C",
              borderRadius: 12,
            }}
          >
            {" "}
            {/* Main Info Section */}
            <VStack>
              <Text
                style={{
                  fontSize: isLargeScreen ? 20 : isMediumScreen ? 20 : 16,
                  fontWeight: "bold",
                  marginBottom: 5,
                  color: "#ffffff",
                }}
              >
                Task title
              </Text>
              <Text style={{ marginBottom: 5, fontSize: 12, color: "#ffffff" }}>
                {currentTask?.title}
              </Text>
              <Text
                style={{
                  fontSize: isLargeScreen ? 20 : isMediumScreen ? 20 : 16,
                  fontWeight: "bold",
                  marginBottom: 5,
                  color: "#ffffff",
                }}
              >
                Task description
              </Text>
              <Box style={{ borderWidth: 0, paddingRight: 10 }}>
                <ScrollView>
                  {descriptionPressed ? (
                    <Pressable onPress={() => setDescriptionPressed(false)}>
                      <Text style={{ fontSize: 15, color: "#ffffff" }}>
                        {truncateWords(currentTask?.description, 1000)}
                      </Text>
                    </Pressable>
                  ) : (
                    <Pressable onPress={() => setDescriptionPressed(true)}>
                      <Text style={{ fontSize: 15, color: "#ffffff" }}>
                        {truncateWords(currentTask?.description, 50)}
                      </Text>
                    </Pressable>
                  )}
                </ScrollView>
              </Box>
            </VStack>
          </Box>

          {/* status and timeline section */}
          <Box
            style={{
              flex: 1,
              backgroundColor: "#5C5C5C",
              borderWidth: 0,
              padding: 20,
              gap: 10,
              borderRadius: 12,
            }}
          >
            <Box
              style={{
                flex: 1,
                borderWidth: 0,
                alignContent: "center",
              }}
            >
              <HStack>
                <Box style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: isLargeScreen ? 20 : isMediumScreen ? 20 : 16,
                      color: "#ffffff",
                    }}
                  >
                    Status
                  </Text>
                </Box>
                <Box style={{ flex: 2 }}>
                  <HStack
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Clock4 size={25} color={"#ffffff"} />
                    <Text style={{ marginLeft: 15, color: "#ffffff" }}>
                      {currentTask?.status}
                    </Text>
                  </HStack>
                </Box>
              </HStack>
            </Box>

            <Box
              style={{
                flex: 1,
                borderWidth: 0,
                alignContent: "center",
              }}
            >
              <HStack>
                <Box style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: isLargeScreen ? 20 : isMediumScreen ? 20 : 16,
                      color: "#ffffff",
                    }}
                  >
                    Time Line
                  </Text>
                </Box>
                <Box style={{ flex: 2 }}>
                  <HStack>
                    <CalendarDays size={25} color={"#ffffff"} />
                    <Text style={{ marginLeft: 15, color: "#ffffff" }}>
                      {currentTask?.start
                        ? currentTask.start
                            .toDate()
                            .toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                            })
                        : "No start date"}
                    </Text>
                    <Text style={{ color: "white" }}> - </Text>
                    <Text style={{ marginLeft: 15, color: "#ffffff" }}>
                      {currentTask?.end
                        ? currentTask.end.toDate().toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                          })
                        : "No start date"}
                    </Text>
                  </HStack>
                </Box>
              </HStack>
            </Box>

            <Box
              style={{
                flex: 1,
                borderWidth: 0,
                alignContent: "center",
              }}
            >
              <HStack
                style={{
                  alignItems: "center",
                  paddingBottom: 12,
                  marginBottom: 12,
                  paddingTop: 12,
                }}
              >
                <Box style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: isLargeScreen ? 20 : isMediumScreen ? 20 : 16,
                      color: "#ffffff",
                    }}
                  >
                    Assigned Members
                  </Text>
                </Box>
                <Box style={{ flex: 2 }}>
                  <HStack>
                    {profiles
                      .filter((p) =>
                        assignedUser.some(
                          (a) => a.taskID === selectedTask && a.uid === p.uid
                        )
                      )
                      .map((t) => {
                        return (
                          <>
                            <Avatar size="xs" key={t.id}>
                              <AvatarFallbackText>
                                {t.firstName}
                              </AvatarFallbackText>

                              <AvatarBadge />
                            </Avatar>
                            <Text style={{ marginLeft: 15 }}>
                              {t.firstName} {t.lastName}
                            </Text>
                          </>
                        );
                      })}
                  </HStack>
                </Box>
              </HStack>
            </Box>
          </Box>
        </HStack>
      </View>

      <View
        style={{
          flex: 1,
          // borderWidth: 1,
          borderColor: "#5C5C5C",
          borderRadius: 8,
          marginTop: 12,
          paddingHorizontal: 20,
          paddingVertical: 10,
          backgroundColor: isLargeScreen
            ? "#5C5C5C"
            : isMediumScreen
            ? "#5C5C5C"
            : "#1F1F1F",
        }}
      >
        <Text
          style={{
            fontSize: isLargeScreen ? 20 : 16,
            fontWeight: "bold",
            fontFamily: "roboto",
            color: "#ffffff",
          }}
        >
          Comments
        </Text>
        <Box style={{ borderWidth: 0 }}>
          <HStack style={{ alignItems: "center" }}>
            <Avatar size="sm" style={{ position: "absolute", marginLeft: 15 }}>
              <AvatarFallbackText>{profile?.firstName}</AvatarFallbackText>
              <AvatarBadge />
            </Avatar>

            <TextInput
              style={{
                borderWidth: isLargeScreen ? 2 : 1,
                borderColor: "#cccccc",
                borderRadius: 8,
                height: 45,
                outlineWidth: 1,
                color: "#ffffff",
                flex: 1,
                paddingLeft: 55,
              }}
              value={isComment}
              onChangeText={setIsComment}
              onSubmitEditing={handleAddComment}
              placeholder="Write a comment..."
            />
          </HStack>
        </Box>

        {/* <Button
            onPress={handleAddComment}
            action="primary"
            style={{ marginTop: 8 }}
          >
            <ButtonText>Post</ButtonText>
          </Button> */}

        <Box
          style={{
            flex: 1,
            borderWidth: 0,
            marginTop: 5,
          }}
        >
          <ScrollView
            style={{
              height: "100%",
              marginBottom: 8,
              backgroundColor: "transparent",
            }}
          >
            {currentTaskComments.map((t) => {
              const user = profiles.find((a) => a.uid === t.uid);
              return (
                <Card
                  key={t.id}
                  style={{
                    borderRadius: 0,
                    backgroundColor: isLargeScreen
                      ? "#00000052"
                      : isMediumScreen
                      ? "#00000052"
                      : "transparent",
                    marginBottom: -20,
                  }}
                >
                  <Pressable
                    onHoverIn={() => setIsHovered(true)}
                    onHoverOut={() => setIsHovered(false)}
                  >
                    <HStack
                      style={{
                        backgroundColor: isHovered
                          ? "#353535cc"
                          : "transparent",
                        padding: 12,
                        height: "auto",
                      }}
                    >
                      <Box>
                        <Avatar size="sm">
                          <AvatarFallbackText>
                            {user?.firstName}
                          </AvatarFallbackText>
                          <AvatarBadge />
                        </Avatar>
                      </Box>

                      <Box style={{ flex: 1, marginLeft: 8 }}>
                        <HStack
                          style={{
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{ fontWeight: "bold", color: "#ffffff" }}
                          >
                            {user?.firstName} {user?.lastName}{" "}
                          </Text>
                          <Text style={{ fontSize: 12, color: "#999" }}>
                            {t.createdAt
                              ? timeAgo(
                                  t.createdAt.seconds
                                    ? new Date(t.createdAt.seconds * 1000)
                                    : new Date(t.createdAt.toDate())
                                )
                              : ""}
                          </Text>
                        </HStack>

                        {isCodeBlock(t.text) ? (
                          <View
                            style={{
                              backgroundColor: "#1e1e1e",
                              padding: 10,
                              borderRadius: 6,
                              marginTop: 5,
                              borderWidth: 1,
                              borderColor: "#333",
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: "monospace",
                                color: "#9cdcfe",
                                fontSize: 13,
                              }}
                            >
                              {extractCode(t.text)}
                            </Text>
                          </View>
                        ) : (
                          <Text style={{ color: "#CDCCCC" }}>{t.text}</Text>
                        )}
                      </Box>
                    </HStack>
                  </Pressable>
                </Card>
              );
            })}
          </ScrollView>
        </Box>
      </View>

      {/* </View> */}
      <TaskEditModal
        visible={showEditTaskModal}
        onClose={() => setShowEditTaskModal(false)}
      />

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
    </View>
  );
}
