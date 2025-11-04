import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { Pressable, ScrollView, useWindowDimensions } from "react-native";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { View } from "@/components/Themed";
import { useUser } from "@/context/profileContext";
import { useProject } from "@/context/projectContext";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  AvatarBadge,
} from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";

export default function Home() {
  const router = useRouter();
  const { user, profile, profiles } = useUser();
  const { project, tasks, comment, assignedUser } = useProject();
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
    <ScrollView>
      {/* <View style={{ marginLeft: 50, marginRight: 50, marginTop: 20 }}>
        <Text>{profile ? profile.nickName : ""}</Text>
      </View> */}
      <View
        style={{
          alignItems: "center",
          marginLeft: isLargeScreen ? 50 : 15,
          marginRight: isLargeScreen ? 50 : 15,
          marginTop: isLargeScreen ? 20 : 10,
          paddingTop: 40,
          paddingBottom: 40,
        }}
      >
        <Box
          style={{
            borderWidth: 0,
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: isLargeScreen ? 25 : 20 }}>
            {profile
              ? profile.firstName +
                ' "' +
                profile.nickName +
                '" ' +
                profile.lastName
              : ""}
          </Text>
        </Box>
        <Box
          style={{
            borderWidth: 0,
            marginBottom: 20,
          }}
        >
          <Avatar size="2xl">
            <AvatarFallbackText>Jane Doe</AvatarFallbackText>
            <AvatarImage
              source={{
                uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
              }}
            />
            <AvatarBadge />
          </Avatar>
        </Box>
        <Box>
          <Text style={{ fontSize: isLargeScreen ? 25 : 20 }}>
            {profile?.role}{" "}
          </Text>
        </Box>
      </View>

      <View
        style={{
          marginLeft: isLargeScreen ? 50 : 15,
          marginRight: isLargeScreen ? 50 : 15,
          marginTop: 20,
        }}
      >
        <Box style={{ margin: 10 }}>
          <Text>MyProject</Text>
        </Box>
        <Box>
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
        </Box>
      </View>
    </ScrollView>
  );
}
