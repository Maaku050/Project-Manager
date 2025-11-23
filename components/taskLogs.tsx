import { useUser } from "@/context/profileContext";
import React from "react";
import { Text } from "react-native";
import { HStack } from "./ui/hstack";
import { Box } from "./ui/box";
import { Avatar, AvatarFallbackText } from "./ui/avatar";
import { Check, Play, Repeat, RotateCcw } from "lucide-react-native";
import { Timestamp } from "firebase/firestore";
import { timeAgo } from "@/helpers/timeAgoCalculator";

type TaskLogsType = {
  uid: string;
  text: string;
  createdAt: Timestamp;
};

export default function TaskLogs({ uid, text, createdAt }: TaskLogsType) {
  const { profiles } = useUser();
  const currentUser = profiles.find((t) => t.uid === uid);
  if (!currentUser) return;
  const isCreatedBy = text.trim().startsWith("created");
  const isStarted = text.trim().startsWith("started");
  const isUnstarted = text.trim().startsWith("unstarted");
  const isCompleted = text.trim().startsWith("completed");
  const isRestarted = text.trim().startsWith("restarted");

  return (
    <HStack style={{ justifyContent: "space-between", alignItems: "center" }}>
      <HStack style={{ alignItems: "center" }} space="sm">
        {isCreatedBy ? (
          <Avatar size="md">
            <AvatarFallbackText style={{ color: "white" }}>
              {currentUser.firstName}
            </AvatarFallbackText>
          </Avatar>
        ) : (
          <Box
            style={{
              padding: 10,
              borderRadius: "100%",
              backgroundColor: isCompleted ? "#206F3E" : "transparent",
              borderWidth: 1,
              borderColor: isStarted
                ? "#84D3A2"
                : isUnstarted
                  ? "#FECDAA"
                  : isRestarted
                    ? "#FCA5A5"
                    : "#206F3E",
            }}
          >
            {isStarted ? (
              <Play color={"#84D3A2"} size={20} />
            ) : isUnstarted ? (
              <Repeat color={"#FECDAA"} size={20} />
            ) : isCompleted ? (
              <Check color={"white"} size={20} />
            ) : isRestarted ? (
              <RotateCcw color={"#FCA5A5"} size={20} />
            ) : (
              ""
            )}
          </Box>
        )}
        <HStack style={{ alignItems: "center" }} space="xs">
          <Text
            style={{
              fontWeight: "bold",
              color: isCompleted
                ? "#84D3A2"
                : isRestarted
                  ? "#FCA5A5"
                  : "white",
            }}
          >
            {currentUser.firstName}
          </Text>
          <Text
            style={{
              color: isCompleted
                ? "#84D3A2"
                : isRestarted
                  ? "#FCA5A5"
                  : "white",
            }}
          >
            {text}
          </Text>
        </HStack>
      </HStack>

      <Text style={{ fontSize: 12, color: "#999" }}>
        {createdAt
          ? timeAgo(
              createdAt.seconds
                ? new Date(createdAt.seconds * 1000)
                : new Date(createdAt.toDate())
            )
          : ""}
      </Text>
    </HStack>
  );
}
