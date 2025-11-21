import React, { useEffect, useState } from "react";
import { Box } from "@/components/ui/box";
import { Pressable, ScrollView, useWindowDimensions } from "react-native";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { View } from "@/components/Themed";
import { useUser } from "@/context/profileContext";
import { useProject } from "@/context/projectContext";
import { HStack } from "@/components/ui/hstack";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  AvatarBadge,
  AvatarGroup,
} from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { LogOut, SquarePen } from "lucide-react-native";
import ProfileEditModal from "@/modals/profileEditModal";
import LogoutModal from "@/modals/logoutModal";
import { green } from "react-native-reanimated/lib/typescript/Colors";

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

  useEffect(() => {
    console.log("Home current user projects: ", currentUserProjects);
  }, []);

  const myProject = project.filter((p) =>
    assignedUser.some((a) => a.projectID === p.id && a.uid === profile?.uid)
  );

  const progressCalculation = (projectID: string) => {
    const currentProjectTasks = tasks.filter((t) => t.projectID === projectID);
    // const ongoingTasks = currentProjectTasks.filter(
    //     (t) => t.status === "Ongoing"
    //   );

    // const completedTasks = currentProjectTasks.filter(
    //     (t) => t.status === "Completed"
    //   );

    const currentStateOfProject = project.find((p) => p.id === projectID);
    if (currentStateOfProject?.status === "Ongoing") {
      return "Ongoing";
    } else if (currentStateOfProject?.status === "Completed") {
      return "Completed";
    } else if (currentStateOfProject?.status === "Pending") {
      return "Pending";
    } else {
      return 0;
    }

    // const totalTasks = currentProjectTasks.length;

    // const progress =
    //   ((ongoingTasks.length * 0.5 + completedTasks.length * 1) / totalTasks) *
    //   100;

    // return progress;
  };

  return (
    <ScrollView
      className="bg-black shadow-md flex-1"
      // style={{ backgroundColor: "#000000ff" }}
    >
      {/* <Box
        style={{
          marginTop: 20,
          marginLeft: isLargeScreen ? 80 : isMediumScreen ? 40 : 12,
          marginRight: isLargeScreen ? 80 : isMediumScreen ? 40 : 12,
          padding: 10,
          borderRadius: 12,
          backgroundColor: "#1F1F1F",
          height: isLargeScreen ? 60 : 50,
        }}
      >
        <HStack
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: isLargeScreen ? 20 : 16,
              color: "white",
              fontWeight: "bold",
              fontFamily: "roboto, arial",
            }}
          >
            Welcome Home, {profile ? profile.nickName : ""}!
          </Text>
          <Button onPress={() => setShowEditModal(true)}>
            <ButtonText>
              <SquarePen color={"white"} />
            </ButtonText>
          </Button>
        </HStack>
      </Box> */}

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginLeft: isLargeScreen ? 24 : isMediumScreen ? 24 : 12,
          marginRight: isLargeScreen ? 24 : isMediumScreen ? 24 : 12,
          marginTop: isLargeScreen ? 24 : 12,
          paddingTop: 28,
          paddingBottom: 28,
          borderRadius: 12,
          borderWidth: 0,
          minHeight: 400,
          maxHeight: 600,
          borderColor: "#ffffff",
          backgroundColor: "#1F1F1F",
        }}
      >
        <Box
          style={{
            position: "absolute",
            top: 12,
            right: 12,
          }}
        >
          <Button onPress={() => setShowEditModal(true)}>
            <ButtonText>
              <SquarePen color={"white"} />
            </ButtonText>
          </Button>
        </Box>

        <Box
          style={{
            marginTop: 20,
            marginBottom: 20,
            borderWidth: 0,
          }}
        >
          <Text
            style={{
              fontSize: isLargeScreen ? 32 : isMediumScreen ? 24 : 20,
              color: "white",
              fontWeight: "bold",
              fontFamily: "roboto, arial",
            }}
          >
            {profile ? profile.firstName + ' "' + profile.nickName + '" ' + profile.lastName : ""}
          </Text>
        </Box>
        <Box
          style={{
            borderWidth: 0,
            marginTop: isLargeScreen ? 32 : isMediumScreen ? 20 : 12,
          }}
        >
          <Avatar size="2xl">
            <AvatarFallbackText>{profile?.firstName}</AvatarFallbackText>
            {/* <AvatarImage
              source={{
                uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
              }}
            /> */}
            {/* <AvatarBadge /> */}
          </Avatar>
        </Box>
        <Box>
          <Text
            style={{
              fontSize: isLargeScreen ? 20 : isMediumScreen ? 16 : 12,
              marginTop: isLargeScreen ? 32 : isMediumScreen ? 20 : 12,
              color: "white",
              fontWeight: "bold",
              fontFamily: "roboto, arial",
            }}
          >
            {profile?.role.toUpperCase()}{" "}
          </Text>
        </Box>
      </View>

      <View
        style={{
          marginLeft: isLargeScreen ? 24 : isMediumScreen ? 24 : 12,
          marginRight: isLargeScreen ? 24 : isMediumScreen ? 24 : 12,
          marginTop: 16,
          backgroundColor: "#1F1F1F",
          borderRadius: 12,
          minHeight: 400,
          maxHeight: "100%",
          flex: 1,
          padding: 28,
          gap: 28,
        }}
      >
        <Box
          style={{
            borderWidth: 0,
            // flex: 1,
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
              flex: 1,
            }}
          >
            My Project
          </Text>
        </Box>
        <Box
          style={{
            justifyContent: isLargeScreen ? "flex-start" : isMediumScreen ? "flex-start" : "center",
            flexDirection: isLargeScreen ? "row" : isMediumScreen ? "row" : "column",
            flexWrap: "wrap",
            borderWidth: 0,
            gap: 0,
          }}
        >
          {myProject.map((t) => (
            <Card
              variant="outline"
              className="m-3 bg-black"
              key={t.id}
              style={{
                flexBasis: isLargeScreen ? "31.5%" : isMediumScreen ? "47%" : "auto",
                minHeight: 120,
                padding: 12,
                margin: 8,
                borderRadius: isLargeScreen ? 12 : isMediumScreen ? 12 : 8,
                justifyContent: "space-between",
                borderColor:
                  t.status === "Ongoing"
                    ? "#2f9c46ff"
                    : t.status === "Completed"
                      ? "#3b82f6ff"
                      : t.status === "Pending"
                        ? "#6b7280ff"
                        : "#ffffff",
                borderWidth: 1,
                borderLeftWidth: 8,
              }}
            >
              <Pressable
                onPress={() => {
                  setSelectedProject(t.id);
                  router.push("/projectWindow"); // or open modal directly
                }}
                onHoverIn={() => setHoveredId(t.id)}
                onHoverOut={() => setHoveredId(null)}
              >
                <Heading
                  size="md"
                  className="mb-1"
                  style={{
                    textDecorationLine: hoveredId === t.id ? "underline" : "none",
                    color: "white",
                  }}
                >
                  {t.title}
                </Heading>
              </Pressable>
              <HStack>
                {/* <Box style={{ flex: 1, borderWidth: 0 }}>
                  <VStack>
                    <Text style={{ color: "black" }}>
                      {progressCalculation(t.id).toFixed(0)}%
                    </Text>
                    <Progress
                      value={progressCalculation(t.id)}
                      size="xs"
                      orientation="horizontal"
                    >
                      <ProgressFilledTrack />
                    </Progress>
                  </VStack>
                </Box> */}

                <Box
                  style={{
                    borderWidth: 1,
                    padding: 4,
                    borderRadius: 4,
                    minWidth: 80,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className="bg-white"
                >
                  <Text
                    style={{
                      color:
                        t.status === "Ongoing"
                          ? "#2f9c46ff"
                          : t.status === "Completed"
                            ? "#3b82f6ff"
                            : t.status === "Pending"
                              ? "#6b7280ff"
                              : "#ffffff",
                      fontSize: 12,
                      fontFamily: "roboto, arial",
                    }}
                    className="typography-regular"
                  >
                    {progressCalculation(t.id).toString().toUpperCase()}
                  </Text>
                </Box>

                <Box
                  style={{
                    flex: 1,
                    borderWidth: 0,
                  }}
                >
                  <HStack style={{ justifyContent: "flex-end" }}>
                    <AvatarGroup style={{ gap: 20 }}>
                      {profiles
                        .filter((p) =>
                          assignedUser.some((a) => a.projectID === t.id && a.uid === p.uid)
                        )
                        .map((t) => {
                          return (
                            <Avatar size="sm" key={t.id}>
                              <AvatarFallbackText>{t.firstName}</AvatarFallbackText>

                              {/* <AvatarBadge /> */}
                            </Avatar>
                          );
                        })}
                    </AvatarGroup>
                  </HStack>
                </Box>
              </HStack>
            </Card>
          ))}
        </Box>
      </View>

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
