import React from "react";
import { Text } from "react-native";
import { Box } from "./ui/box";
import { HStack } from "./ui/hstack";
import { useProject } from "@/context/projectContext";
import { Dot } from "lucide-react-native";
import { VStack } from "./ui/vstack";
import TaskCard from "./taskCard";

type OngoingTasksType = {
  projectID: string;
};

export default function OngoingTasks({ projectID }: OngoingTasksType) {
  const { tasks } = useProject();
  const currentProjectTasks = tasks.filter((t) => t.projectID === projectID);
  const AllOngoingTasks = currentProjectTasks.filter(
    (t) => t.status === "Ongoing"
  );

  const ongoingTasks = AllOngoingTasks.filter(
    (t) => t.end && t.end.toDate() > new Date()
  ).length;
  const overdueTasks = AllOngoingTasks.filter(
    (t) => t.end && t.end.toDate() < new Date()
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
            On Going
          </Text>
          <Box>
            <HStack style={{ alignItems: "center" }}>
              <Dot color={"green"} size={40} />
              <Text style={{ color: "white", fontSize: 15 }}>
                {ongoingTasks}
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
        }}
      >
        {AllOngoingTasks.length != 0 ? (
          <>
            {AllOngoingTasks.map((t) => (
              <TaskCard key={t.id} taskID={t.id} />
            ))}
          </>
        ) : (
          <>
            <Text style={{ color: "gray", fontWeight: "bold", fontSize: 20 }}>
              No Task
            </Text>
            <Text style={{ color: "gray", fontWeight: 600 }}>
              There is no Ongoing Task for now
            </Text>
          </>
        )}
      </Box>
    </VStack>
  );
}
