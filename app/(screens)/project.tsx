import { Box } from "@/components/ui/box";
import { Pressable, ScrollView, useWindowDimensions, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { useUser } from "@/context/profileContext";
import { useProject } from "@/context/projectContext";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Divider } from "@/components/ui/divider";
import { useState } from "react";
import React from "react";
import { db, auth } from "@/firebase/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import ProjectAddModal from "@/modals/projectAddModal";
import {
  Avatar,
  AvatarFallbackText,
  AvatarBadge,
} from "@/components/ui/avatar";
import { HStack } from "@/components/ui/hstack";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { VStack } from "@/components/ui/vstack";

export default function Sample() {
  const router = useRouter();
  const { profiles } = useUser();
  const { project, setSelectedProject, tasks, assignedUser } = useProject();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 1280; // computer UI condition
  const isMediumScreen = dimensions.width <= 1280 && dimensions.width > 768; // tablet UI condition

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

  const addProject = async () => {
    console.log("addProject Function mounted!");
    if (!title || !description || !auth.currentUser) return;
    try {
      await addDoc(collection(db, "project"), {
        title: title,
        description: description,
        createdBy: auth.currentUser.uid,
        status: "Pending",
        startedAt: null,
        deadline: null,
      });

      setShowModal(false);
    } catch (error: any) {
      console.log(error.message);
    } finally {
    }

    setTitle("");
    setDescription("");
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

      <ScrollView
        style={{
          backgroundColor: "#000000",
          padding: isLargeScreen ? 16 : isMediumScreen ? 12 : 8,
          minHeight: "100%",
          borderColor: "red",
          borderWidth: 0,
        }}
      >
        <Box style={{ margin: 10 }}>
          <Heading
            style={{
              fontSize: 32,
              color: "white",
              fontFamily: "roboto, arial",
              fontWeight: "bold",
            }}
          >
            Projects
          </Heading>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "roboto, arial",
              color: "white",
            }}
          >
            Manage and track your project
          </Text>
        </Box>
        <Box style={{ alignItems: "flex-end", padding: 10 }}>
          <Button style={{ width: 150 }} onPress={() => setShowModal(true)}>
            <ButtonText>Add Project</ButtonText>
          </Button>
        </Box>

        <Divider
          orientation="horizontal"
          style={{
            marginTop: isLargeScreen ? 12 : isMediumScreen ? 8 : 4,
            borderColor: "#1F1F1F",
            borderWidth: 4,
            borderRadius: 8,
          }}
        />
        <View
          
          style={{
            // backgroundColor: 'white',
            marginTop: 10,
            marginBottom: 30,
            minHeight: "auto",
            maxHeight: "100%",
            borderWidth: 0,
            borderColor: "white",
            borderRadius: 12,
            flexDirection: isLargeScreen
              ? "row"
              : isMediumScreen
              ? "row"
              : "column",
            justifyContent: "flex-start",
            alignItems: "stretch",
            flexWrap: "wrap",
            padding: 12,
          }}
        >
          {project.map((t) => (
            <Card
              size="md"
              variant="outline"
              className="m-3"
              key={t.id}
              style={{
                backgroundColor: "white",
                marginBottom: 8,
                marginTop: 8,
                borderRadius: 12,
                // width: isLargeScreen ? "30%" : isMediumScreen ? "40%" : "90%",
                // height: isLargeScreen ? 140 : isMediumScreen ? 180 : 120,
                padding: 12,
                flexBasis: isLargeScreen ? "30.5%" : isMediumScreen ? "30%" : "10%",
                minWidth: isLargeScreen || isMediumScreen ? undefined : "90%",
                minHeight: 120,
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
                    color: "black",
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
        </View>

          <ProjectAddModal
        visible={showModal}
        onClose={() => setShowModal(false)}
      />

      </ScrollView>

  );
}
