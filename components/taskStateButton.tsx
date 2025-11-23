import { useProject } from "@/context/projectContext";
import {
  handleStartTask,
  handleCompleteTask,
  handleUnstartTask,
} from "@/helpers/taskStateHandler";
import {
  Play,
  Check,
  ChevronDown,
  Repeat,
  RotateCcw,
  Undo2,
} from "lucide-react-native";
import React, { useState } from "react";
import { Text } from "react-native";
import { ButtonIcon, ButtonText, Button } from "./ui/button";
import { HStack } from "./ui/hstack";
import { Menu, MenuItem, MenuItemLabel } from "./ui/menu";

type TaskStateButtonType = {
  taskID: string;
  from: string;
};

export default function TaskStateButton({ taskID, from }: TaskStateButtonType) {
  const { tasks } = useProject();
  const currentTask = tasks.find((t) => t.id === taskID);
  const [startButtonHover, setStartButtonHover] = useState("");
  const [unstartButtonHover, setUnstartButtonHover] = useState("");
  const [restartButtonHover, setRestartButtonHover] = useState("");
  if (!currentTask) return;

  return (
    <>
      {currentTask.status === "To-do" ? (
        <Button
          variant={startButtonHover === currentTask.id ? "solid" : "outline"}
          action="positive"
          size={from === "taskWindow" ? "md" : "sm"}
          onHoverIn={() => setStartButtonHover(currentTask.id)}
          onHoverOut={() => setStartButtonHover("")}
          onPress={() => handleStartTask(currentTask.id, true)}
        >
          <ButtonIcon as={Play} color="white" />
          <ButtonText style={{ color: "white" }}>Start</ButtonText>
        </Button>
      ) : currentTask.status === "Ongoing" ? (
        <>
          {from === "taskWindow" ? (
            <HStack space="md">
              <Button
                style={{
                  backgroundColor:
                    unstartButtonHover === currentTask.id
                      ? "#B45A1A"
                      : "#000000",
                  borderWidth: unstartButtonHover === currentTask.id ? 0 : 1,
                  borderColor: "#B45A1A",
                }}
                size="md"
                onHoverIn={() => setUnstartButtonHover(currentTask.id)}
                onHoverOut={() => setUnstartButtonHover("")}
                onPress={() => handleUnstartTask(currentTask.id)}
              >
                <ButtonIcon as={Undo2} color="white" />
                <ButtonText style={{ color: "white" }}>Unstart</ButtonText>
              </Button>

              <Button
                variant="solid"
                action="positive"
                size="md"
                onPress={() =>
                  handleCompleteTask(currentTask.id, currentTask.end)
                }
              >
                <ButtonIcon as={Check} color="white" />
                <ButtonText style={{ color: "white" }}>Complete</ButtonText>
              </Button>
            </HStack>
          ) : (
            <HStack space="xs">
              <Button
                variant="solid"
                action="positive"
                size={from === "taskWindow" ? "md" : "sm"}
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
          )}
        </>
      ) : currentTask.status === "CompleteAndOnTime" ||
        currentTask.status === "CompleteAndOverdue" ? (
        <Button
          variant={restartButtonHover === currentTask.id ? "solid" : "outline"}
          action="negative"
          size={from === "taskWindow" ? "md" : "sm"}
          onHoverIn={() => setRestartButtonHover(currentTask.id)}
          onHoverOut={() => setRestartButtonHover("")}
          onPress={() => handleStartTask(currentTask.id, false)}
        >
          <ButtonIcon as={RotateCcw} color="white" />
          <ButtonText style={{ color: "white" }}>Restart</ButtonText>
        </Button>
      ) : (
        ""
      )}
    </>
  );
}
