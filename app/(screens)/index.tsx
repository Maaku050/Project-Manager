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
} from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { SquarePen } from "lucide-react-native";
import ProfileEditModal from "@/modals/profileEditModal";

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

    const ongoingTasks = currentProjectTasks.filter(
      (t) => t.status === "Ongoing"
    );

    const completedTasks = currentProjectTasks.filter(
      (t) => t.status === "Completed"
    );

    const totalTasks = currentProjectTasks.length;

    const progress =
      ((ongoingTasks.length * 0.5 + completedTasks.length * 1) / totalTasks) *
      100;

    return progress;
  };

  return (
    <ScrollView style={{ backgroundColor: "#000000ff" }}>
      <Box
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
      </Box>

      <View
        style={{
          alignItems: "center",
          marginLeft: isLargeScreen ? 80 : isMediumScreen ? 40 : 12,
          marginRight: isLargeScreen ? 80 : isMediumScreen ? 40 : 12,
          marginTop: isLargeScreen ? 8 : 4,
          paddingTop: 40,
          paddingBottom: 40,
          borderRadius: 12,
          backgroundColor: "#1F1F1F",
        }}
      >
        <Box
          style={{
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: isLargeScreen ? 25 : 20,
              color: "white",
              fontWeight: "bold",
              fontFamily: "roboto, arial",
            }}
          >
            {profile
              ? profile.firstName +
                ' "' +
                profile.nickName +
                '" ' +
                profile.lastName
              : ""}
          </Text>
        </Box>
        <Box
          style={{
            borderWidth: 0,
            marginBottom: 20,
          }}
        >
          <Avatar size="2xl">
            <AvatarFallbackText>Jane Doe</AvatarFallbackText>
            <AvatarImage
              source={{
                uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
              }}
            />
            <AvatarBadge />
          </Avatar>
        </Box>
        <Box>
          <Text
            style={{
              fontSize: isLargeScreen ? 16 : 12,
              color: "white",
              fontWeight: "bold",
              fontFamily: "roboto, arial",
            }}
          >
            {profile?.role}{" "}
          </Text>
        </Box>
      </View>

      <View
        style={{
          marginLeft: isLargeScreen ? 80 : isMediumScreen ? 40 : 12,
          marginRight: isLargeScreen ? 80 : isMediumScreen ? 40 : 12,
          marginTop: 20,
          backgroundColor: "#1F1F1F",
          borderRadius: 12,
          flex: 1,
        }}
      >
        <Box
          style={{
            marginTop: 20,
            marginBottom: 12,
            marginLeft: 20,
            flex: 1,
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
            justifyContent: isLargeScreen
              ? "flex-start"
              : isMediumScreen
              ? "flex-start"
              : "center", // create another condition for justifyContent
            alignItems: isLargeScreen
              ? "flex-start"
              : isMediumScreen
              ? "flex-start"
              : "center", // create another condition for alignItems
            flexDirection: isLargeScreen
              ? "row"
              : isMediumScreen
              ? "row"
              : "column",
            flexWrap: "wrap",
            paddingLeft: isLargeScreen ? 20 : isMediumScreen ? 120 : 0,
            paddingBottom: isLargeScreen ? 20 : isMediumScreen ? 12 : 32,
            paddingRight: isLargeScreen ? 20 : isMediumScreen ? 0 : 0,
          }}
        >
          {myProject.map((t) => (
            <Card
              variant="outline"
              className="m-3"
              key={t.id}
              style={{
                width: isLargeScreen ? "30%" : isMediumScreen ? "40%" : "90%",
                marginBottom: 0,
                marginRight: -2,
                marginLeft: 12,
                paddingTop: 12,
                paddingLeft: isLargeScreen ? 12 : isMediumScreen ? 20 : 8,
                paddingRight: 12,
                paddingBottom: 32,
                height: isLargeScreen ? 140 : isMediumScreen ? 180 : 120,
                backgroundColor: "white",
                borderRadius: isLargeScreen ? 12 : isMediumScreen ? 12 : 8,
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
                    textDecorationLine:
                      hoveredId === t.id ? "underline" : "none",
                  }}
                >
                  {t.title}
                </Heading>
              </Pressable>
              <HStack>
                <Box style={{ flex: 1, borderWidth: 0 }}>
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
                </Box>
                <Box
                  style={{
                    flex: 1,
                    borderWidth: 0,
                  }}
                >
                  <HStack style={{ justifyContent: "flex-end" }}>
                    {profiles
                      .filter((p) =>
                        assignedUser.some(
                          (a) => a.projectID === t.id && a.uid === p.uid
                        )
                      )
                      .map((t) => {
                        return (
                          <Avatar size="sm" key={t.id}>
                            <AvatarFallbackText>
                              {t.firstName}
                            </AvatarFallbackText>

                            <AvatarBadge />
                          </Avatar>
                        );
                      })}
                  </HStack>
                </Box>
              </HStack>
            </Card>
          ))}
        </Box>
      </View>

      <ProfileEditModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </ScrollView>
  );
}
