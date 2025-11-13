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
  const isLargeScreen = dimensions.width >= 1280; // computer UI condition
  const isMediumScreen = dimensions.width <= 1280 && dimensions.width > 768; // tablet UI condition


  // we will create a truncate for avatars to iterate them and minimize them in 3.
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
    <ScrollView style={{backgroundColor: "black"}}>
      {isLargeScreen || isMediumScreen ? (
        <HStack
          style={{
            justifyContent: "space-between",
            // borderWidth: 1,
            borderColor: "red",
            marginTop: 12,
            marginLeft: 64,
            marginRight: 64,
            marginBottom: 40,
            gap: isLargeScreen ? 64 : isMediumScreen ? 32 : undefined,
          }}
        >
          <Box style={styles.HstackContainerLarge}>
            <Text style={styles.statusTextLarge}>
              {project.filter((t) => t.status === "Completed").length}
            </Text>
            <Text style={{fontWeight: "bold"}}>Completed</Text>
          </Box>
          <Box style={styles.HstackContainerLarge}>
            <Text style={styles.statusTextLarge}>{project.filter((t) => t.status === "Ongoing").length}</Text>
            <Text style={{fontWeight: "bold"}}>In Progress</Text>
          </Box>
          <Box style={styles.HstackContainerLarge}>
            <Text style={styles.statusTextLarge}>
              {
                project.filter(
                  (t) =>
                    t.status !== "Completed" &&
                    t.deadline &&
                    t.deadline.toDate() < new Date()
                ).length
              }
            </Text>
            <Text style={{fontWeight: "bold"}}>Overdue</Text>
          </Box>
        </HStack>
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
            <HStack style={{
              // borderWidth: 2,
            }}>
              <Box style={styles.HstackContainer}>
                <Text style={styles.statusText}>
                  {project.filter((t) => t.status === "Completed").length}
                </Text>
                <Text style={{fontWeight: "bold"}}>Completed</Text>
              </Box>
              <Box style={styles.HstackContainer}>
                <Text style={styles.statusText}>
                  {project.filter((t) => t.status === "Ongoing").length}
                </Text>
                <Text style={{fontWeight: "bold"}}>In Progress</Text>
              </Box>
            </HStack>
            <Box style={{height: 150,
              width: "100%",
              backgroundColor: "#1f1f1f",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 12,
            }}>
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
                <Text style={{fontWeight: "bold"}}>Overdue</Text>
              </Box>
          </VStack>
        </Box>
      )}

      <View
        style={{
          marginTop: 12,
          marginLeft: isLargeScreen ? 64 : 0,
          marginRight: isLargeScreen ? 64 : 0,
          height: "auto",
          borderRadius: isLargeScreen ? 12 : isMediumScreen ?  12: 4,
          backgroundColor: "transparent",
        }}
      >
        <Box style={{ padding: 12 }}> 
          {isLargeScreen ? 
          (<>
            <HStack style={{ justifyContent: "space-between", flex: 1, flexDirection: "row", flexWrap: "wrap", padding: 12}}>
              <Text style={{flex: 2, fontWeight: "bold", color: "white", fontSize: 20}}>Project Name</Text>
              <Text style={styles.textColorWhite}>Status</Text>
              <Text style={styles.textColorWhite}>Employees</Text>
              {/* <Text style={styles.textColorWhite}>Started on</Text> */}
              <Text style={styles.textColorWhite}>Deadline</Text>
            </HStack>
             <Divider
              orientation="horizontal"
              style={{ marginTop: 20, marginBottom: 10,  borderWidth: 1, borderColor: "#1f1f1f", }}
            />
          </>
          
        ) : isMediumScreen ? (
          <>
            <HStack style={{ justifyContent: "space-between", flexDirection: "row", flexWrap: "wrap"}}>
              <Text style={{flex: 2, fontWeight: "bold", color: "white", fontSize: 20}}>Project Name</Text>
              <Text style={styles.textColorWhite}>Status</Text>
              <Text style={styles.textColorWhite}>Employees</Text>
              {/* <Text style={styles.textColorWhite}>Started on</Text> */}
              <Text style={styles.textColorWhite}>Deadline</Text>
            </HStack>
    
             <Divider
              orientation="horizontal"
              style={{ marginTop: 20, marginBottom: 10,  borderWidth: 1, borderColor: "#1f1f1f", }}
            />
          </>
        ) : (
          <Divider
            orientation="horizontal"
            style={{ marginTop: -12, 
              marginBottom: 8,
              borderWidth: 2,
              borderRadius: 12,
              borderColor: "#1f1f1f",
            }}

          />
        )}
          
         

          <View style={styles.ProjectContainer}>
            {project.map((t) => (
              <Card size="sm" variant="outline" className="m-3" key={t.id} style={{
                backgroundColor: "#cdcccc",
                borderWidth: 0,
                borderColor: "yellow",
                padding: 12,
                height: isLargeScreen ? "auto" : isMediumScreen ? "auto" : 120,
                flexDirection: isLargeScreen || isMediumScreen ? "row" : "column",
                flex: 1,
              }}>
                <Pressable
                  onPress={() => {
                    setSelectedProject(t.id);
                    router.push("/projectWindow"); // or open modal directly
                  }}
                  onHoverIn={() => setHoveredId(t.id)}
                  onHoverOut={() => setHoveredId(null)}
                  style={{flex: 1}}
                >
                  <HStack style={{ flex: 1 }}>
                    <Box style={{ borderWidth: 0, borderColor: "orange", flex: 2 }}>
                      <Heading
                        size="md"
                        className="mb-1"
                        style={{
                          textDecorationLine: hoveredId === t.id ? "underline" : "none",
                          flex: 1,
                          flexWrap: "wrap",
                          color: "black",
                        }}
                      >
                        {t.title}
                      </Heading>
                    </Box>
                    <Box
                      style={{
                        // borderWidth: 1,
                        flex: 1,
                        alignContent: "center",
                        alignItems: "center",
                        justifyContent: "center",
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
                    <Box style={{ borderWidth: 0, flex: 1, borderColor: "red", justifyContent: "center"}}>
                      <HStack style={{ gap: isLargeScreen ? 8 : isMediumScreen ? 4 : 0, alignSelf: "center"}}>
                        {profiles.filter((p) => assignedUser.some((a) => a.projectID === t.id && a.uid === p.uid)).map((t) => {
                            return (
                              <Avatar size={isLargeScreen ? "sm" : "xs"} key={t.id}>
                                <AvatarFallbackText>
                                  {t.firstName}
                                </AvatarFallbackText>

                                {/* <AvatarBadge /> */}
                              </Avatar>
                            );
                          })}
                      </HStack>
                    </Box>
                    <Box style={{ borderWidth: 0, flex: isLargeScreen || isMediumScreen ? 1 : 1, borderColor: "blue", justifyContent: "center", alignItems: "flex-end"}}>
                      {t.deadline?.toDate().toLocaleDateString()}
                    </Box>
                  </HStack>
                </Pressable>
              </Card>
            ))}
          </View>
        </Box>
      </View> 
    </ScrollView>
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
    // flex: 1,
  }, 
  statusText: {
    color: "white",
    fontFamily: "roboto, arial",
    fontSize: 32,
    fontWeight: "black",
  },
  HstackContainerLarge: {
    height: 200,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1f1f1f",
    margin: 4,
    borderRadius: 12,
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
  textColorWhite: {
    color: "white",
    fontFamily: "roboto, arial",
    flex: 1,
    alignContent: "center",
    alignSelf: "flex-end",
    textAlign: "right",
    // borderWidth: 2,
    paddingLeft: 0,
    paddingRight: 8,
    borderLeftWidth: 1,
    borderColor: "#1f1f1f", 
  }
 

});
