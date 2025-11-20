import React from "react";
import { Text } from "react-native";
import { Box } from "./ui/box";
import { HStack } from "./ui/hstack";
import { useProject } from "@/context/projectContext";
import { Dot } from "lucide-react-native";
import { VStack } from "./ui/vstack";

type TodoTasksType = {
  projectID: string;
};

export default function TodoTasks({ projectID }: TodoTasksType) {
  const { tasks } = useProject();
  const currentProjectTasks = tasks.filter((t) => t.projectID === projectID);
  const todoTasks = currentProjectTasks.filter((t) => t.status === "To-do");
  const overdueTasks = currentProjectTasks.filter(
    (t) => t.end && t.end.toDate() < new Date() && ["To-do"].includes(t.status)
  ).length;

  return (
    <VStack style={{ flex: 1 }}>
      <Box
        style={{
          backgroundColor: "#171717",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          paddingTop: 10,
          paddingRight: 15,
          paddingLeft: 15,
        }}
      >
        <HStack
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>
            To Do
          </Text>
          <Box>
            <HStack style={{ alignItems: "center" }}>
              <Dot color={"green"} size={40} />
              <Text style={{ color: "white", fontSize: 15 }}>
                {todoTasks.length}
              </Text>
              <Dot color={"red"} size={40} />
              <Text style={{ color: "white", fontSize: 15 }}>
                {overdueTasks}
              </Text>
            </HStack>
          </Box>
        </HStack>
      </Box>
      <Box
        style={{
          backgroundColor: "#171717",
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          paddingBottom: 10,
          paddingRight: 15,
          paddingLeft: 15,
          borderWidth: 0,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <Text style={{ color: "gray", fontWeight: "bold", fontSize: 20 }}>
          No Task
        </Text>
        <Text style={{ color: "gray", fontWeight: 600 }}>
          There is no To Do Task for now
        </Text>
      </Box>
    </VStack>
  );
}
