import React, { useEffect, useState } from "react";
import { Box } from "@/components/ui/box";
import { Pressable, ScrollView, useWindowDimensions } from "react-native";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { View } from "@/components/Themed";
import { useUser } from "@/context/profileContext";
import { useProject } from "@/context/projectContext";
import { HStack } from "@/components/ui/hstack";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { LogOut, SquarePen } from "lucide-react-native";
import { House } from "lucide-react-native";
import ProfileEditModal from "@/modals/profileEditModal";
import LogoutModal from "@/modals/logoutModal";
import AppMessage from "@/components/AppMessage";
import { Divider } from "@/components/ui/divider";
import { StyleSheet } from "nativewind";
import ProjectCard from "@/components/projectCard";
import TaskCard from "@/components/taskCard";

export default function Home() {
  const router = useRouter();
  const { user, profile, profiles } = useUser();
  const { project, assignedUser, setSelectedProject, tasks } = useProject();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 1280; // computer UI condition
  const isMediumScreen = dimensions.width <= 1280 && dimensions.width > 768; // tablet UI condition

  const currentUserProjects = project.filter((p) =>
    assignedUser.some((a) => p.id === a.projectID && a.uid === profile?.uid)
  );

  const userTask = tasks.filter((t) =>
    assignedUser.some((a) => t.id === a.taskID && a.uid === profile?.uid)
  );
  useEffect(() => {
    console.log("Home current user projects: ", currentUserProjects);
  }, []);

  const myProject = project.filter((p) =>
    assignedUser.some((a) => a.projectID === p.id && a.uid === profile?.uid)
  );

  const myTask = tasks.filter((p) =>
    assignedUser.some((a) => a.taskID === p.id && a.uid === profile?.uid)
  );

  const taskMessage = myTask.length === 0;
  const projectMassage = myProject.length === 0;

  const myOngoingTask = myTask.filter((t) => t.status === "Ongoing" || t.status === "Pending");
  const myOverBueTask = myTask.filter((t) => t.status !== "Ongoing" && t.status !== "Completed");

  return (
    <ScrollView contentContainerStyle={{ padding: 24, backgroundColor: "black" }}>
      {/* -----------------------------------Top Group---------------------------------------- */}
      <HStack
        style={{
          gap: 16,
          borderWidth: 0,
          borderColor: "blue",
          flex: 1,
          // height: "30%"
        }}
      >
        {/* ---------------------------------------user Frame----------------------------------- */}

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 12,
            ...styles.borderColor,
            backgroundColor: "#000000ff",
            gap: 24,
            flex: 2,
            overflow: "hidden",
          }}
        >
          {/* -----------------------glow top------------------------ */}
          <Box
            style={{
              ...styles.ShadowBox,
              position: "absolute",
              top: -68,
              right: 150,
            }}
          ></Box>

          {/* ----------------------edit icon------------------------ */}
          <Box
            style={{
              position: "absolute",
              top: 12,
              right: 12,
            }}
          >
            <Button onPress={() => setShowEditModal(true)} className="bg-transparent">
              <ButtonText>
                <SquarePen color={"white"} />
              </ButtonText>
            </Button>
          </Box>

          {/* ------------------messages ----------------------- */}
          <Box>
            <AppMessage userId={profile?.uid} />
          </Box>

          {/* --------------------------avatar----------------------------- */}
          <Box
            style={{
              borderWidth: 0,
            }}
          >
            <Avatar size="2xl">
              <AvatarFallbackText>{profile?.firstName}</AvatarFallbackText>
            </Avatar>
          </Box>

          {/* ---------------------------name and role-------------------------------------- */}

          <Box style={{ justifyContent: "center", alignItems: "center", gap: 8, borderWidth: 0 }}>
            <Text
              style={{
                fontSize: isLargeScreen ? 20 : isMediumScreen ? 20 : 12,
                color: "white",
                fontWeight: "bold",
                fontFamily: "roboto, arial",
              }}
            >
              {profile ? profile.firstName + " " + profile.lastName : ""}
            </Text>
            <Text
              style={{
                fontSize: isLargeScreen ? 14 : isMediumScreen ? 14 : 12,
                color: "white",
                fontWeight: "semibold",
                fontFamily: "roboto, arial",
              }}
            >
              {profile?.role.toUpperCase()}{" "}
            </Text>
          </Box>

          {/* ---------------------glow from bottom---------------------------- */}
          <Box
            style={{
              ...styles.ShadowBox,
              position: "absolute",
              left: 150,
              bottom: -70,
              borderRadius: 8,
            }}
          ></Box>
        </View>

        {/* ----------------------------------------------------task area-------------------------------------------- */}
        <VStack
          style={{
            flex: 1,
            padding: 20,
            backgroundColor: "#171717",
            borderWidth: 0,
            gap: 24,
          }}
          className="rounded-xl"
        >
          <HStack
            style={{
              borderWidth: 0,
              alignItems: "stretch",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontFamily: "roboto, arial",
                fontSize: 20,
                fontWeight: "bold",
                color: "white",
              }}
            >
              My Task
            </Text>

            <HStack style={{ gap: 12 }}>
              <HStack style={{ flex: 1, gap: 8, justifyContent: "center", alignItems: "center" }}>
                <Divider
                  style={{ borderWidth: 4, borderRadius: 50, borderColor: "green", width: 1 }}
                />
                <Text style={{ color: "white", fontSize: 16 }}>{myOngoingTask.length}</Text>
              </HStack>
              <HStack style={{ flex: 1, gap: 8, justifyContent: "center", alignItems: "center" }}>
                <Divider
                  style={{ borderWidth: 4, borderRadius: 50, borderColor: "red", width: 1 }}
                />
                <Text style={{ color: "white", fontSize: 16 }}>{myOverBueTask.length}</Text>
              </HStack>
            </HStack>
          </HStack>

          <ScrollView
            contentContainerStyle={{
              borderWidth: 0,
              flexGrow: 1,
              alignItems: "flex-start",
              padding: 8,
            }}
            style={{
              maxHeight: 400,
            }}
            showsVerticalScrollIndicator={false}
          >
            {taskMessage ? (
              <Box style={{ borderWidth: 0, flex: 1, width: "100%", justifyContent: "center" }}>
                <Text style={{ fontSize: 20, ...styles.messageFont }} className="text-white">
                  No Task
                </Text>
                <Text
                  style={{ ...styles.messageFont, marginTop: 4, fontSize: 14 }}
                  className="text-white"
                >
                  There is no Task for now
                </Text>
              </Box>
            ) : (
              userTask.map((t) => <TaskCard taskID={t.id} />)
            )}
          </ScrollView>
        </VStack>
      </HStack>
      {/* ----------------------------------------------------top view END------------------------------------------------- */}

      {/* ----------------------------------------------------project view------------------------------------------------------ */}
      <Box
        style={{
          marginTop: 16,
          backgroundColor: "#171717",
          borderRadius: 12,
          borderWidth: 0,
          borderColor: "red",
          padding: 28,
          gap: 28,
          flex: 1,
        }}
      >
        <Box
          style={{
            borderWidth: 0,
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <Text
            style={{
              fontSize: isLargeScreen ? 24 : 20,
              color: "white",
              fontWeight: "bold",
              fontFamily: "roboto, arial",
              borderWidth: 0,
            }}
          >
            My Project
          </Text>
        </Box>
        <Box
          style={{
            justifyContent: myProject ? "flex-start" : "center",
            flexDirection: isLargeScreen ? "row" : isMediumScreen ? "row" : "column",
            flexWrap: "wrap",
            borderWidth: 0,
            gap: 16,
            flex: 1,
          }}
        >
          {projectMassage ? (
            <View style={{ backgroundColor: "transparent", alignSelf: "center", flexGrow: 1 }}>
              <Text
                style={{
                  ...styles.messageFont,
                  fontSize: 20,
                }}
              >
                No Project yet
              </Text>
              <Text style={{ ...styles.messageFont, fontSize: 14, marginTop: 4 }}>
                There is no Project yet
              </Text>
            </View>
          ) : (
            myProject.map((item) => <ProjectCard projectID={item.id} />)
          )}
          ;
        </Box>
      </Box>

      <ProfileEditModal visible={showEditModal} onClose={() => setShowEditModal(false)} />
    </ScrollView>
  );
}

