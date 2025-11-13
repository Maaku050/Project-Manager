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
import { Route } from "expo-router/build/Route";
// import { Car } from "lucide-react-native";
import { db, auth } from "@/firebase/firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { Center } from "@/components/ui/center";
import { useHover } from "@gluestack-ui/utils/aria";
import { ScrollView } from "react-native-gesture-handler";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";

export default function EmployeeWindow() {
  const { selectedEmployee, profiles, profile } = useUser();
  const { project, assignedUser, setSelectedProject, tasks } = useProject();

  // collect task ids from the user's assigned entries (support objects or plain id strings)
  // const userTaskIds = new Set(userTasks.map((u) => (typeof u === "string" ? u : (u.taskID ?? u.id ?? u))));

  // ----segregate user assigned Tasks-----
  // const userTasks = assignedUser.filter((i) => i.uid === profile?.uid);
  // const newUserTaskID = new Set(userTasks.map((u) => (typeof u === "string" ? u : (u.taskID ?? u.id ?? u))));
  // const taskAssigned = tasks.filter((t) => newUserTaskID.has(t.id));

  // ------categorized tasks of user----------
  // const ongoingTasks = taskAssigned.filter((t) => t.status === "Ongoing");
  // const completedTasks = taskAssigned.filter((t) => t.status === "Complete");

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
    <View
      style={{
        flex: 1,
        backgroundColor: "#000000ff",
        paddingTop: 12,
        paddingLeft: 32,
        paddingRight: 32,
        paddingBottom: 40,
      }}
    >
      <VStack
        style={{
          borderWidth: 0,
          borderColor: "red",
          padding: 12,
          gap: isLargeScreen ? 16 : isMediumScreen ? 12 : 8,
        }}
      >
        <Box
          style={{
            height: 70,
            width: "100%",
            backgroundColor: "#3f3f3fff",
            justifyContent: "center",
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
            gap: isLargeScreen ? 16 : isMediumScreen ? 16 : 12,
          }}
        >
          {/* profile area  */}
          <VStack
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "gray",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            {/* PROFILE OF USER CLICKED HERE:  */}
            <Avatar size="2xl" style={{ backgroundColor: "#CDCCCC" }}>
              <AvatarFallbackText style={{ color: "#000000" }}>
                {currentUser?.firstName}
              </AvatarFallbackText>
            </Avatar>
            <Heading
              style={{
                fontSize: 20,
                fontFamily: "roboto, arial",
                color: "#CDCCCC",
              }}
            >
              {currentUser?.nickName}
            </Heading>
            <Text
              style={{
                color: "#CDCCCC",
                fontWeight: "semibold",
                fontSize: isLargeScreen ? 24 : isMediumScreen ? 20 : 16,
              }}
            >
              {currentUser?.role}
            </Text>
          </VStack>

          {/* user info. */}
          <ScrollView
            style={{
              flex: 1,
              borderWidth: 2,
              borderColor: "#727070ff",
              height: "100%",
            }}
          >
            <Text
              style={{
                fontSize: isLargeScreen ? 40 : isMediumScreen ? 32 : 20,
                fontFamily: "roboto, arial",
                fontWeight: "bold",
                color: "#cdcccc",
              }}
            >
              Project Collaborator
            </Text>

            <HStack
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flex: 1,
                borderWidth: 0,
              }}
            >
              <Text
                style={{
                  fontFamily: "roboto, arial",
                  fontWeight: "bold",
                  color: "#ffffff",
                }}
              >
                In Progress
              </Text>
              <Divider
                style={{
                  borderWidth: 2,
                  flex: 1,
                  marginLeft: 12,
                  borderColor: "#1f1f1f",
                }}
              ></Divider>
            </HStack>

            {onProgressProject.map((t) => (
              <View
                key={t.id}
                style={{
                  backgroundColor: "transparent",
                  borderColor: "#b63d3dff",
                  borderWidth: 1,
                  margin: 4,
                  padding: 4,
                  flexWrap: "wrap",
                }}
              >
                <Pressable
                  style={{ borderWidth: 1, width: "100%" }}
                  onPress={() => {
                    setSelectedProject(t.id);
                    router.replace("/(screens)/projectWindow");
                  }}
                >
                  <Card
                    size="lg"
                    className="p-5 w-full m1"
                    style={{
                      borderRadius: 12,
                      borderWidth: 2,
                      backgroundColor: "#ffffffff", //hoverable content
                      padding: 12,
                      width: "100%",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 16,
                        color: "#000000ff",
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
                  </Card>
                </Pressable>
              </View>
            ))}

            <HStack
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flex: 1,
                borderWidth: 0,
              }}
            >
              <Text
                style={{
                  fontFamily: "roboto, arial",
                  fontWeight: "bold",
                  color: "#ffffff",
                }}
              >
                Completed
              </Text>
              <Divider
                style={{
                  borderWidth: 2,
                  flex: 1,
                  marginLeft: 12,
                  borderColor: "#1f1f1f",
                }}
              ></Divider>
            </HStack>

            {/* Completed CONTENT HERE */}
            <Text
              style={{ color: "#ffffff", fontSize: 12, fontWeight: "bold" }}
            >
              I have no complete project yet.
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
  },
});
