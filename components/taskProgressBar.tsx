import React from "react";
import { Text } from "react-native";
import { HStack } from "./ui/hstack";
import { useProject } from "@/context/projectContext";
import { Heading } from "./ui/heading";

type TaskProgressBarType = {
  projectID: string;
};

export default function TaskProgressBar({ projectID }: TaskProgressBarType) {
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
    <HStack style={{ alignItems: "center" }} space="sm">
      <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
        {currentTotalTasks} total tasks
      </Text>
      <Text style={{ color: "white", fontSize: 20 }}>
        ({progress.toFixed(0)}% complete)
      </Text>
    </HStack>
  );
}
