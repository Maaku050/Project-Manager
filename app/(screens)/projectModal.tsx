import Gradient from "@/assets/icons/Gradient";
import Logo from "@/assets/icons/Logo";
import { Box } from "@/components/ui/box";
import { ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { CloseIcon, Icon } from "@/components/ui/icon";
import { View } from "@/components/Themed";
import { useUser } from "@/context/profileContext";
import { useProject } from "@/context/projectContext";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Divider } from "@/components/ui/divider";
import {
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Modal,
} from "@/components/ui/modal";
import { useState } from "react";
import React from "react";
import { TextInput } from "react-native-gesture-handler";
import { db, auth } from "@/firebase/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function ProjectModal({ projectID }: { projectID: string }) {
  const { selectedProject } = useProject();
  return <Text>Project ID: {selectedProject}</Text>;
}
