import { Box } from "@/components/ui/box";
import { Pressable, ScrollView } from "react-native";
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
import React from "react";
import { TextInput } from "react-native-gesture-handler";
import { db, auth } from "@/firebase/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import ProjectAddModal from "@/modals/projectAddModal";

export default function Sample() {
  const router = useRouter();
  const { profiles } = useUser();
  const { project, setSelectedProject } = useProject();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
      <ScrollView>
        <Box style={{ margin: 10 }}>
          <Heading style={{ fontSize: 32 }}>Projects</Heading>
          <Text style={{ fontSize: 12 }}>Manage and track your project</Text>
        </Box>
        <Box style={{ alignItems: "flex-end", padding: 10 }}>
          <Button style={{ width: 150 }} onPress={() => setShowModal(true)}>
            <ButtonText>Add Project</ButtonText>
          </Button>
        </Box>

        <Divider orientation="horizontal" style={{ marginTop: 10 }} />
        {project.map((t) => (
          <Card size="md" variant="outline" className="m-3" key={t.id}>
            <Pressable
              onPress={() => {
                setSelectedProject(t.id);
                router.push("/projectModal"); // or open modal directly
              }}
              onHoverIn={() => setHoveredId(t.id)}
              onHoverOut={() => setHoveredId(null)}
            >
              <Heading
                size="md"
                className="mb-1"
                style={{
                  textDecorationLine: hoveredId === t.id ? "underline" : "none",
                }}
              >
                {t.title}
              </Heading>
            </Pressable>

            <Text style={{ fontWeight: "black" }}>
              Created by: {createdByFunction(t.createdBy)}
            </Text>
            <Text size="sm">{truncateWords(t.description, 30)}</Text>
          </Card>
        ))}
      </ScrollView>

      {/* <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg">Add project</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text>Title</Text>
            <TextInput
              style={{ borderWidth: 1, borderRadius: 10, height: 40 }}
              value={title}
              onChangeText={setTitle}
            ></TextInput>
            <Text>Description</Text>
            <TextInput
              style={{ borderWidth: 1, borderRadius: 10, height: 40 }}
              value={description}
              onChangeText={setDescription}
            ></TextInput>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              className="mr-3"
              onPress={() => {
                setShowModal(false);
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              onPress={() => {
                setShowModal(false);
              }}
            >
              <ButtonText onPress={addProject}>Save</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}

      <ProjectAddModal
        visible={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
