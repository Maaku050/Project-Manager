import React, { useState } from "react";
import { View, Text, Pressable, useWindowDimensions } from "react-native";
import { useUser } from "@/context/profileContext";
import { useProject } from "@/context/projectContext";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
} from "@/components/ui/avatar";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";

export default function EmployeeScreen() {
  const router = useRouter();
  const { profiles, setSelectedEmployee } = useUser();

  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 1280;
  const isMediumScreen = dimensions.width <= 1280 && dimensions.width > 768;

  const [cardIdHover, setCardIdHover] = useState("");

  return (
    <View style={{ flex: 1, alignItems: "flex-start", backgroundColor: "black", padding: 12}}>
      <HStack style={{
        alignContent: "flex-start",
        gap: isLargeScreen ? 12 : isMediumScreen ? 12 : 8, 
        padding: 12, 
        margin: 12, 
        flexDirection: "row",
        flexWrap: "wrap",
        borderWidth: 2,
        }}>

    <View style={{ flex: 1 }}>
      <Box style={{ alignItems: "flex-end" }}>
        <Button
          action="positive"
          size="sm"
          onPress={() => router.push("/create-account-window")}
        >
          <ButtonText>Create New Account</ButtonText>
        </Button>
      </Box>
      <HStack>
        {profiles.map((t) => (
          <Pressable
            onPress={() => {
              setSelectedEmployee(t.uid);
              router.push("/employee-window");
            }}
            onHoverIn={() => setCardIdHover(t.id)}
            onHoverOut={() => setCardIdHover("")}
          >
            <Card
              key={t.id}
              style={{
                borderWidth: cardIdHover === t.id ? 1 : 0,
                borderColor: "black",
                alignItems: "center",
                alignContent: "center",
                width: isLargeScreen ? 200 : isMediumScreen ? 200 : 200,
                height: 200,
                // flex: 1,
              }}
            >
              <Avatar size="lg">
                <AvatarFallbackText>{t.firstName}</AvatarFallbackText>
                <AvatarBadge />
              </Avatar>
              <Text>
                {t.firstName} {t.lastName}
              </Text>
              <Box style={{ borderWidth: 1 }}>{t.role}</Box>
            </Card>
          </Pressable>
        ))}
      </HStack>
    </View>
  );
}
