import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { Pressable, ScrollView, useWindowDimensions } from "react-native";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { View } from "@/components/Themed";
import { useUser } from "@/context/profileContext";
import { useProject } from "@/context/projectContext";
import { HStack } from "@/components/ui/hstack";
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
  const isLargeScreen = dimensions.width >= 1280; // computer UI condition
  const isMediumScreen = dimensions.width <= 1280 && dimensions.width > 768; // tablet UI condition

  const truncateWords = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  const createdByFunction = (uid: string) => {
    if (!profiles) return null;
    const name = profiles.find((t) => t.uid === uid) || null;
    return name?.nickName;
  };

  const myProject = project.filter((t) => {});
  return (
    <ScrollView style={{ backgroundColor: '#000000ff' }}>
      {/* <View style={{ marginLeft: 50, marginRight: 50, marginTop: 20 }}>
        <Text>{profile ? profile.nickName : ""}</Text>
      </View> */}
        <Box style={{ marginTop: 20, marginLeft: isLargeScreen ? 80 : isMediumScreen ? 40 : 12, marginRight: isLargeScreen ? 80 : isMediumScreen ? 40 : 12, padding: 10, borderRadius: 12, backgroundColor: '#1F1F1F', height: isLargeScreen ? 60 : 50, justifyContent: 'center', alignItems: 'flex-start'}}>
            {/* <Image></Image> */}
             <Text style={{ fontSize: isLargeScreen ? 20 : 16, color: 'white', fontWeight: 'bold', fontFamily: 'roboto, arial' }}>Welcome Home, {profile ? profile.nickName : ""}!</Text>
        </Box>
      
      <View
        style={{
          alignItems: "center",
          marginLeft: isLargeScreen ? 80 : isMediumScreen ? 40 : 12,
          marginRight: isLargeScreen ? 80 : isMediumScreen ? 40 : 12,
          marginTop: isLargeScreen ? 8 : 4,
          paddingTop: 40,
          paddingBottom: 40,
          borderRadius: 12,
          backgroundColor: '#1F1F1F',
        }}
      >
       


        <Box
          style={{
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: isLargeScreen ? 25 : 20, color: 'white', fontWeight: 'bold', fontFamily: 'roboto, arial' }}>
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
          <Text style={{ fontSize: isLargeScreen ? 16 : 12, color: 'white', fontWeight: 'bold', fontFamily: 'roboto, arial' }}>
            {profile?.role}{" "}
          </Text>
        </Box>
      </View>

      <View
        style={{
          marginLeft: isLargeScreen ? 80 : isMediumScreen ? 40 : 12,
          marginRight: isLargeScreen ? 80 : isMediumScreen ? 40 : 12,
          marginTop: 20,
          backgroundColor: '#1F1F1F',
          borderRadius: 12,
          flex: 1,
        }}
      >
        <Box style={{ marginTop: 20, marginBottom: 12, marginLeft: 20, flex: 1, alignItems: "flex-start", justifyContent: "flex-start"}}>
          <Text style={{fontSize: isLargeScreen ? 24 : 20, color: 'white', fontWeight: 'bold', fontFamily: 'roboto, arial', flex: 1}}>My Project</Text>
        </Box>
        <Box  style={{
          justifyContent: isLargeScreen ? 'flex-start' : isMediumScreen ? "flex-start" : 'center', // create another condition for justifyContent
          alignItems: isLargeScreen ? 'flex-start' : isMediumScreen ? "flex-start" : 'center',  // create another condition for alignItems
          flexDirection: isLargeScreen ? 'row' : isMediumScreen ? 'row' : 'column', 
          flexWrap: 'wrap', 
          columnGap: isLargeScreen ? 8 : 0,
          rowGap: isLargeScreen ? 8 : 4,
          paddingLeft: isLargeScreen ? 20 : isMediumScreen ? 28 : 0,
          
          }}>
          {project.map((t) => (
            <Card  variant="outline" className="m-3" key={t.id} 
            style={{ 
              width: isLargeScreen ? "30%" : isMediumScreen ? "40%" : "90%",
              // justifyItems: isLargeScreen ? 'center' : 'center',
              // flexDirection: 'row',
              // justifyContent:'flex-start',
              // alignItems: 'flex-start',
              // flexWrap: 'wrap',
              paddingTop: 12, 
              paddingLeft: 12, 
              paddingRight: 12, 
              paddingBottom: 32,
              height: isLargeScreen ? 140 : isMediumScreen ? 180 : 120, 
              backgroundColor: 'white', 
              borderRadius: 12
              }}>
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

              {/* <Text style={{ fontWeight: "black", marginBottom: 5 }}>
                Created by: {createdByFunction(t.createdBy)}
              </Text> */}
              <Text style={{
                fontSize: isLargeScreen ? 14 : isMediumScreen ? 12 : 12,
                // flexWrap: 'wrap',
              }}>{truncateWords(t.description, isLargeScreen ? 15 : isMediumScreen ? 12 : 15)}</Text>
            </Card>
          ))}
        </Box>
      </View>
    </ScrollView>
  );
}
