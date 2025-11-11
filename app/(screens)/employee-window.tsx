import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useUser } from "@/context/profileContext";
import { useProject } from "@/context/projectContext";

export default function EmployeeWindow() {
  const { selectedEmployee, profiles } = useUser();
  const { project, assignedUser } = useProject();

  const currentUser = profiles.find((t) => t.uid === selectedEmployee);
  const currentUserProjects = project.filter((p) =>
    assignedUser.some((a) => p.id === a.projectID && a.uid === currentUser?.uid)
  );

  useEffect(() => {
    console.log("Employee window current user projects: ", currentUserProjects);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Text>{currentUser?.nickName}</Text>
    </View>
  );
}