export function HeaderUserEmail() {
  const { profile } = useUser();
  const [isLogoutPress, setIsLogoutPress] = useState(false);

  return (
    <>
      <HStack style={{ alignItems: "center", marginRight: 20 }}>
        <VStack style={{ alignItems: "flex-end", marginRight: 20 }}>
          <Text style={{ color: "white", fontSize: 12 }}>
            {profile?.firstName} {profile?.lastName}
          </Text>
          <Text style={{ color: "white", fontSize: 12 }}>{profile?.email}</Text>
        </VStack>
        <Pressable onPress={() => setIsLogoutPress(true)}>
          <LogOut color={"white"} />
        </Pressable>
      </HStack>

      <LogoutModal visible={isLogoutPress} onClose={() => setIsLogoutPress(false)} />
    </>
  );
}

export function HomeTitle() {
  return (
    <HStack style={{ gap: 12, justifyContent: "center", alignItems: "center", padding: 8 }}>
      <House size={30} color={"white"} />
      <Text size="2xl" className="font-simibold color-white">
        Home
      </Text>
    </HStack>
  );
}

const colors = [
  "#0B7C36",
  "#EAB308",
  "#A21CAF",
  "#0369A1",
  "#AF1C1E",
  "#FFFFFF",
  "#17C3A6",
  "#7B0C0C",
  "#56C820",
  "#6F5F20",
];
const randomCL = Math.floor(Math.random() * colors.length);

const styles = StyleSheet.create({
  ShadowBox: {
    // zIndex: -1,
    boxShadow: "0px 0px 200px 70px" + colors[randomCL],
    overflow: "visible",
  },

  borderColor: {
    borderWidth: 1,
    borderColor: colors[randomCL],
  },

  messageFont: {
    justifyContent: "center",
    alignSelf: "center",
    fontWeight: "semibold",
    color: "#8B8B8B",
  },
});
