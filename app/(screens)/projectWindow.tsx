import { Box } from "@/components/ui/box";
import { Pressable, ScrollView, StyleSheet, useWindowDimensions } from "react-native";
import { Text } from "@/components/ui/text";
import { useProject } from "@/context/projectContext";
import { Divider } from "@/components/ui/divider";
import { useState } from "react";
import React from "react";
import { HStack } from "@/components/ui/hstack";
import { CircleX, EllipsisVertical, Repeat, SquarePen, Trash } from "lucide-react-native";
import ProjectEditModal from "@/modals/projectEditModal";
import TaskAddModal from "@/modals/taskAddModal";
import ProjectUsers from "@/components/projectAssignedUsers";
import TaskSummary from "@/components/taskSummary";
import TaskProgressBar from "@/components/taskProgressBar";
import TodoTasks from "@/components/todoTasks";
import OngoingTasks from "@/components/ongoingTasks";
import CompletedTasks from "@/components/completedTasks";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import ProjectDeleteModal from "@/modals/projectDeleteModal";
import ProjectCloseModal from "@/modals/projectCloseModal";
import ProjectReopenModal from "@/modals/projectReopenModal";

export default function ProjectWindow() {
  const dimensions = useWindowDimensions();
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);
  const [showCloseProjectModal, setShowCloseProjectModal] = useState(false);
  const [showReopenProjectModal, setShowReopenProjectModal] = useState(false);
  const { selectedProject, project, setSelectedProject } = useProject();
  const currentProjectData = project.find((t) => t.id === selectedProject);

  if (!currentProjectData) {
    return <Text>Loading project data...</Text>;
  }

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
          paddingTop: 30,
          paddingHorizontal: 15,
          backgroundColor: "#000000",
          borderWidth: 0,
          borderColor: "red",
        }}
        showsVerticalScrollIndicator={false}
      >
        <Box style={{ borderWidth: 0, marginBottom: 30 }}>
          <HStack style={{ justifyContent: "space-between", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: "white",
              }}
            >
              {currentProjectData.title}
            </Text>
            <Menu
              placement="top"
              offset={5}
              disabledKeys={["Settings"]}
              trigger={({ ...triggerProps }) => {
                return (
                  <Pressable {...triggerProps} style={{ borderWidth: 0, borderColor: "white" }}>
                    <EllipsisVertical color={"white"} />
                  </Pressable>
                );
              }}
            >
              <MenuItem
                textValue="Add account"
                onPress={() => {
                  setSelectedProject(currentProjectData.id);
                  setShowEditProjectModal(true);
                }}
              >
                <SquarePen />
                <MenuItemLabel size="md" style={{ marginLeft: 10, fontWeight: "bold" }}>
                  Edit project
                </MenuItemLabel>
              </MenuItem>

              {currentProjectData.status === "Closed" ? (
                <MenuItem textValue="Add account" onPress={() => setShowReopenProjectModal(true)}>
                  <Repeat />
                  <MenuItemLabel size="md" style={{ marginLeft: 10, fontWeight: "bold" }}>
                    Reopen project
                  </MenuItemLabel>
                </MenuItem>
              ) : (
                <MenuItem textValue="Add account" onPress={() => setShowCloseProjectModal(true)}>
                  <CircleX />
                  <MenuItemLabel size="md" style={{ marginLeft: 10, fontWeight: "bold" }}>
                    Close project
                  </MenuItemLabel>
                </MenuItem>
              )}

              <MenuItem textValue="Add account" onPress={() => setShowDeleteProjectModal(true)}>
                <Trash color={"red"} />
                <MenuItemLabel
                  size="md"
                  style={{ marginLeft: 10, fontWeight: "bold", color: "red" }}
                >
                  Delete project
                </MenuItemLabel>
              </MenuItem>
            </Menu>
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
                    <Text style={{ color: "#CDCCCC", fontSize: 18 }}>Status</Text>
                    <Text style={{ color: "white", fontSize: 18 }}>
                      {currentProjectData.status}
                    </Text>
                  </HStack>

                  {/* Vertical Divider */}
                  <Divider orientation="vertical" style={{ backgroundColor: "gray" }} />

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
                    <Text style={{ color: "#CDCCCC", fontSize: 18 }}>Deadline</Text>
                    <Text style={{ color: "white", fontSize: 18 }}>
                      {currentProjectData.deadline &&
                        currentProjectData.deadline.toDate().toLocaleDateString("en-US")}
                    </Text>
                  </HStack>

                  {/* Vertical Divider */}
                  <Divider orientation="vertical" style={{ backgroundColor: "gray" }} />

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
                    <Text style={{ color: "#CDCCCC", fontSize: 18 }}>Assigned Members</Text>
                    <ProjectUsers projectID={currentProjectData.id} />
                  </HStack>
                </HStack>
              </Box>
            </Box>

            {/* Divider */}
            <Box style={{ flex: 0 }}>
              <Divider orientation="vertical" style={{ backgroundColor: "gray" }} />
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
                <Text style={{ color: "#CDCCCC", fontSize: 15, marginBottom: 10 }}>
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
      </ScrollView>

      <ProjectEditModal
        visible={showEditProjectModal}
        onClose={() => setShowEditProjectModal(false)}
      />

      <TaskAddModal visible={showAddTaskModal} onClose={() => setShowAddTaskModal(false)} />

      <ProjectDeleteModal
        projectID={currentProjectData.id}
        visible={showDeleteProjectModal}
        onClose={() => setShowDeleteProjectModal(false)}
      />

      <ProjectCloseModal
        projectID={currentProjectData.id}
        visible={showCloseProjectModal}
        onClose={() => setShowCloseProjectModal(false)}
      />

      <ProjectReopenModal
        projectID={currentProjectData.id}
        visible={showReopenProjectModal}
        onClose={() => setShowReopenProjectModal(false)}
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
