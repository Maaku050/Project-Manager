import { Box } from "@/components/ui/box";
import { ScrollView, useWindowDimensions, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useProject } from "@/context/projectContext";
import { Heading } from "@/components/ui/heading";
import { useState } from "react";
import React from "react";
import ProjectAddModal from "@/modals/projectAddModal";
import { HStack } from "@/components/ui/hstack";
import { Plus } from "lucide-react-native";
import ProjectCard from "@/components/projectCard";

export default function Sample() {
  const { project } = useProject();
  const [showModal, setShowModal] = useState(false);

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

  return (
    <>
      {!ongoingProjects && !closedProjects && !overdueProjects ? (
        <View
          style={{
            backgroundColor: "#000000",
            padding: isLargeScreen ? 20 : isMediumScreen ? 12 : 8,
            minHeight: "100%",
            borderColor: "red",
            borderWidth: 0,
            flex: 1,
          }}
        >
          <Box style={{ borderWidth: 0, marginBottom: 30 }}>
            <HStack
              style={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Heading
                style={{
                  fontSize: 18,
                  color: "white",
                  fontFamily: "roboto, arial",
                  fontWeight: "bold",
                }}
              >
                {project.length} total projects
              </Heading>
              <Button
                style={{ backgroundColor: "white", borderRadius: 8 }}
                onPress={() => setShowModal(true)}
              >
                <ButtonText style={{ color: "black" }}>
                  <HStack>
                    <Plus /> Add Project
                  </HStack>
                </ButtonText>
              </Button>
            </HStack>
          </Box>

          {true ? (
            <Box
              style={{
                flex: 1,
                borderWidth: 0,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Heading
                style={{
                  fontSize: 16,
                  color: "gray",
                  fontFamily: "arial",
                }}
              >
                No Project yet
              </Heading>
              <Text>There is no Project for now</Text>
            </Box>
          ) : (
            ""
          )}
        </View>
      ) : (
        <ScrollView
          style={{
            backgroundColor: "#000000",
            padding: isLargeScreen ? 20 : isMediumScreen ? 12 : 8,
            minHeight: "100%",
            borderColor: "red",
            borderWidth: 0,
            flex: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Box style={{ borderWidth: 0, marginBottom: 30 }}>
            <HStack
              style={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Heading
                style={{
                  fontSize: 18,
                  color: "white",
                  fontFamily: "roboto, arial",
                  fontWeight: "bold",
                }}
              >
                {project.length} total projects
              </Heading>
              <Button
                style={{ backgroundColor: "white", borderRadius: 8 }}
                onPress={() => setShowModal(true)}
              >
                <ButtonText style={{ color: "black" }}>
                  <HStack>
                    <Plus /> Add Project
                  </HStack>
                </ButtonText>
              </Button>
            </HStack>
          </Box>

          {overdueProjects.length > 0 ? (
            <Box
              style={{
                borderWidth: 0,
                padding: 20,
                borderRadius: 8,
                backgroundColor: "#171717",
                marginBottom: 10,
              }}
            >
              <Box style={{ marginBottom: 20 }}>
                <HStack style={{ justifyContent: "space-between" }}>
                  <Heading style={{ color: "white" }}>Overdue Projects</Heading>
                  <Text
                    style={{
                      color: "white",
                      fontFamily: "arial",
                      fontSize: 16,
                    }}
                  >
                    {overdueProjects.length} project/s
                  </Text>
                </HStack>
              </Box>
              <HStack
                style={{
                  alignContent: "flex-start",
                  gap: isLargeScreen ? 12 : isMediumScreen ? 12 : 8,
                  padding: 12,
                  margin: 12,
                  flexDirection: "row",
                  flexWrap: "wrap",
                  borderWidth: 0,
                  alignItems: "stretch",
                }}
              >
                {overdueProjects.map((t) => (
                  <ProjectCard key={t.id} projectID={t.id} />
                ))}
              </HStack>
            </Box>
          ) : (
            ""
          )}

          {ongoingProjects.length > 0 ? (
            <Box
              style={{
                borderWidth: 0,
                padding: 20,
                borderRadius: 8,
                backgroundColor: "#171717",
                marginBottom: 10,
              }}
            >
              <Box style={{ marginBottom: 20 }}>
                <HStack style={{ justifyContent: "space-between" }}>
                  <Heading style={{ color: "white" }}>Ongoing Projects</Heading>
                  <Text
                    style={{
                      color: "white",
                      fontFamily: "arial",
                      fontSize: 16,
                    }}
                  >
                    {ongoingProjects.length} project/s
                  </Text>
                </HStack>
              </Box>
              <HStack
                style={{
                  alignContent: "flex-start",
                  gap: isLargeScreen ? 12 : isMediumScreen ? 12 : 8,
                  padding: 12,
                  margin: 12,
                  flexDirection: "row",
                  flexWrap: "wrap",
                  borderWidth: 0,
                  alignItems: "stretch",
                }}
              >
                {ongoingProjects.map((t) => (
                  <ProjectCard key={t.id} projectID={t.id} />
                ))}
              </HStack>
            </Box>
          ) : (
            ""
          )}

          {closedProjects.length > 0 ? (
            <Box
              style={{
                borderWidth: 0,
                padding: 20,
                borderRadius: 8,
                backgroundColor: "#171717",
                marginBottom: 10,
              }}
            >
              <Box style={{ marginBottom: 20 }}>
                <HStack style={{ justifyContent: "space-between" }}>
                  <Heading style={{ color: "white" }}>Closed Projects</Heading>
                  <Text
                    style={{
                      color: "white",
                      fontFamily: "arial",
                      fontSize: 16,
                    }}
                  >
                    {closedProjects.length} project/s
                  </Text>
                </HStack>
              </Box>
              <HStack
                style={{
                  alignContent: "flex-start",
                  gap: isLargeScreen ? 12 : isMediumScreen ? 12 : 8,
                  padding: 12,
                  margin: 12,
                  flexDirection: "row",
                  flexWrap: "wrap",
                  borderWidth: 0,
                  alignItems: "stretch",
                }}
              >
                {closedProjects.map((t) => (
                  <ProjectCard key={t.id} projectID={t.id} />
                ))}
              </HStack>
            </Box>
          ) : (
            ""
          )}

          <ProjectAddModal
            visible={showModal}
            onClose={() => setShowModal(false)}
          />
        </ScrollView>
      )}
    </>
  );
}
