import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { ScrollView, StyleSheet, useWindowDimensions } from "react-native";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { View } from "@/components/Themed";
import { useProject } from "@/context/projectContext";
import { HStack } from "@/components/ui/hstack";
import { Divider } from "@/components/ui/divider";
import { VStack } from "@/components/ui/vstack";
import { LayoutDashboard } from "lucide-react-native";
import ProjectBar from "@/components/ProjectBar";


export default function Home() {
  const router = useRouter();
  const { project} = useProject();

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
        backgroundColor: "#000000",
        padding: 24,
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
        <VStack style={{ gap: 20, borderWidth: 0, height: 250,}}>
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
              style={{ 
                ...styles.HstackContainerLarge, 
                ...styles.containerBG,
                height: isLargeScreen || isMediumScreen ? 200 : 70,
                width: isLargeScreen || isMediumScreen ? "100%" : "20%",
              }}
            >
              <Text style={{ ...styles.statusTextLarge, fontSize: isLargeScreen || isMediumScreen ? 32 : 20 }}>{totalProject}</Text>
              <Text style={{ ...styles.statusText, fontSize: isLargeScreen || isMediumScreen ? 24 : 14 }}>Projects</Text>
            </Box>

            <Box
              style={{ 
                ...styles.HstackContainerLarge, 
                ...styles.containerBG,
                height: isLargeScreen || isMediumScreen ? 200 : 70,
                width: isLargeScreen || isMediumScreen ? "100%" : "20%",
               }}
            >
              <Text style={{ ...styles.statusTextLarge, color: "#3a9e60ff", fontSize: isLargeScreen || isMediumScreen ? 32 : 20 }}>
                {project.filter((t) => t.status === "Ongoing").length}
              </Text>
              <Text style={{ ...styles.statusText, color: "#3a9e60ff", fontSize: isLargeScreen || isMediumScreen ? 24 : 14 }}>
                On Going
              </Text>
            </Box>
            <Box
              style={{ 
                ...styles.HstackContainerLarge, 
                ...styles.containerBG,
                height: isLargeScreen || isMediumScreen ? 200 : 70,
                width: isLargeScreen || isMediumScreen ? "100%" : "20%",
               }}
            >
              <Text style={{ ...styles.statusTextLarge, color: "#c56969ff", fontSize: isLargeScreen || isMediumScreen ? 32 : 20 }}>
                {
                  project.filter(
                    (t) =>
                      t.status !== "Completed" &&
                      t.deadline &&
                      t.deadline.toDate() < new Date()
                  ).length
                }
              </Text>
              <Text style={{ ...styles.statusText, color: "#c56969ff", fontSize: isLargeScreen || isMediumScreen ? 24 : 14 }}>
                Over Due
              </Text>
            </Box>
            <Box
              style={{ 
                ...styles.HstackContainerLarge, 
                ...styles.containerBG,
                height: isLargeScreen || isMediumScreen ? 200 : 80,
                width: isLargeScreen || isMediumScreen ? "100%" : "20%",
               }}
            >
              <Text style={{ ...styles.statusTextLarge, color: "#888888ff", fontSize: isLargeScreen || isMediumScreen ? 32 : 20 }}>
                {
                  project.filter(
                    (t) => t.status === "Closed" || t.status === "closed"
                  ).length
                }
              </Text>
              <Text style={{ ...styles.statusText, color: "#888888ff", fontSize: isLargeScreen || isMediumScreen ? 24 : 14 }}>
                Closed
              </Text>
            </Box>
          </HStack>
        </VStack>
        

      <VStack
        style={{
          marginTop: isLargeScreen || isMediumScreen ? 20 : 16,
          gap: 20,
          borderWidth: 0,
          flex: 1,
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
            flex: 1,
            borderRadius: isLargeScreen ? 12 : isMediumScreen ? 12 : 4,
            ...styles.containerBG,
          }}
        >
          <Box
            style={{ padding: 12, borderWidth: 0, borderRadius: 12, flex: 1 }}
          >
            {isLargeScreen || isMediumScreen ? (
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
                  <Text style={{ ...styles.statusText, fontSize: isLargeScreen || isMediumScreen ? 24 : 14 }}>No Project Yet</Text>
                  <Text>There is no Project for now</Text>
                </Box>
              ) : (
                <>

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
    fontSize: 14,
  },
  HstackContainerLarge: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1f1f1f",
    margin: 4,
    borderRadius: 12,
    paddingLeft: 64,
    paddingRight: 64,
    paddingTop: 48,
    paddingBottom: 48,
    gap: 8,
  },
  statusTextLarge: {
    fontFamily: "roboto, arial",
    fontSize: 20,
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


