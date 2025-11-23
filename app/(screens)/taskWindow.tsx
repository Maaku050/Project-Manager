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
import {
  CalendarDays,
  Check,
  ChevronDown,
  CircleX,
  Clock4,
  EllipsisVertical,
  Play,
  Repeat,
  RotateCcw,
  SquarePen,
  Trash,
  Undo2,
} from "lucide-react-native";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
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
import {
  isCodeBlock,
  detectLanguage,
  extractCode,
  formatCode,
} from "@/helpers/codeBlockDetector";
import {
  handleStartTask,
  handleUnstartTask,
  handleCompleteTask,
} from "@/helpers/taskStateHandler";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import { getDateLabel } from "@/helpers/getDateLabel";
import TaskStateButton from "@/components/taskStateButton";
import TaskDeleteModal from "@/modals/taskDeleteModal";
import TaskCommentSection from "@/components/taskCommentSection";
import TasktUsers from "@/components/taskAssignedUsers";

export default function TaskWindow() {
  const {
    selectedProject,
    comment,
    tasks,
    selectedTask,
    assignedUser,
    project,
    setSelectedTask,
  } = useProject();

  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 1280; // computer UI condition
  const isMediumScreen = dimensions.width <= 1280 && dimensions.width > 768; // tablet UI condition

  const { user, profile, profiles } = useUser();

  const currentTask = tasks.find(
    (t) => t.projectID === selectedProject && t.id === selectedTask
  );

  const currentProjectData = project.find((t) => t.id === selectedProject);

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
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showConfirmationModal, setConfirmationModal] = useState(false);
  const [todoOrOngoing, setTodoOrOngoing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [buttonHover, setButtonHover] = useState("");

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

  if (!currentTask || !currentProjectData) return;

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
          paddingTop: 30,
          paddingHorizontal: 15,
          backgroundColor: "#000000",
        }}
        showsVerticalScrollIndicator={false}
      >
        <HStack
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            borderLeftWidth: 8,
            borderColor:
              currentTask.status === "To-do" &&
              currentTask.start &&
              currentTask.start.toDate() > new Date()
                ? "green"
                : currentTask.status === "To-do" &&
                    currentTask.start &&
                    currentTask.start.toDate() < new Date()
                  ? "#D76C1F"
                  : currentTask.status === "Ongoing" &&
                      currentTask.end &&
                      currentTask.end.toDate() > new Date()
                    ? "green"
                    : currentTask.status === "Ongoing" &&
                        currentTask.end &&
                        currentTask.end.toDate() < new Date()
                      ? "#B91C1C"
                      : currentTask.status === "CompleteAndOnTime"
                        ? "green"
                        : currentTask.status === "CompleteAndOverdue"
                          ? "#D76C1F"
                          : "red",
            paddingLeft: 8,
          }}
        >
          <Box>
            <Text style={{ color: "#ffffff" }}>
              {currentProjectData?.title}
            </Text>
            <Heading style={{ color: "#ffffff" }}>{currentTask?.title}</Heading>
          </Box>
          <HStack style={{ alignItems: "center" }} space="lg">
            <TaskStateButton taskID={currentTask.id} from="taskWindow" />
            <Menu
              placement="top"
              offset={5}
              disabledKeys={["Settings"]}
              trigger={({ ...triggerProps }) => {
                return (
                  <Pressable
                    {...triggerProps}
                    style={{ borderWidth: 0, borderColor: "white" }}
                  >
                    <EllipsisVertical color={"white"} />
                  </Pressable>
                );
              }}
            >
              <MenuItem
                textValue="Add account"
                onPress={() => {
                  setShowEditTaskModal(true);
                }}
              >
                <SquarePen />
                <MenuItemLabel
                  size="md"
                  style={{ marginLeft: 10, fontWeight: "bold" }}
                >
                  Edit task
                </MenuItemLabel>
              </MenuItem>

              <MenuItem
                textValue="Add account"
                onPress={() => setShowDeleteTaskModal(true)}
              >
                <Trash color={"red"} />
                <MenuItemLabel
                  size="md"
                  style={{ marginLeft: 10, fontWeight: "bold", color: "red" }}
                >
                  Delete task
                </MenuItemLabel>
              </MenuItem>
            </Menu>
          </HStack>
        </HStack>

        <HStack style={{ borderWidth: 0, marginTop: 10 }}>
          <Text
            style={{
              color: "white",
              flex: 2,
            }}
          >
            {currentTask.description}
          </Text>
          <Divider orientation="vertical" style={{ backgroundColor: "gray" }} />
          <VStack style={{ borderWidth: 0, flex: 1 }} space="lg">
            <HStack
              style={{
                marginLeft: 30,
              }}
              space="sm"
            >
              <Text style={{ color: "#CDCCCC" }}>Status</Text>
              <Text style={{ color: "white" }}>{currentTask.status}</Text>
            </HStack>
            <HStack
              style={{
                marginLeft: 30,
              }}
              space="sm"
            >
              <Text style={{ color: "#CDCCCC" }}>Timeline</Text>

              <Text
                style={{
                  color:
                    currentTask.start && currentTask.start.toDate() > new Date()
                      ? "white"
                      : "#B91C1C",
                  fontSize: 12,
                }}
              >
                {getDateLabel(currentTask.start, "start")}
              </Text>
              <Text style={{ color: "#CDCCCC" }}>-</Text>
              <Text
                style={{
                  color:
                    currentTask.end && currentTask.end.toDate() > new Date()
                      ? "white"
                      : "#B91C1C",
                  fontSize: 12,
                }}
              >
                {getDateLabel(currentTask.end, "due")}
              </Text>
            </HStack>
            <HStack
              style={{
                marginLeft: 30,
              }}
              space="sm"
            >
              <Text style={{ color: "#CDCCCC" }}>Status</Text>
              <TasktUsers taskID={currentTask.id} />
            </HStack>
          </VStack>
        </HStack>

        <TaskCommentSection taskID={currentTask.id} />

        <TaskEditModal
          visible={showEditTaskModal}
          onClose={() => setShowEditTaskModal(false)}
        />
        <TaskDeleteModal
          taskID={currentTask.id}
          visible={showDeleteTaskModal}
          onClose={() => setShowDeleteTaskModal(false)}
        />
      </ScrollView>
    </>
  );
}
