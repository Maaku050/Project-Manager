import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
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

  const [cardIdHover, setCardIdHover] = useState("");

  return (
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
