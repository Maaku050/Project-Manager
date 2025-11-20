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
    <ScrollView style={{backgroundColor: "black", padding: 24,}}>
            
      {isLargeScreen || isMediumScreen ? (
          
        <VStack style={{ gap: 20 }}>
           <Box>
                 <Text style={{color: "white", fontSize: 20, fontFamily: "roboto, arial", fontWeight: "bold"}}>Project Summaries</Text>
            </Box>
          <HStack
            style={{
              justifyContent: "space-between",
              borderWidth: 1,
              borderColor: "red",
              gap: isLargeScreen ? 64 : isMediumScreen ? 32 : undefined,
            }}
          >
             <Box style={styles.HstackContainerLarge}>
              <Text style={styles.statusTextLarge}>
                {project.length}
              </Text>
              <Text style={styles.statusText}>Projects</Text>
            </Box>
           
            <Box style={styles.HstackContainerLarge}>
              <Text style={{...styles.statusTextLarge}}>{project.filter((t) => t.status === "Ongoing").length}</Text>
              <Text style={styles.statusText}>In Progress</Text>
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
              <Text style={styles.statusText}>Overdue</Text>
              </Box>
              <Box style={styles.HstackContainerLarge}>
                <Text style={styles.statusTextLarge}>
                  {project.filter((t) => t.status === "Completed").length}
                </Text>
                <Text style={styles.statusText}>Completed</Text>
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

      <VStack style={{ marginTop: isLargeScreen || isMediumScreen ? 40 : 20, gap: 20 }}>
            <Box>
                 <Text style={{color: "white", fontSize: 20, fontFamily: "roboto, arial", fontWeight: "bold"}}>Project Overview</Text>
            </Box>
        <View
          style={{
            // marginTop: 12,
            // marginLeft: isLargeScreen ? 64 : 0,
            // marginRight: isLargeScreen ? 64 : 0,
            height: "auto",
            borderRadius: isLargeScreen ? 12 : isMediumScreen ?  12: 4,
            backgroundColor: "#1f1f1f",
          }}
        >
          <Box style={{ padding: 12 }}> 
            {isLargeScreen ? 
            (<>
              <HStack style={{ 
                justifyContent: "space-between", 
                flex: 1, flexDirection: "row", 
                flexWrap: "wrap", 
                padding: 20, 
                borderWidth: 0, 
                gap: 12
                }}>
                <Text style={{flex: 7, color: "white", borderWidth: 0}}>Project Name</Text>
                <Text style={{flex: 3, color: "white", textAlign: "left", borderWidth: 0}}>Task Progress</Text>
                <Text style={{flex: 1, color: "white", textAlign: "right", borderWidth: 0}}>Status</Text>
                <Text style={{flex: 3, color: "white", textAlign: "right", borderWidth: 0}}>Employees</Text>
                <Text style={{flex: 2, color: "white", textAlign: "right", borderWidth: 0}}>Deadline</Text>
              </HStack>
              <Divider
                orientation="horizontal"
                style={{ marginTop: 20, marginBottom: 10,  borderWidth: 1, }}
                className="border-primary-500"
              />
            </>
            
          ) : isMediumScreen ? (
            <>
             <HStack style={{ justifyContent: "space-between", flex: 1, flexDirection: "row", flexWrap: "wrap", padding: 20, borderWidth: 1, gap: 12}}>
                <Text style={{flex: 7, color: "white", borderWidth: 0}}>Project Name</Text>
                <Text style={{flex: 3, color: "white", textAlign: "left", borderWidth: 0}}>Task Progress</Text>
                <Text style={{flex: 1, color: "white", textAlign: "right", borderWidth: 0}}>Status</Text>
                <Text style={{flex: 3, color: "white", textAlign: "right", borderWidth: 0}}>Employees</Text>
                <Text style={{flex: 2, color: "white", textAlign: "right", borderWidth: 0}}>Deadline</Text>
              </HStack>
      
              <Divider
                orientation="horizontal"
                style={{ marginTop: 20, marginBottom: 10,  borderWidth: 1, borderColor: "#ffffffff", }}
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
                  // backgroundColor: "#cdcccc",
                  borderWidth: 0,
                  borderColor: "yellow",
                  padding: 12,
                  height: isLargeScreen ? "auto" : isMediumScreen ? "auto" : 120,
                  flexDirection: isLargeScreen || isMediumScreen ? "row" : "column",
                  flex: 1,
                  justifyContent: "space-between",
                  // gap: 20,
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

                    <HStack style={{ flex: 1, gap: 20}}>

                       {/* -------------------------------project <title></title>-------------------------------- */}
                      <Box style={{ borderWidth: 0, borderColor: "orange", flex: 2 }}>
                        <Text
                          style={{
                            textDecorationLine: hoveredId === t.id ? "underline" : "none",
                            flex: 1,
                            flexWrap: "wrap",
                            color: "white",
                            fontWeight: "normal",
                            fontSize: 20,
                            fontFamily: "roboto, arial",

                          }}
                        >
                          {truncateWords(t.title, 7)}
                        </Text>
                      </Box>

                      {/* ------------------------------------------task progress----------------------------------- */}
                      <HStack
                        style={{
                          borderWidth: 0,
                          flex: 1,
                          alignContent: "center",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                        }}
                      >
                        <Progress
                          value={progressCalculation(t.id)}
                          size="sm"
                          orientation="horizontal"
                          style={{flex: 1}}
                        >
                          <ProgressFilledTrack />
                        </Progress>

                        <Text style={{ color: "white", fontFamily: "roboto, arial", fontSize: 20 }}>
                          {progressCalculation(t.id).toFixed(0)}%
                        </Text>
                      </HStack>

                      {/* -----------------------Status-------------------------- */}
                      <Box style={{
                        borderWidth: 0, 
                        alignItems: "center", 
                        justifyContent: "center", 
                        paddingLeft: 12, 
                        paddingRight: 12,
                        borderRadius: 8,
                        backgroundColor: "white",
                        }}>
                        <Text style={{
                          color: t.status === "Ongoing" ? "#2f9c46ff"
                            : t.status === "Completed"
                              ? "#3b82f6ff"
                              : t.status === "Pending"
                                ? "#6b7280ff"
                                : "#ffffff", 
                          fontSize: 20, 
                          fontFamily: "roboto, arial"
                          }}>{t.status}</Text>
                      </Box>

                          {/* --------------------------avatar area--------------------- */}
                      <Box style={{ 
                        borderWidth: 0, 
                        flex: 1, 
                        borderColor: "red", 
                        justifyContent: "center", 
                        alignItems: "center", 
                        }}>
                        <HStack style={{ 
                          gap: isLargeScreen ? 8 : isMediumScreen ? 4 : 0, 
                          alignSelf: "flex-end", 
                          }}>
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

                      {/* -------------------date area-------------------- */}
                      <Text style={{ 
                        borderWidth: 0, 
                        width: 150,
                        borderColor: "blue", 
                        color: "white",
                        alignSelf: "center",
                        textAlign: "right",
                        fontFamily: "roboto, arial",
                        fontSize: 20,
                        }}>
                        {t.deadline?.toDate().toLocaleDateString()}
                      </Text>
                    </HStack>
                  </Pressable>
                </Card>
              ))}
            </View>
          </Box>
        </View> 
      </VStack>

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
    fontWeight: "medium",
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
 

});
