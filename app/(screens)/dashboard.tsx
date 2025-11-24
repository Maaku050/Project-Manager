import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { ScrollView, StyleSheet, useWindowDimensions } from "react-native";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { View } from "@/components/Themed";
import { useUser } from "@/context/profileContext";
import { useProject } from "@/context/projectContext";
import { HStack } from "@/components/ui/hstack";
import { Divider } from "@/components/ui/divider";
import { VStack } from "@/components/ui/vstack";
import { LayoutDashboard } from "lucide-react-native";
import ProjectBar from "@/components/ProjectBar";
import { P } from "@expo/html-elements";

export default function Home() {
  const router = useRouter();
  const { profiles } = useUser();
  const { project, setSelectedProject, assignedUser, tasks } = useProject();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 1280; // computer UI condition
  const isMediumScreen = dimensions.width <= 1280 && dimensions.width > 768; // tablet UI condition

  const ongoingProjects = project.filter(
    (t) =>
      t.status === "Ongoing" && t?.deadline && t.deadline.toDate() > new Date()
  );

  const closedProjects = project.filter((t) => t.status === "Closed");

  const overdueProjects = project.filter(
    (t) =>
      t?.deadline &&
      t.deadline.toDate() < new Date() &&
      t.status != "Archived" &&
      t.status != "Closed"
  );

  const totalProject =
    ongoingProjects.length + overdueProjects.length + closedProjects.length;

  return (
    <ScrollView
      contentContainerStyle={{
        backgroundColor: "black",
        padding: 24,
        borderWidth: 0,
        borderColor: "red",
        flexGrow: 1,
      }}
    >
      {isLargeScreen || isMediumScreen ? (
        <VStack style={{ gap: 20, borderWidth: 0 }}>
          <Box>
            <Text
              style={{
                color: "white",
                fontSize: 20,
                fontFamily: "roboto, arial",
                fontWeight: "bold",
              }}
            >
              Project Summaries
            </Text>
          </Box>
          <HStack
            style={{
              justifyContent: "space-between",
              borderWidth: 0,
              borderColor: "red",
              gap: isLargeScreen ? 64 : isMediumScreen ? 32 : undefined,
            }}
          >
            <Box
              style={{ ...styles.HstackContainerLarge, ...styles.containerBG }}
            >
              <Text style={styles.statusTextLarge}>{totalProject}</Text>
              <Text style={styles.statusText}>Projects</Text>
            </Box>

            <Box
              style={{ ...styles.HstackContainerLarge, ...styles.containerBG }}
            >
              <Text style={{ ...styles.statusTextLarge, color: "#3a9e60ff" }}>
                {project.filter((t) => t.status === "Ongoing").length}
              </Text>
              <Text style={{ ...styles.statusText, color: "#3a9e60ff" }}>
                On Going
              </Text>
            </Box>
            <Box
              style={{ ...styles.HstackContainerLarge, ...styles.containerBG }}
            >
              <Text style={{ ...styles.statusTextLarge, color: "#c56969ff" }}>
                {
                  project.filter(
                    (t) =>
                      t.status !== "Completed" &&
                      t.deadline &&
                      t.deadline.toDate() < new Date()
                  ).length
                }
              </Text>
              <Text style={{ ...styles.statusText, color: "#c56969ff" }}>
                Over Due
              </Text>
            </Box>
            <Box
              style={{ ...styles.HstackContainerLarge, ...styles.containerBG }}
            >
              <Text style={{ ...styles.statusTextLarge, color: "#888888ff" }}>
                {
                  project.filter(
                    (t) => t.status === "Closed" || t.status === "closed"
                  ).length
                }
              </Text>
              <Text style={{ ...styles.statusText, color: "#888888ff" }}>
                Closed
              </Text>
            </Box>
          </HStack>
        </VStack>
      ) : (
        <Box
          style={{
            // borderWidth: 1,
            borderColor: "blue",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: 12,
            paddingRight: 12,
            marginTop: 12,
            marginBottom: 12,
          }}
        >
          <VStack>
            <HStack
              style={
                {
                  // borderWidth: 2,
                }
              }
            >
              <Box style={styles.HstackContainer}>
                <Text style={styles.statusText}>
                  {project.filter((t) => t.status === "Completed").length}
                </Text>
                <Text style={{ fontWeight: "bold" }}>Completed</Text>
              </Box>
              <Box style={styles.HstackContainer}>
                <Text style={styles.statusText}>
                  {project.filter((t) => t.status === "Ongoing").length}
                </Text>
                <Text style={{ fontWeight: "bold" }}>In Progress</Text>
              </Box>
            </HStack>
            <Box
              style={{
                height: 150,
                width: "100%",
                backgroundColor: "#1f1f1f",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 12,
              }}
            >
              <Text style={styles.statusText}>
                {
                  project.filter(
                    (t) =>
                      t.status !== "Completed" &&
                      t.deadline &&
                      t.deadline.toDate() < new Date()
                  ).length
                }
              </Text>
              <Text style={{ fontWeight: "bold" }}>Overdue</Text>
            </Box>
          </VStack>
        </Box>
      )}

      <VStack
        style={{
          marginTop: isLargeScreen || isMediumScreen ? 20 : 16,
          gap: 20,
          borderWidth: 0,
          flex: 2,
        }}
      >
        <Box>
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontFamily: "roboto, arial",
              fontWeight: "bold",
            }}
          >
            Project Overview
          </Text>
        </Box>
        <View
          style={{
            // height: "100%",
            flex: 1,
            borderRadius: isLargeScreen ? 12 : isMediumScreen ? 12 : 4,
            ...styles.containerBG,
          }}
        >
          <Box
            style={{ padding: 12, borderWidth: 0, borderRadius: 12, flex: 1 }}
          >
            {isLargeScreen ? (
              <>
                <HStack
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    padding: 20,
                    borderWidth: 0,
                    gap: 12,
                  }}
                >
                  <Text style={{ flex: 2, color: "white", borderWidth: 0 }}>
                    Project Name
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      color: "white",
                      textAlign: "center",
                      borderWidth: 0,
                    }}
                  >
                    Task Progress
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      color: "white",
                      textAlign: "center",
                      borderWidth: 0,
                    }}
                  >
                    Status
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      color: "white",
                      textAlign: "center",
                      borderWidth: 0,
                    }}
                  >
                    Employees
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      color: "white",
                      textAlign: "center",
                      borderWidth: 0,
                    }}
                  >
                    Started on
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      color: "white",
                      textAlign: "center",
                      borderWidth: 0,
                    }}
                  >
                    Deadline
                  </Text>
                </HStack>
                <Divider
                  orientation="horizontal"
                  style={{ marginTop: 20, marginBottom: 10, borderWidth: 1 }}
                  className="border-primary-500"
                />
              </>
            ) : isMediumScreen ? (
              <>
                <HStack
                  style={{
                    justifyContent: "space-between",
                    flex: 1,
                    flexDirection: "row",
                    flexWrap: "wrap",
                    padding: 20,
                    borderWidth: 1,
                    gap: 12,
                  }}
                >
                  <Text style={{ flex: 7, color: "white", borderWidth: 0 }}>
                    Project Name
                  </Text>
                  <Text
                    style={{
                      flex: 3,
                      color: "white",
                      textAlign: "left",
                      borderWidth: 0,
                    }}
                  >
                    Task Progress
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      color: "white",
                      textAlign: "right",
                      borderWidth: 0,
                    }}
                  >
                    Status
                  </Text>
                  <Text
                    style={{
                      flex: 3,
                      color: "white",
                      textAlign: "right",
                      borderWidth: 0,
                    }}
                  >
                    Employees
                  </Text>
                  <Text
                    style={{
                      flex: 2,
                      color: "white",
                      textAlign: "right",
                      borderWidth: 0,
                    }}
                  >
                    Started on
                  </Text>
                  <Text
                    style={{
                      flex: 2,
                      color: "white",
                      textAlign: "right",
                      borderWidth: 0,
                    }}
                  >
                    Deadline
                  </Text>
                </HStack>

                <Divider
                  orientation="horizontal"
                  style={{
                    marginTop: 20,
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor: "#ffffffff",
                  }}
                />
              </>
            ) : (
              <Divider
                orientation="horizontal"
                style={{
                  marginTop: -12,
                  marginBottom: 8,
                  borderWidth: 2,
                  borderRadius: 12,
                  borderColor: "#1f1f1f",
                }}
              />
            )}

            {/* --------------------------------------------------PROJECT BAR------------------------------------------------ */}
            <View
              style={{
                ...styles.ProjectContainer,
                borderWidth: 0,
                flexGrow: 1,
              }}
            >
              {!project || project.length === 0 ? (
                <Box
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    minHeight: "100%",
                  }}
                >
                  <Text style={{ ...styles.statusText }}>No Project Yet</Text>
                  <Text>There is no Project for now</Text>
                </Box>
              ) : (
                <>
                  {/* {project.map((p) => 
                      p.status === "Ongoing" ? (<ProjectBar key={p.id} projectID={p.id} />) 
                      : p.status != "Ongoing" && p.status != "Closed" ? (<ProjectBar key={p.id} projectID={p.id} />) : (""),
                      
                    )} */}

                  {ongoingProjects.map((p) => (
                    <ProjectBar key={p.id} projectID={p.id} />
                  ))}
                  {overdueProjects.map((p) => (
                    <ProjectBar key={p.id} projectID={p.id} />
                  ))}
                  {closedProjects.map((p) => (
                    <ProjectBar key={p.id} projectID={p.id} />
                  ))}
                </>
              )}
            </View>
          </Box>
        </View>
      </VStack>
    </ScrollView>
  );
}

export function DashTitle() {
  return (
    <HStack
      style={{
        gap: 12,
        justifyContent: "center",
        alignItems: "center",
        padding: 8,
      }}
    >
      <LayoutDashboard size={30} color={"white"} />
      <Text size="2xl" className="font-simibold color-white">
        Dashboard
      </Text>
    </HStack>
  );
}

const styles = StyleSheet.create({
  ProjectContainer: {
    backgroundColor: "transperent",
  },
  HstackContainer: {
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 1,
    width: 200,
    height: 150,
    backgroundColor: "#1f1f1f",
    margin: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontFamily: "roboto, arial",
    fontWeight: "medium",
    fontSize: 24,
  },
  HstackContainerLarge: {
    height: 200,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1f1f1f",
    margin: 4,
    borderRadius: 12,
    paddingLeft: 64,
    paddingRight: 64,
    paddingTop: 48,
    paddingBottom: 48,
    gap: 12,
  },
  statusTextLarge: {
    fontFamily: "roboto, arial",
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
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
  containerBG: {
    backgroundColor: "#171717",
  },
});
