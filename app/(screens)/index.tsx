import React from "react";
import Gradient from "@/assets/icons/Gradient";
import Logo from "@/assets/icons/Logo";
import { Box } from "@/components/ui/box";
import { ScrollView } from "react-native";
import { Text } from "@/components/ui/text";

import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { Icon } from "@/components/ui/icon";
import { View } from "@/components/Themed";
import { useUser } from "@/context/profileContext";
import { useProject } from "@/context/projectContext";

export default function Home() {
  const router = useRouter();
  const { user, profile } = useUser();
  const { project, tasks, comment, assignedUser } = useProject();
  return (
    <View>
      <Text>{profile?.nickName}</Text>
      {tasks.map((p) => (
        <Text key={p.id}>{p.text}</Text>
      ))}
    </View>
  );
}
