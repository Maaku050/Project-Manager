import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { Pressable, ScrollView, StyleSheet, useWindowDimensions } from "react-native";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { View } from "@/components/Themed";
import { useUser } from "@/context/profileContext";
import { useProject } from "@/context/projectContext";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Divider } from "@/components/ui/divider";
// import { useWindowDimensions } from "react-native";
import { VStack } from "@/components/ui/vstack";

export default function Home() {
  const router = useRouter();
  const { profiles } = useUser();
  const { project } = useProject();
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

  const myProject = project.filter((t) => {});
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
            <Text>Completed</Text>
          </Box>
          <Box style={styles.HstackContainer}>
            <Text>In progress</Text>
          </Box>
          <Box style={styles.HstackContainer}>
            <Text>To Do</Text>
          </Box>
          <Box style={styles.HstackContainer}>
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
              <Box style={styles.VstackContainer}>
                <Text>Completed</Text>
              </Box>
              <Box style={styles.VstackContainer}>
                <Text>In progress</Text>
              </Box>
            </HStack>

            <HStack>
              <Box style={styles.VstackContainer}>
                <Text>To Do</Text>
              </Box>
              <Box style={styles.VstackContainer}>
                <Text>Overdue</Text>
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
              <Card size="md" variant="outline" className="m-3" key={t.id}>
                <Pressable
                  // onPress={() => {
                  //   setSelectedProject(t.id);
                  //   router.push("/projectModal"); // or open modal directly
                  // }}
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

                <Text style={{ fontWeight: "black" }}>
                  Created by: {createdByFunction(t.createdBy)}
                </Text>
                <Text size="sm">{truncateWords(t.description, 30)}</Text>
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
