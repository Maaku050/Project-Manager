import React, { useState } from "react";
import { Text } from "react-native";
import { useProject } from "@/context/projectContext";
import { Card } from "./ui/card";
import { VStack } from "./ui/vstack";
import { HStack } from "./ui/hstack";
import { Pressable } from "./ui/pressable";
import { Button, ButtonIcon, ButtonText } from "./ui/button";
import {
  Check,
  ChevronDown,
  GlobeIcon,
  Play,
  PlayIcon,
  Repeat,
  RotateCcw,
  SettingsIcon,
} from "lucide-react-native";
import { Divider } from "./ui/divider";
import TasktUsers from "./taskAssignedUsers";
import { Box } from "./ui/box";
import { router } from "expo-router";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { Menu, MenuItem, MenuItemLabel } from "./ui/menu";
import { getDateLabel } from "@/helpers/getDateLabel";
import {
  handleStartTask,
  handleUnstartTask,
  handleCompleteTask,
} from "@/helpers/taskStateHandler";

type TaskCardType = {
  taskID: string;
};

export default function TaskCard({ taskID }: TaskCardType) {
  const { tasks, setSelectedTask } = useProject();
  const [hoveredId, setHoveredId] = useState("");
  const [buttonHover, setButtonHover] = useState("");
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

            {currentTask.status === "To-do" ? (
              <Button
                variant={buttonHover === currentTask.id ? "solid" : "outline"}
                action="positive"
                size="sm"
                onHoverIn={() => setButtonHover(currentTask.id)}
                onHoverOut={() => setButtonHover("")}
                onPress={() => handleStartTask(currentTask.id)}
              >
                <ButtonIcon as={Play} color="white" />
                <ButtonText style={{ color: "white" }}>Start</ButtonText>
              </Button>
            ) : currentTask.status === "Ongoing" ? (
              <HStack space="xs">
                <Button
                  variant="solid"
                  action="positive"
                  size="sm"
                  onHoverIn={() => setButtonHover(currentTask.id)}
                  onHoverOut={() => setButtonHover("")}
                  onPress={() =>
                    handleCompleteTask(currentTask.id, currentTask.end)
                  }
                >
                  <ButtonIcon as={Check} color="white" />
                  <ButtonText style={{ color: "white" }}>Complete</ButtonText>
                </Button>
                <Menu
                  placement="top"
                  offset={5}
                  disabledKeys={["Settings"]}
                  trigger={({ ...triggerProps }) => {
                    return (
                      <Button
                        {...triggerProps}
                        variant="solid"
                        action="positive"
                        size="sm"
                        style={{ width: 10 }}
                      >
                        <ButtonText style={{ color: "white" }}>
                          <ChevronDown strokeWidth={2} />
                        </ButtonText>
                      </Button>
                    );
                  }}
                >
                  <MenuItem onPress={() => handleUnstartTask(currentTask.id)}>
                    <Repeat color={"#B45A1A"} />
                    <MenuItemLabel
                      size="md"
                      style={{
                        marginLeft: 10,
                        fontWeight: "bold",
                        color: "#B45A1A",
                      }}
                    >
                      Unstart
                    </MenuItemLabel>
                  </MenuItem>
                </Menu>
              </HStack>
            ) : currentTask.status === "CompleteAndOnTime" ||
              currentTask.status === "CompleteAndOverdue" ? (
              <Button
                variant={buttonHover === currentTask.id ? "solid" : "outline"}
                action="negative"
                size="sm"
                onHoverIn={() => setButtonHover(currentTask.id)}
                onHoverOut={() => setButtonHover("")}
                onPress={() => handleStartTask(currentTask.id)}
              >
                <ButtonIcon as={RotateCcw} color="white" />
                <ButtonText style={{ color: "white" }}>Restart</ButtonText>
              </Button>
            ) : (
              ""
            )}
          </HStack>
        </VStack>
      </Card>
    </Pressable>
  );
}
