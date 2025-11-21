import React, { useEffect, useState } from "react";
import { View, Text, useWindowDimensions, Pressable, StyleSheet } from "react-native";
import { useUser } from "@/context/profileContext";
import { useProject } from "@/context/projectContext";

import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import { Avatar, AvatarFallbackText, AvatarBadge } from "@/components/ui/avatar";
import { Divider } from "@/components/ui/divider";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { router, useLocalSearchParams, useRouter } from "expo-router";
// import { Pressable } from "@/components/ui/pressable";
import { Icon, ArrowLeftIcon } from "@/components/ui/icon";
// import { Route } from "expo-router/build/Route";
// import { Center } from "@/components/ui/center";
// import { useHover } from "@gluestack-ui/utils/aria";
import { ScrollView } from "react-native-gesture-handler";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Grid, GridItem } from "@/components/ui/grid";

export default function EmployeeWindow() {
  const { profiles } = useUser();
  console.log("🚀 ~ EmployeeWindow ~ profiles:", profiles);
  const { id } = useLocalSearchParams();
  const { project, assignedUser, setSelectedProject, tasks } = useProject();

  const progressCalculation = (projectID: string) => {
    const currentProjectTasks = tasks.filter((t) => t.projectID === projectID);

    const ongoingTasks = currentProjectTasks.filter((t) => t.status === "Ongoing");

    const completedTasks = currentProjectTasks.filter((t) => t.status === "Completed");

    const totalTasks = currentProjectTasks.length;

    const progress = ((ongoingTasks.length * 0.5 + completedTasks.length * 1) / totalTasks) * 100;

    return progress;
  };

  const currentUser = profiles.find((t) => t.uid === id);
  console.log("🚀 ~ EmployeeWindow ~ currentUser:", currentUser);

  const currentUserProjects = project.filter((p) =>
    assignedUser.some((a) => p.id === a.projectID && a.uid === currentUser?.uid)
  );
  console.log("🚀 ~ EmployeeWindow ~ currentUserProjects:", currentUserProjects);

  const onProgressProject = currentUserProjects.filter(
    (p) => p.status === "Pending" || p.status === "Ongoing"
  );
  const onCompleteProject = currentUserProjects.filter(
    (p) => p.status === "Complete" || p.status === "Completed"
  );

  const [cardIdHover, setCardIdHover] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const truncateWords = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
  };

  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 1280;
  const isMediumScreen = dimensions.width <= 1280 && dimensions.width > 768;

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#000000ff",
        paddingTop: 0,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 40,
      }}
    >
      <VStack
        style={{
          borderWidth: 0,
          borderColor: "red",
          minHeight: "100%",
          padding: 12,
          gap: isLargeScreen ? 16 : isMediumScreen ? 12 : 8,
        }}
      >
        <Box
          style={{
            backgroundColor: "transparent",
            justifyContent: "center",
            padding: 12,
            borderWidth: 0,
            gap: 20,
          }}
        >
          <Card style={{ backgroundColor: "transparent" }}>
            <Pressable onPress={() => router.push("/(screens)/employee")}>
              <HStack style={{ alignItems: "center" }}>
                <Icon
                  as={ArrowLeftIcon}
                  className="text-typography-500 w-7 h-7 "
                  color="#ffffffff"
                />
                <Text style={{ fontSize: 23, fontWeight: "bold", color: "#ffffffff" }}>Back</Text>
              </HStack>
            </Pressable>

            <HStack style={{ alignItems: "center" }}>
              <Avatar size="2xl" style={{ marginRight: 15 }}>
                <AvatarFallbackText>{`${currentUser?.firstName}${currentUser?.lastName}`}</AvatarFallbackText>
              </Avatar>
              <VStack style={{ gap: 4 }}>
                <HStack style={{ alignItems: "center" }}>
                  <Text style={{ color: "white", fontSize: 24, fontWeight: 800 }}>
                    {currentUser?.firstName} {`"${currentUser?.nickName}"`} {currentUser?.lastName}
                  </Text>
                  <Divider orientation="vertical" className="mx-2 h-[32px] bg-[#414141]" />
                  <Text style={{ color: "white", fontSize: 20, fontWeight: 400 }}>
                    {currentUser?.role}
                  </Text>
                </HStack>
                <Text style={{ color: "white", fontSize: 20, fontWeight: 400 }}>
                  {currentUser?.email}
                </Text>
              </VStack>
            </HStack>
          </Card>

          <Text style={{ color: "white", fontSize: 20, fontWeight: 500 }}>
            Project Collaborated ({currentUserProjects.length} Total Projects)
          </Text>

          <Card style={{ backgroundColor: "#171717" }}>
            <Grid _extra={{ className: "grid-cols-3 gap-4" }}>
              {currentUserProjects.reduce((acc: React.ReactNode[], t) => {
                if (t.status === "Overdue") {
                  acc.push(
                    <GridItem key={t.id} _extra={{ className: "col-span-1" }}>
                      <Pressable
                      // onPress={() => {
                      //   router.push(`/(screens)/employee/${t.uid}`);
                      // }}
                      >
                        <Card
                          style={{
                            backgroundColor: "#000000",
                            borderColor: "#1D4ED8",
                            borderRightWidth: 1,
                            borderBottomWidth: 1,
                            borderLeftWidth: 8,
                            borderTopWidth: 1,
                          }}
                        >
                          {/* <HStack style={{ alignItems: "center" }}>
                            <Avatar size="md" style={{ marginRight: 15 }}>
                              <AvatarFallbackText>{`${t.firstName}${t.lastName}`}</AvatarFallbackText>
                            </Avatar>{" "}
                            <VStack>
                              <Text style={{ color: "white", fontSize: 16, fontWeight: 600 }}>
                                {t.firstName} {`"${t.nickName}"`} {t.lastName}
                              </Text>
                              <Text style={{ color: "white", fontSize: 14, opacity: 0.8 }}>
                                {t.email}
                              </Text>
                            </VStack>
                          </HStack> */}
                        </Card>
                      </Pressable>
                    </GridItem>
                  );
                }
                return acc;
              }, [])}
            </Grid>
          </Card>

          <Card style={{ backgroundColor: "#171717" }}>
            <VStack>
              <Text style={{ color: "white", fontSize: 20, fontWeight: 400 }}>
                {currentUser?.email}
              </Text>
            </VStack>
          </Card>

          <Card style={{ backgroundColor: "#171717" }}>
            <VStack>
              <Text style={{ color: "white", fontSize: 20, fontWeight: 400 }}>
                {currentUser?.email}
              </Text>
            </VStack>
          </Card>
        </Box>
      </VStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  AvatarMargin: {
    marginTop: 12,
    marginBottom: 12,
    flex: 1,
  },
});
