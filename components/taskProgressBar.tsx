import React, { useState } from "react";
import { Text } from "react-native";
import { HStack } from "./ui/hstack";
import { useProject } from "@/context/projectContext";
import { Heading } from "./ui/heading";
import { Button, ButtonIcon, ButtonText } from "./ui/button";
import { PlusIcon } from "lucide-react-native";
import { Progress, ProgressFilledTrack } from "./ui/progress";
import TaskAddModal from "@/modals/taskAddModal";

type TaskProgressBarType = {
  projectID: string;
};

export default function TaskProgressBar({ projectID }: TaskProgressBarType) {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const { tasks } = useProject();

  const currentProjectTasks = tasks.filter(
    (t) =>
      t.projectID === projectID &&
      ["To-do", "Ongoing", "Completed"].includes(t.status)
  );

  const currentTotalTasks = currentProjectTasks.length;

  const todoTasks = currentProjectTasks.filter(
    (t) => t.status === "To-do"
  ).length;
  const ongoingTasks = currentProjectTasks.filter(
    (t) => t.status === "Ongoing"
  ).length;
  const completedTasks = currentProjectTasks.filter(
    (t) => t.status === "Completed"
  ).length;

  // Weighted progress: To-do = 0, Ongoing = 50%, Completed = 100%
  const progress =
    currentTotalTasks > 0
      ? ((todoTasks * 0 + ongoingTasks * 0.5 + completedTasks * 1) /
          currentTotalTasks) *
        100
      : 0;

  return (
    <>
      <HStack style={{ justifyContent: "space-between", marginBottom: 10 }}>
        <HStack style={{ alignItems: "center" }} space="sm">
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
            {currentTotalTasks} total tasks
          </Text>
          <Text style={{ color: "white", fontSize: 18 }}>
            ({progress.toFixed(0)}% complete)
          </Text>
        </HStack>
        <Button
          action="secondary"
          style={{ backgroundColor: "white" }}
          onPress={() => setShowAddTaskModal(true)}
        >
          <ButtonIcon as={PlusIcon} />
          <ButtonText>Add Task</ButtonText>
        </Button>
      </HStack>
      <Progress value={progress} size="sm" orientation="horizontal">
        <ProgressFilledTrack />
      </Progress>

      <TaskAddModal
        visible={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
      />
    </>
  );
}
