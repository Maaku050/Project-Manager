import { Box } from "@/components/ui/box";
import { Pressable, ScrollView, useWindowDimensions, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { CloseIcon, Icon } from "@/components/ui/icon";
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
// import {  } from "react-native";
import React from "react";
import { TextInput } from "react-native-gesture-handler";
import { db, auth } from "@/firebase/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { isValidRubberBandConfig } from "react-native-reanimated/lib/typescript/animation/decay/utils";
import ProjectAddModal from "@/modals/projectAddModal";

export default function Sample() {
  const router = useRouter();
  const { profiles } = useUser();
  const { project, setSelectedProject } = useProject();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

    const dimensions = useWindowDimensions(); 
    const isLargeScreen = dimensions.width >= 1280; // computer UI condition
    const isMediumScreen = dimensions.width <= 1280 && dimensions.width > 768; // tablet UI condition

  const truncateWords = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + " ..."
      : text;
  };

  const createdByFunction = (uid: string) => {
    if (!profiles) return null;
    const name = profiles.find((t) => t.uid === uid) || null;
    return name?.nickName;
  };

  const addProject = async () => {
    console.log("addProject Function mounted!");
    if (!title || !description || !auth.currentUser) return;
    try {
      await addDoc(collection(db, "project"), {
        title: title,
        description: description,
        createdBy: auth.currentUser.uid,
        status: "Pending",
        startedAt: null,
        deadline: null,
      });

      setShowModal(false);
    } catch (error: any) {
      console.log(error.message);
    } finally {
    }

    setTitle("");
    setDescription("");
  };

  return (
    <>
      <ScrollView
        style={{
          backgroundColor: "#000000",
          padding: isLargeScreen ? 16 : isMediumScreen ? 12 : 8,
        }}
      >
        <Box style={{ margin: 10 }}>
          <Heading
            style={{
              fontSize: 32,
              color: "white",
              fontFamily: "roboto, arial",
              fontWeight: "bold",
            }}
          >
            Projects
          </Heading>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "roboto, arial",
              color: "white",
            }}
          >
            Manage and track your project
          </Text>
        </Box>
        <Box style={{ alignItems: "flex-end", padding: 10 }}>
          <Button style={{ width: 150 }} onPress={() => setShowModal(true)}>
            <ButtonText>Add Project</ButtonText>
          </Button>
        </Box>

        <Divider
          orientation="horizontal"
          style={{
            marginTop: isLargeScreen ? 12 : isMediumScreen ? 8 : 4,
            borderColor: "#1F1F1F",
            borderWidth: 4,
            borderRadius: 8,
          }}
        />
        <View
          style={{
            // backgroundColor: 'white',
            marginTop: 10,
            marginBottom: 30,
            height: "auto",
            borderRadius: 12,
            flexDirection: isLargeScreen
              ? "row"
              : isMediumScreen
              ? "row"
              : "column",
            justifyContent: isLargeScreen
              ? "flex-start"
              : isMediumScreen
              ? "flex-start"
              : "flex-start",
            alignItems: isLargeScreen
              ? "center"
              : isMediumScreen
              ? "flex-start"
              : "flex-start",
            flexWrap: "wrap",
            padding: 12,
          }}
        >
          {project.map((t) => (
            <Card
              size="md"
              variant="outline"
              className="m-3"
              key={t.id}
              style={{
                backgroundColor: "white",
                marginBottom: 8,
                marginTop: 8,
                borderRadius: 12,
                width: isLargeScreen ? "30%" : isMediumScreen ? "40%" : "90%",
                height: isLargeScreen ? 140 : isMediumScreen ? 180 : 120,
                padding: 12,
              }}
            >
              <Pressable
                onPress={() => {
                  setSelectedProject(t.id);
                  router.push("/projectWindow"); // or open modal directly
                }}
                onHoverIn={() => setHoveredId(t.id)}
                onHoverOut={() => setHoveredId(null)}
              >
                <Heading
                  size="md"
                  className="mb-1"
                  style={{
                    textDecorationLine:
                      hoveredId === t.id ? "underline" : "none",
                    color: "black",
                  }}
                >
                  {t.title}
                </Heading>
              </Pressable>

              <Text style={{ fontWeight: "black" }}>
                Created by: {createdByFunction(t.createdBy)}
              </Text>
              <Text size="sm">{truncateWords(t.description, 15)}</Text>
            </Card>
          ))}
        </View>
      </ScrollView>

      <ProjectAddModal
        visible={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
