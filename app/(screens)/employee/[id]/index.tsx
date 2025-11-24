import React from "react";
import { Text, useWindowDimensions } from "react-native";
import { useUser } from "@/context/profileContext";
import { useProject } from "@/context/projectContext";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import { Status } from "@/_enums/status.enum";
import ClosedProjectCard from "@/components/Employee/ClosedProjectCard";
import OnGoingProjectCard from "@/components/Employee/OnGoingProjectCard";
import OverdueProjectCard from "@/components/Employee/OverdueProjectCard";
import UserProfileCard from "@/components/Employee/UserProfileCard";
import EmployeeProfileSkeleton from "@/components/Skeleton/EmployeeProfileSkeleton";

export default function EmployeeWindow() {
  const { profiles } = useUser();
  const { id } = useLocalSearchParams();
  const { project, assignedUser, setSelectedProject, tasks } = useProject();

  const currentUser = profiles?.find((profile) => profile.uid === id);

  const currentUserProjects = project.filter((project) =>
    assignedUser.some(
      (assignedUser) =>
        project.id === assignedUser.projectID &&
        assignedUser.uid === currentUser?.uid &&
        project.status !== Status.ARCHIVED
    )
  );

  const isLoading = !currentUser;

  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 1280;
  const isMediumScreen = dimensions.width <= 1280 && dimensions.width > 768;

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#000000ff",
        paddingTop: 0,
        paddingBottom: 40,
      }}
    >
      <VStack
        style={{
          borderWidth: 0,
          borderColor: "red",
          minHeight: "100%",
          gap: isLargeScreen ? 16 : isMediumScreen ? 12 : 8,
        }}
      >
        <Box
          style={{
            backgroundColor: "transparent",
            justifyContent: "center",
            padding: 12,
            borderWidth: 0,
            gap: 20,
          }}
        >
          {!isLoading ? (
            <>
              <UserProfileCard profile={currentUser} />
              <Text style={{ color: "white", fontSize: 20, fontWeight: 500 }}>
                Project Collaborated ({currentUserProjects.length} Total Projects)
              </Text>
              <OverdueProjectCard project={currentUserProjects} />
              <OnGoingProjectCard project={currentUserProjects} />
              <ClosedProjectCard project={currentUserProjects} />
            </>
          ) : (
            <EmployeeProfileSkeleton />
          )}
        </Box>
      </VStack>
    </ScrollView>
  );
}
