import React, { useState } from "react";
import { Text, useWindowDimensions, ScrollView } from "react-native";
import { useUser } from "@/context/profileContext";
import { Box } from "@/components/ui/box";
import { Button, ButtonGroup, ButtonIcon, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { AddIcon } from "@/components/ui/icon";
import ProjectManagerCard from "@/components/_employee/ProjectManagerCard";
import FullStackDeveloperCard from "@/components/_employee/FullStackDeveloperCard";
import UXDesignerCard from "@/components/_employee/UXDesignerCard";
import QACard from "@/components/_employee/QACard";
import InternCard from "@/components/_employee/InternCard";

export default function EmployeeScreen() {
  const router = useRouter();
  const { profiles, setSelectedEmployee } = useUser();
  console.log("🚀 ~ EmployeeScreen ~ profiles:", profiles);

  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 1280;
  const isMediumScreen = dimensions.width <= 1280 && dimensions.width > 768;

  const [cardIdHover, setCardIdHover] = useState("");

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "black",
      }}
      contentContainerStyle={{
        alignItems: "flex-start",
        padding: 12,
      }}
    >
      <Box style={{ gap: 20, width: "100%" }}>
        <Box style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Box>
            <Text style={{ color: "white", fontSize: 24, fontWeight: 800 }}>
              {profiles.length} total employee/s
            </Text>
          </Box>
          <Box style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Button
              size="md"
              style={{ width: 118 }}
              action="default"
              className="data-[hover=true]:bg-transparent"
            >
              <ButtonText style={{ fontSize: 18, fontWeight: 500 }}>Add role</ButtonText>
            </Button>
            <ButtonGroup>
              <Button
                size="md"
                onPress={() => router.push("/create-account-window")}
                style={{ width: 192, backgroundColor: "#FDFDFD" }}
              >
                <ButtonIcon as={AddIcon} size="sm" color="#000000" />
                <ButtonText style={{ fontSize: 18, fontWeight: 500, color: "#000000" }}>
                  Add Employee
                </ButtonText>
              </Button>
            </ButtonGroup>
          </Box>
        </Box>
        <ProjectManagerCard profiles={profiles} />
        <FullStackDeveloperCard profiles={profiles} />
        <UXDesignerCard profiles={profiles} />
        <QACard profiles={profiles} />
        <InternCard profiles={profiles} />
      </Box>
    </ScrollView>
  );
}
