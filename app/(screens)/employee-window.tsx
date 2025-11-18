import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  Pressable,
  StyleSheet,
} from "react-native";
import { useUser } from "@/context/profileContext";
import { useProject } from "@/context/projectContext";

import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import {
  Avatar,
  AvatarFallbackText,
  AvatarBadge,
} from "@/components/ui/avatar";
import { Divider } from "@/components/ui/divider";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { router, useRouter } from "expo-router";
// import { Pressable } from "@/components/ui/pressable";
import { Icon, ArrowLeftIcon } from "@/components/ui/icon";
// import { Route } from "expo-router/build/Route";
// import { Center } from "@/components/ui/center";
// import { useHover } from "@gluestack-ui/utils/aria";
import { ScrollView } from "react-native-gesture-handler";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";

export default function EmployeeWindow() {
  const { selectedEmployee, profiles } = useUser();
  const { project, assignedUser, setSelectedProject, tasks } = useProject();

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

  const currentUser = profiles.find((t) => t.uid === selectedEmployee);

  const currentUserProjects = project.filter((p) =>
    assignedUser.some((a) => p.id === a.projectID && a.uid === currentUser?.uid)
  );

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
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 1280;
  const isMediumScreen = dimensions.width <= 1280 && dimensions.width > 768;

  return (
    <View
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
          }}
        >
          <Pressable onPress={() => router.replace("/(screens)/employee")}>
            <HStack style={{ alignItems: "center" }}>
              <Icon
                as={ArrowLeftIcon}
                className="text-typography-500 w-7 h-7 "
                color="#ffffffff"
              />
              <Text
                style={{ fontSize: 23, fontWeight: "bold", color: "#ffffffff" }}
              >
                Back
              </Text>
            </HStack>
          </Pressable>
        </Box>

        <HStack
          style={{
            borderWidth: 0,
            borderColor: "blue", //this is the BLUE BLUE Section
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            gap: isLargeScreen ? 12 : isMediumScreen ? 12 : 8,
            // marginTop: 32,
            minHeight: "100%",
            // flexDirection: isLargeScreen ? "row" : isMediumScreen ? "row" : "column",
            flex: 1,
          }}
        >
          {/* profile area  */}
          <VStack
            style={{
              flex: 1,
              borderWidth: 0,
              borderColor: "gray",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100%",
              backgroundColor: "#1f1f1f",
              borderRadius: 12,
            }}
          >
            {/* PROFILE OF USER CLICKED HERE:  */}
            <Avatar size="2xl" style={{ backgroundColor: "#333333" }}>
              <AvatarFallbackText style={{ color: "#ffffffff" }}>
                {currentUser?.firstName}
              </AvatarFallbackText>
            </Avatar>
            <Heading
              style={{
                marginTop: isLargeScreen ? 16 : isMediumScreen ? 16 : 12,
                fontSize: isLargeScreen ? 32 : isMediumScreen ? 28 : 24,
                fontFamily: "roboto, arial",
                color: "#ffffffff",
              }}
            >
              {currentUser?.firstName + " " + currentUser?.lastName}
            </Heading>
            <Box
              style={{
                borderWidth: 0,
                padding: 12,
                marginTop: isLargeScreen ? 32 : isMediumScreen ? 28 : 20,
                borderRadius: 12,
                backgroundColor: "#5C5C5C",
              }}
            >
              <Text
                style={{
                  color: "#ffffffff",
                  fontWeight: "bold",
                  fontSize: isLargeScreen ? 24 : isMediumScreen ? 20 : 16,
                }}
              >
                {currentUser?.role}
              </Text>
            </Box>
          </VStack>

          {/* user info. */}
          <ScrollView
            style={{
              flex: 2,
              borderWidth: 0,
              borderColor: "#727070ff",
              minHeight: "100%",
              maxHeight: "100%",
              borderRadius: 12,
              paddingTop: 12,
              paddingRight: isLargeScreen ? 32 : isMediumScreen ? 20 : 20,
              paddingLeft: isLargeScreen ? 32 : isMediumScreen ? 20 : 20,
              paddingBottom: 12,
              backgroundColor: "#1f1f1f",
            }}
            showsVerticalScrollIndicator={false}
          >
            <Text
              style={{
                fontSize: isLargeScreen ? 40 : isMediumScreen ? 32 : 20,
                fontFamily: "roboto, arial",
                fontWeight: "bold",
                color: "#ffffffff",
              }}
            >
              Project Collaborator
            </Text>

            <HStack
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                borderWidth: 0,
                // marginBottom: isLargeScreen ? 20 : isMediumScreen ? 20 : 16,
                marginTop: isLargeScreen ? 20 : isMediumScreen ? 16 : 12,
                marginBottom: isLargeScreen ? 20 : isMediumScreen ? 16 : 12,
              }}
            >
              <Text
                style={{
                  fontFamily: "roboto, arial",
                  fontWeight: "bold",
                  color: "#ffffff",
                  flex: 1,
                }}
              >
                In Progress
              </Text>
              <Divider
                style={{
                  borderWidth: 1,
                  flex: 3,
                  marginLeft: 12,
                  borderColor: "#CDCCCC",
                }}
              ></Divider>
            </HStack>

            {/* -------on progress --------------- */}
            <View
              style={{
                borderWidth: 0,
                borderColor: "gray",
                flexWrap: "wrap",
                flexDirection: isLargeScreen
                  ? "row"
                  : isMediumScreen
                    ? "row"
                    : "column",
                justifyContent: "flex-start",
                alignItems: "stretch",
                gap: isLargeScreen ? 8 : isMediumScreen ? 8 : 8,
              }}
            >
              {onProgressProject.map((t) => (
                <View
                  key={t.id}
                  style={{
                    backgroundColor: "transparent",
                    borderColor: "#b63d3dff",
                    borderWidth: 0,
                    margin: 0,
                    padding: 4,
                    flexBasis: isLargeScreen
                      ? "32%"
                      : isMediumScreen
                        ? "48%"
                        : "auto",
                    minHeight: 120,
                  }}
                >
                  <Pressable
                    style={{
                      borderWidth: 0,
                      borderColor: "#edfd04ff",
                      flex: 1,
                    }}
                    onPress={() => {
                      setSelectedProject(t.id);
                      router.push("/(screens)/projectWindow");
                    }}
                  >
                    <Card
                      // size="lg"
                      className="p-5 w-full m1"
                      style={{
                        borderRadius: 12,
                        borderWidth: 0,
                        backgroundColor: "#ffffffff", //hoverable content
                        padding: 12,
                        justifyContent: "space-between",
                        flex: 1,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 16,
                          color: "#000000ff",
                          flex: 1,
                        }}
                      >
                        {t.title ? String(t.title) : ""}
                      </Text>

                      <HStack style={styles.AvatarMargin}>
                        <Box style={{ flex: 1, borderWidth: 0 }}>
                          {/* -------------------progress bar--------------------------------- */}
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
                        {/* -------------------progress bar--------------------------------- */}

                        {profiles
                          .filter((p) =>
                            assignedUser.some(
                              (a) => a.projectID === t.id && a.uid === p.uid
                            )
                          )
                          .map((t) => {
                            return (
                              <Avatar
                                size="sm"
                                style={{
                                  backgroundColor: "#CDCCCC",
                                  marginLeft: 4,
                                }}
                              >
                                <AvatarFallbackText
                                  size="sm"
                                  key={t.id}
                                  style={{
                                    color: "#000000",
                                    fontWeight: "bold",
                                    fontFamily: "roboto, arial",
                                  }}
                                >
                                  {t.firstName}
                                </AvatarFallbackText>
                              </Avatar>
                            );
                          })}
                      </HStack>
                    </Card>
                  </Pressable>
                </View>
              ))}
            </View>

            <HStack
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                borderWidth: 0,
                marginTop: isLargeScreen ? 20 : isMediumScreen ? 16 : 12,
                marginBottom: isLargeScreen ? 20 : isMediumScreen ? 16 : 12,
              }}
            >
              <Text
                style={{
                  fontFamily: "roboto, arial",
                  fontWeight: "bold",
                  color: "#ffffff",
                  flex: 1,
                }}
              >
                Completed
              </Text>
              <Divider
                style={{
                  borderWidth: 1,
                  flex: 3,
                  marginLeft: 12,
                  borderColor: "#CDCCCC",
                }}
              ></Divider>
            </HStack>

            {/* Completed CONTENT HERE */}
            <Text
              style={{
                color: "#ffffff",
                fontSize: 12,
                fontWeight: "bold",
                alignSelf: "center",
              }}
            >
              Let's complete some projects!
            </Text>

            {onCompleteProject.map((t) => (
              <View
                key={t.id}
                style={{
                  backgroundColor: "transparent",
                  borderColor: "#b63d3dff",
                  borderWidth: 1,
                  margin: 4,
                  padding: 4,
                }}
              >
                <Pressable>
                  <Card
                    size="lg"
                    className="p-5 w-full m1"
                    style={{
                      borderRadius: 12,
                      borderWidth: 2,
                      backgroundColor: "#1F1F1F", //hoverable content
                      padding: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 16,
                        color: "#ffffffff",
                      }}
                    >
                      {t.title ? String(t.title) : ""}
                    </Text>

                    <HStack style={styles.AvatarMargin}>
                      {profiles
                        .filter((p) =>
                          assignedUser.some(
                            (a) => a.projectID === t.id && a.uid === p.uid
                          )
                        )
                        .map((t) => {
                          return (
                            <Avatar
                              style={{
                                backgroundColor: "#CDCCCC",
                                marginLeft: 4,
                              }}
                            >
                              <AvatarFallbackText
                                size="sm"
                                key={t.id}
                                style={{ color: "#000000" }}
                              >
                                {t.firstName}
                              </AvatarFallbackText>
                            </Avatar>
                          );
                        })}
                    </HStack>
                  </Card>
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </HStack>
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  AvatarMargin: {
    marginTop: 12,
    marginBottom: 12,
    flex: 1,
  },
});
