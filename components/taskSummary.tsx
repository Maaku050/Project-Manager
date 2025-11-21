import React from "react";
import { Text } from "react-native";
import { HStack } from "./ui/hstack";
import { Box } from "./ui/box";
import { useProject } from "@/context/projectContext";

type TaskSummaryType = {
  projectID: string;
};

export default function TaskSummary({ projectID }: TaskSummaryType) {
  const { tasks } = useProject();
  const currentProjectTasks = tasks.filter((t) => t.projectID === projectID);

  const todoTasks = currentProjectTasks.filter(
    (t) => t.status === "To-do"
  ).length;
  const ongoingTasks = currentProjectTasks.filter(
    (t) => t.status === "Ongoing"
  ).length;
  const completedTasks = currentProjectTasks.filter(
    (t) => t.status === "CompleteAndOnTime" || t.status === "CompleteAndOverdue"
  ).length;
  const overdueTasks = currentProjectTasks.filter(
    (t) => t.status === "Ongoing" && t.end && t.end.toDate() < new Date()
  ).length;

  return (
    <HStack space="md">
      {/* Todo */}
      <Box
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#171717",
          borderRadius: 12,
          height: 70,
          width: 100,
        }}
      >
        <Text style={{ color: "white", fontSize: 15 }}>{todoTasks}</Text>
        <Text style={{ color: "#CDCCCC", fontSize: 12 }}>Todo</Text>
      </Box>

      {/* Ongoing */}
      <Box
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#171717",
          borderRadius: 12,
          height: 70,
          width: 100,
        }}
      >
        <Text style={{ color: "#84D3A2", fontSize: 15 }}>{ongoingTasks}</Text>
        <Text style={{ color: "#84D3A2", fontSize: 12 }}>On Going</Text>
      </Box>

      {/* Overdue */}
      <Box
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#171717",
          borderRadius: 12,
          height: 70,
          width: 100,
        }}
      >
        <Text style={{ color: "#FCA5A5", fontSize: 15 }}>{overdueTasks}</Text>
        <Text style={{ color: "#FCA5A5", fontSize: 12 }}>Overdue</Text>
      </Box>

      {/* Complete */}
      <Box
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#171717",
          borderRadius: 12,
          height: 70,
          width: 100,
        }}
      >
        <Text style={{ color: "white", fontSize: 15 }}>{completedTasks}</Text>
        <Text style={{ color: "#CDCCCC", fontSize: 12 }}>Complete</Text>
      </Box>
    </HStack>
  );
}
