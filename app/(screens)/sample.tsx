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
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";

export default function Sample() {
  const router = useRouter();
  const { user, profile } = useUser();
  const { project, tasks, comment, assignedUser } = useProject();

  const truncateWords = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  return (
    <>
      <View>
        {project.map((t) => (
          <Card size="md" variant="outline" className="m-3" key={t.id}>
            <Heading size="md" className="mb-1">
              {t.title}
            </Heading>
            <Text size="sm">{truncateWords(t.description, 30)}</Text>
          </Card>
        ))}
      </View>
    </>
  );
}
