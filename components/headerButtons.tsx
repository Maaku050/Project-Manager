import React from "react";
import { Pressable, Text } from "react-native";
import { HStack } from "./ui/hstack";
import { ArrowLeft, Folder, House, LayoutDashboard } from "lucide-react-native";
import { router } from "expo-router";

type HeaderButtonType = {
  screen: string;
};

export default function HeaderButtons({ screen }: HeaderButtonType) {
  return (
    <>
      {screen === "home" ? (
        <HStack style={{ alignItems: "center", marginLeft: 20 }} space="sm">
          <House color={"white"} />
          <Text style={{ color: "white", fontSize: 20 }}>Home</Text>
        </HStack>
      ) : screen === "dashboard" ? (
        <HStack style={{ alignItems: "center", marginLeft: 20 }} space="sm">
          <LayoutDashboard color={"white"} />
          <Text style={{ color: "white", fontSize: 20 }}>Dashboard</Text>
        </HStack>
      ) : screen === "project" ? (
        <HStack style={{ alignItems: "center", marginLeft: 20 }} space="sm">
          <Folder color={"white"} />
          <Text style={{ color: "white", fontSize: 20 }}>Projects</Text>
        </HStack>
      ) : screen === "projectWindow" ? (
        <Pressable onPress={() => router.replace("/(screens)/project")}>
          <HStack style={{ alignItems: "center", marginLeft: 20 }} space="sm">
            <ArrowLeft color={"white"} />
            <Text style={{ color: "white", fontSize: 20 }}>Project Details</Text>
          </HStack>
        </Pressable>
      ) : screen === "taskWindow" ? (
        <Pressable onPress={() => router.replace("/(screens)/projectWindow")}>
          <HStack style={{ alignItems: "center", marginLeft: 20 }} space="sm">
            <ArrowLeft color={"white"} />
            <Text style={{ color: "white", fontSize: 20 }}>Task Details</Text>
          </HStack>
        </Pressable>
      ) : screen === "employee" ? (
        <HStack style={{ alignItems: "center", marginLeft: 20 }} space="sm">
          <Folder color={"white"} />
          <Text style={{ color: "white", fontSize: 20 }}>Employees</Text>
        </HStack>
      ) : screen === "employee-window" ? (
        <Pressable onPress={() => router.push("/(screens)/employee")}>
          <HStack style={{ alignItems: "center", marginLeft: 20 }} space="sm">
            <ArrowLeft color={"white"} />
            <Text style={{ color: "white", fontSize: 20 }}>Employee Profile</Text>
          </HStack>
        </Pressable>
      ) : (
        ""
      )}
    </>
  );
}
