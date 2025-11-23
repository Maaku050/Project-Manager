import React, { useState } from "react";
import { Text } from "react-native";
import { useProject } from "@/context/projectContext";
import { Card } from "./ui/card";
import { VStack } from "./ui/vstack";
import { HStack } from "./ui/hstack";
import { Pressable } from "./ui/pressable";
import { Divider } from "./ui/divider";
import TasktUsers from "./taskAssignedUsers";
import { router } from "expo-router";
import { getDateLabel } from "@/helpers/getDateLabel";
import TaskStateButton from "./taskStateButton";

type TaskCardType = {
  taskID: string;
};

export default function TaskCard({ taskID }: TaskCardType) {
  const { tasks, setSelectedTask } = useProject();
  const [hoveredId, setHoveredId] = useState("");
  const currentTask = tasks.find((t) => t.id === taskID);
  if (!currentTask) {
    return (
      <Text style={{ color: "gray", fontStyle: "italic" }}>Task not found</Text>
    );
  }

  return (
    <Pressable
      style={{ width: "100%", marginBottom: 5 }}
      onHoverIn={() => setHoveredId(currentTask.id)}
      onHoverOut={() => setHoveredId("")}
      onPress={() => {
        router.push("/(screens)/taskWindow");
        setSelectedTask(currentTask.id);
      }}
    >
      <Card
        size="lg"
        className="p-5 w-full m-1"
        variant="outline"
        style={{
          backgroundColor: "#000000",
          borderRadius: 12,
          padding: 12,
          borderLeftWidth: 10,
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
          height: "100%", // ensures card fills container
          display: "flex",
          flexDirection: "column", // stack items vertically
        }}
      >
        <VStack
          style={{
            alignItems: "flex-start",
          }}
          space="md"
        >
          <Text
            style={{
              fontSize: 18,
              flexWrap: "wrap",
              color: "white",
              textDecorationLine:
                hoveredId === currentTask.id ? "underline" : "none",
              flex: 1,
            }}
          >
            {currentTask.title}
          </Text>

          <HStack
            style={{
              gap: 12,
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <HStack
              style={{
                gap: 10,
                alignItems: "center",
                borderWidth: 0,
              }}
            >
              <Text
                style={{
                  color:
                    currentTask.status === "To-do" &&
                    currentTask.start &&
                    currentTask.start.toDate() > new Date()
                      ? "white"
                      : currentTask.status === "To-do" &&
                          currentTask.start &&
                          currentTask.start.toDate() < new Date()
                        ? "#D76C1F"
                        : currentTask.status === "Ongoing" &&
                            currentTask.end &&
                            currentTask.end.toDate() > new Date()
                          ? "white"
                          : currentTask.status === "Ongoing" &&
                              currentTask.end &&
                              currentTask.end.toDate() < new Date()
                            ? "#B91C1C"
                            : currentTask.status === "CompleteAndOnTime"
                              ? "white"
                              : currentTask.status === "CompleteAndOverdue"
                                ? "#D76C1F"
                                : "red",
                  fontSize: 12,
                }}
              >
                {getDateLabel(
                  currentTask.status === "CompleteAndOnTime" ||
                    currentTask.status === "CompleteAndOverdue" ||
                    currentTask.status === "Ongoing"
                    ? currentTask.end
                    : currentTask.start,
                  currentTask.status === "CompleteAndOnTime" ||
                    currentTask.status === "CompleteAndOverdue" ||
                    currentTask.status === "Ongoing"
                    ? "due"
                    : "start"
                )}
              </Text>
              <Divider
                orientation="vertical"
                style={{ backgroundColor: "white", height: 25 }}
              />

              <TasktUsers taskID={currentTask.id} />
            </HStack>

            <TaskStateButton taskID={currentTask.id} from="taskCard" />
          </HStack>
        </VStack>
      </Card>
    </Pressable>
  );
}
