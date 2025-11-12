import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { View } from "@/components/Themed";
import { useUser } from "@/context/profileContext";
import { useProject } from "@/context/projectContext";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Divider } from "@/components/ui/divider";
import { VStack } from "@/components/ui/vstack";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
} from "@/components/ui/avatar";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";

export default function Home() {
  const router = useRouter();
  const { profiles } = useUser();
  const { project, setSelectedProject, assignedUser, tasks } = useProject();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;

  const truncateWords = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + " ..."
      : text;
  };

  const createdByFunction = (uid: string) => {
    if (!profiles) return null;
    const name = profiles.find((t) => t.uid === uid) || null;
    return name?.nickName;
  };

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
    <>
      {isLargeScreen ? (
        <HStack
          style={{
            justifyContent: "space-between",
            marginTop: 10,
            marginLeft: 75,
            marginRight: 75,
            marginBottom: 100,
          }}
        >
          <Box style={styles.HstackContainer}>
            <Text>
              {project.filter((t) => t.status === "Completed").length}
            </Text>
            <Text>Completed</Text>
          </Box>
          <Box style={styles.HstackContainer}>
            <Text>{project.filter((t) => t.status === "Ongoing").length}</Text>
            <Text>In Progress</Text>
          </Box>
          <Box style={styles.HstackContainer}>
            <Text>
              {
                project.filter(
                  (t) =>
                    t.status !== "Completed" &&
                    t.deadline &&
                    t.deadline.toDate() < new Date()
                ).length
              }
            </Text>
            <Text>Overdue</Text>
          </Box>
        </HStack>
      ) : (
        <Box
          style={{
            borderWidth: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <VStack>
            <HStack>
              <Box style={styles.HstackContainer}>
                <Text>
                  {project.filter((t) => t.status === "Completed").length}
                </Text>
              </Box>
              <Box style={styles.HstackContainer}>
                <Text>
                  {project.filter((t) => t.status === "Ongoing").length}
                </Text>
              </Box>
              <Box style={styles.HstackContainer}>
                <Text>
                  {
                    project.filter(
                      (t) =>
                        t.status !== "Completed" &&
                        t.deadline &&
                        t.deadline.toDate() < new Date()
                    ).length
                  }
                </Text>
              </Box>
            </HStack>
          </VStack>
        </Box>
      )}

      <View
        style={{
          marginTop: 10,
          marginLeft: isLargeScreen ? 75 : 0,
          marginRight: isLargeScreen ? 75 : 0,
          height: 400,
        }}
      >
        <Box style={{ padding: 10 }}>
          <HStack style={{ justifyContent: "space-between" }}>
            <Text>Project Name</Text>
            <Text>Status</Text>
            <Text>Employees</Text>
            <Text>Started on</Text>
            <Text>Deadline</Text>
          </HStack>
          <Divider
            orientation="horizontal"
            style={{ marginTop: 20, marginBottom: 10 }}
          />

          <ScrollView>
            {project.map((t) => (
              <Card size="sm" variant="outline" className="m-3" key={t.id}>
                <Pressable
                  onPress={() => {
                    setSelectedProject(t.id);
                    router.push("/projectWindow"); // or open modal directly
                  }}
                  onHoverIn={() => setHoveredId(t.id)}
                  onHoverOut={() => setHoveredId(null)}
                >
                  <HStack style={{ flex: 1 }}>
                    <Box style={{ borderWidth: 1 }}>
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
                    </Box>
                    <Box
                      style={{
                        borderWidth: 1,
                        flex: 1,
                        alignContent: "center",
                        alignItems: "center",
                        paddingLeft: 20,
                        paddingRight: 20,
                      }}
                    >
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
                    </Box>
                    <Box style={{ borderWidth: 1, flex: 1 }}>
                      <HStack style={{ gap: 8 }}>
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
                    <Box style={{ borderWidth: 1, flex: 1 }}>
                      {t.deadline?.toDate().toLocaleDateString()}
                    </Box>
                  </HStack>
                </Pressable>
              </Card>
            ))}
          </ScrollView>
        </Box>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  HstackContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    width: 200,
    height: 150,
    backgroundColor: "white",
  },
  VstackContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    width: 160,
    height: 100,
    backgroundColor: "white",
    margin: 10,
  },
});
