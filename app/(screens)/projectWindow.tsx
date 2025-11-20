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
import { db } from "@/firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { HStack } from "@/components/ui/hstack";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { EllipsisVertical, SquarePen } from "lucide-react-native";
import ProjectEditModal from "@/modals/projectEditModal";
import TaskAddModal from "@/modals/taskAddModal";
import ProjectUsers from "@/components/projectAssignedUsers";
import TaskSummary from "@/components/taskSummary";
import TaskProgressBar from "@/components/taskProgressBar";
import TodoTasks from "@/components/todoTasks";
import OngoingTasks from "@/components/ongoingTasks";
import CompletedTasks from "@/components/completedTasks";

export default function ProjectWindow() {
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 1400; // computer UI condition
  const isMediumScreen = dimensions.width <= 1400 && dimensions.width > 860; // tablet UI condition

  const router = useRouter();
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [tempAssigned, setTempAssigned] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isHover, setIsHover] = useState<string | null>(null);
  const [descriptionPressed, setDescriptionPressed] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [showConfirmationModal, setConfirmationModal] = useState(false);
  const [showDeleteConfirmationModal, setDeleteConfirmationModal] =
    useState(false);
  const [todoOrOngoing, setTodoOrOngoing] = useState(true);
  const [taskID, setTaskID] = useState("");
  const [taskIdToDelete, setTaskIdToDelete] = useState("");
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

  const progress =
    ((ongoingTasks.length * 0.5 + completedTasks.length * 1) / totalTasks) *
    100;

  const currentProjectAssignedUsers = profiles.filter((profile) =>
    assignedUser.some(
      (a) => a.projectID === selectedProject && a.uid === profile.uid
    )
  );

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

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
          paddingTop: 50,
          paddingHorizontal: 30,
          backgroundColor: "#000000",
        }}
        showsVerticalScrollIndicator={false}
      >
        <Box style={{ borderWidth: 0, marginBottom: 30 }}>
          <HStack
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: "white",
              }}
            >
              {currentProjectData.title}
            </Text>
            <Pressable>
              <EllipsisVertical color={"white"} size={25} />
            </Pressable>
          </HStack>
        </Box>

        <Box style={{ borderWidth: 0 }}>
          <HStack>
            {/* Description / Status / Deadline / Assigned users */}
            <Box style={{ flex: 3, paddingRight: 20 }}>
              {/* Description */}
              <Text
                style={{
                  color: "white",
                  marginBottom: 20,
                }}
              >
                {currentProjectData.description}
              </Text>

              <Box style={{ borderWidth: 0, flex: 1 }}>
                <HStack style={{ flex: 1, alignItems: "center" }}>
                  {/* Status */}
                  <HStack
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingVertical: 10,
                    }}
                    space="md"
                  >
                    <Text style={{ color: "#CDCCCC", fontSize: 18 }}>
                      Status
                    </Text>
                    <Text style={{ color: "white", fontSize: 18 }}>
                      {currentProjectData.status}
                    </Text>
                  </HStack>

                  {/* Vertical Divider */}
                  <Divider
                    orientation="vertical"
                    style={{ backgroundColor: "gray" }}
                  />

                  {/* Deadline */}
                  <HStack
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingVertical: 10,
                    }}
                    space="md"
                  >
                    <Text style={{ color: "#CDCCCC", fontSize: 18 }}>
                      Deadline
                    </Text>
                    <Text style={{ color: "white", fontSize: 18 }}>
                      {currentProjectData.deadline &&
                        currentProjectData.deadline
                          .toDate()
                          .toLocaleDateString("en-US")}
                    </Text>
                  </HStack>

                  {/* Vertical Divider */}
                  <Divider
                    orientation="vertical"
                    style={{ backgroundColor: "gray" }}
                  />

                  {/* Assigned Users */}
                  <HStack
                    style={{
                      flex: 2,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingVertical: 10,
                    }}
                    space="md"
                  >
                    <Text style={{ color: "#CDCCCC", fontSize: 18 }}>
                      Assigned Members
                    </Text>
                    <ProjectUsers projectID={currentProjectData.id} />
                  </HStack>
                </HStack>
              </Box>
            </Box>

            {/* Divider */}
            <Box style={{ flex: 0 }}>
              <Divider
                orientation="vertical"
                style={{ backgroundColor: "gray" }}
              />
            </Box>

            {/* Tasks Summary */}
            <Box
              style={{
                flex: 1,
                borderWidth: 0,
                paddingLeft: 20,
              }}
            >
              <Box>
                <Text
                  style={{ color: "#CDCCCC", fontSize: 15, marginBottom: 10 }}
                >
                  Task Summary
                </Text>
                <TaskSummary projectID={currentProjectData.id} />
              </Box>
            </Box>
          </HStack>
        </Box>

        <Box
          style={{
            borderWidth: 0,
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          <TaskProgressBar projectID={currentProjectData.id} />
        </Box>

        <Box style={{ borderWidth: 0, flex: 1 }}>
          <HStack space="sm" style={{ alignItems: "stretch" }}>
            <Box style={{ flex: 1 }}>
              <TodoTasks projectID={currentProjectData.id} />
            </Box>

            <Box style={{ flex: 1 }}>
              <OngoingTasks projectID={currentProjectData.id} />
            </Box>

            <Box style={{ flex: 1 }}>
              <CompletedTasks projectID={currentProjectData.id} />
            </Box>
          </HStack>
        </Box>

        {/* ----------------------------start of the three doom------------------------------- */}

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

      <ProjectEditModal
        visible={showEditProjectModal}
        onClose={() => setShowEditProjectModal(false)}
      />

      <TaskAddModal
        visible={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
      />
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
  boxLabel: {
    borderWidth: 0,
    alignItems: "center",
    padding: 10,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    backgroundColor: "#dbdbdbff",
    // flex: 1,
  },
  starMenuDrawer: {
    // flexDirection: "row",
    // alignItems: "center",
    flex: 1,
    gap: 0,
  },
  starnum: {
    position: "absolute",
    left: 21,
  },
});
