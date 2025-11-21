import React from "react";
import { Text } from "react-native";
import { Box } from "./ui/box";
import { HStack } from "./ui/hstack";
import { useProject } from "@/context/projectContext";
import { Dot } from "lucide-react-native";
import { VStack } from "./ui/vstack";
import TaskCard from "./taskCard";

type CompletedTasksType = {
  projectID: string;
};

export default function CompletedTasks({ projectID }: CompletedTasksType) {
  const { tasks } = useProject();
  const currentProjectTasks = tasks.filter((t) => t.projectID === projectID);
  const allCompletedTasks = currentProjectTasks
    .filter(
      (t) =>
        t.status === "CompleteAndOnTime" || t.status === "CompleteAndOverdue"
    )
    .sort((a, b) => {
      const aTime = a.completedAt ? a.completedAt.toDate().getTime() : Infinity;
      const bTime = b.completedAt ? b.completedAt.toDate().getTime() : Infinity;
      return aTime - bTime;
    });
  const completeAndOnTimeTasks = allCompletedTasks.filter(
    (t) => t.status === "CompleteAndOnTime"
  );
  const completeAndOverdueTasks = allCompletedTasks.filter(
    (t) => t.status === "CompleteAndOverdue"
  );

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
            Completed
          </Text>
          <Box>
            <HStack style={{ alignItems: "center" }}>
              <Dot color={"green"} size={40} />
              <Text style={{ color: "white", fontSize: 15 }}>
                {completeAndOnTimeTasks.length}
              </Text>
              <Dot color={"#D76C1F"} size={40} />
              <Text style={{ color: "white", fontSize: 15 }}>
                {completeAndOverdueTasks.length}
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
        {allCompletedTasks.length != 0 ? (
          <>
            {allCompletedTasks.map((t) => (
              <TaskCard key={t.id} taskID={t.id} />
            ))}
          </>
        ) : (
          <>
            <Text style={{ color: "gray", fontWeight: "bold", fontSize: 20 }}>
              No Task
            </Text>
            <Text style={{ color: "gray", fontWeight: 600 }}>
              There is no Completed Task for now
            </Text>
          </>
        )}
      </Box>
    </VStack>
  );
}
