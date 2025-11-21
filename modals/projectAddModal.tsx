import { Box } from "@/components/ui/box";
import { ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { CheckIcon, CloseIcon, Icon } from "@/components/ui/icon";
import { View } from "@/components/Themed";
import { useUser } from "@/context/profileContext";
import { useProject } from "@/context/projectContext";
import { Heading } from "@/components/ui/heading";
import {
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Modal,
} from "@/components/ui/modal";
import { useEffect, useState } from "react";
import React from "react";
import { TextInput } from "react-native-gesture-handler";
import { auth, db } from "@/firebase/firebaseConfig";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { HStack } from "@/components/ui/hstack";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
} from "@/components/ui/checkbox";
import { VStack } from "@/components/ui/vstack";
import {
  Avatar,
  AvatarFallbackText,
  AvatarBadge,
} from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import DateTimePicker from "@/components/DateTimePicker";
import { Textarea, TextareaInput } from "@/components/ui/textarea";

type projectModalType = {
  visible: boolean;
  onClose: () => void;
};

export default function ProjectAddModal({
  visible,
  onClose,
}: projectModalType) {
  // UseStates
  const [tempTitle, setTempTitle] = useState<string>("");
  const [tempDescription, setTempDescription] = useState<string>("");
  const [tempStart, setTempStart] = useState<Date | null>(null);
  const [tempEnd, setTempEnd] = useState<Date | null>(null);
  const [tempDeadline, setTempDeadline] = useState<Date | null>(null);
  const [tempAssigned, setTempAssigned] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Contexts
  const { selectedProject, project, assignedUser } = useProject();
  const { profiles } = useUser();

  // On Load Innitializations
  useEffect(() => {
    if (!visible) return;

    // Initiallize Fields
    setTempTitle("");
    setTempDescription("");
    setTempDeadline(null);
    setTempAssigned([]);
  }, [visible]);

  // Functions
  const addProject = async () => {
    if (
      !tempTitle.trim() ||
      !tempDescription.trim() ||
      !tempDeadline ||
      !auth.currentUser
    )
      return;

    setIsSaving(true);
    try {
      const localDeadline = new Date(tempDeadline);
      localDeadline.setHours(0, 0, 0, 0);

      const docRef = await addDoc(collection(db, "project"), {
        title: tempTitle.trim(),
        description: tempDescription.trim(),
        createdBy: auth.currentUser.uid,
        status: "Ongoing",
        startedAt: Timestamp.now(),
        deadline: Timestamp.fromDate(localDeadline),
      });

      const projectID = docRef.id;

      await handleSaveAssignedUsers(projectID);
    } catch (error: any) {
      console.log("Error adding task:", error.message);
    } finally {
      setIsSaving(false);
      onClose();
    }
  };

  const handleSaveAssignedUsers = async (projectID: string) => {
    try {
      const userRef = collection(db, "assignedUser");

      // (Optional) If you want to remove any existing assignments for this task (usually unnecessary for new ones)
      //   const q = query(userRef, where("taskID", "==", taskID));
      //   const snapshot = await getDocs(q);
      //   for (const docSnap of snapshot.docs) {
      //     await deleteDoc(docSnap.ref);
      //   }

      for (const uid of tempAssigned) {
        await addDoc(userRef, {
          projectID,
          uid,
        });
      }
    } catch (err) {
      console.error("Error saving task assignments:", err);
    }
  };

  return (
    <Modal isOpen={visible} onClose={onClose} size="full">
      <ModalBackdrop />
      <ModalContent
        style={{
          borderColor: "red",
          borderWidth: 0,
          backgroundColor: "#000000",
          width: 892,
          height: 530,
        }}
      >
        <ModalHeader>
          <Heading size="lg" style={{ color: "#ffffff" }}>
            Add Project
          </Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} color="#ffffff" />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <HStack>
            <Box
              style={{
                borderWidth: 0,
                flex: 1,
                marginRight: 10,
                marginTop: 25,
              }}
            >
              <Box style={{ borderWidth: 0, marginBottom: 20 }}>
                <Text
                  style={{
                    marginBottom: 5,
                    color: "#ffffff",
                  }}
                >
                  Project name
                </Text>
                <TextInput
                  style={{
                    backgroundColor: "white",
                    paddingVertical: 10,
                    fontSize: 16,
                    borderRadius: 8,
                    paddingHorizontal: 15,
                    outline: "none",
                    outlineWidth: 0,
                    outlineColor: "transparent",
                  }}
                  placeholder="Enter project name"
                  value={tempTitle}
                  onChangeText={setTempTitle}
                />
              </Box>

              <Box style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    marginBottom: 5,
                    color: "#ffffff",
                  }}
                >
                  Project Description
                </Text>
                <Textarea
                  size="md"
                  isReadOnly={false}
                  isInvalid={false}
                  style={{
                    backgroundColor: "#ffffff",
                    height: 110,
                  }}
                >
                  <TextareaInput
                    placeholder="Enter your Project Description"
                    value={tempDescription}
                    onChangeText={setTempDescription}
                  />
                </Textarea>
              </Box>

              <Box style={{ margin: 5 }}>
                <Text style={{ color: "#ffffff" }}>Project Deadline</Text>
                <DateTimePicker
                  value={tempDeadline}
                  onChange={setTempDeadline}
                  mode="date"
                  placeholder="Select a date and time"
                />
              </Box>
            </Box>

            {/* Members */}
            <Box
              style={{ borderWidth: 0, flex: 1, marginLeft: 10, marginTop: 25 }}
            >
              <Text style={{ color: "#ffffff" }}>Project Members</Text>

              <ScrollView
                style={{
                  marginTop: 5,
                  borderWidth: 0,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  padding: 10,
                  backgroundColor: "#fff",
                  height: 302,
                }}
                showsVerticalScrollIndicator={false}
              >
                {/* Members List */}
                <VStack space="sm">
                  {[
                    "Project Manager",
                    "UI/UX",
                    "Fullstack Developer",
                    "Front-End Developer",
                    "Back-End Developer",
                    "Mobile Developer",
                    "Game Developer",
                    "Quality Assurance",
                    "Intern",
                  ]
                    .filter((role) =>
                      profiles.some(
                        (profile) =>
                          profile.role?.toLowerCase() === role.toLowerCase()
                      )
                    )
                    .map((role, i) => {
                      const matchingProfiles = profiles.filter(
                        (profile) =>
                          profile.role?.toLowerCase() === role.toLowerCase()
                      );

                      return (
                        <View key={i}>
                          <HStack
                            style={{
                              alignItems: "center",
                              justifyContent: "space-between",
                              paddingVertical: 6,
                            }}
                          >
                            <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                              {role}
                            </Text>
                          </HStack>

                          <VStack>
                            {matchingProfiles.map((p) => {
                              const isChecked = tempAssigned.includes(p.uid);

                              const toggleCheck = () => {
                                setTempAssigned((prev) =>
                                  isChecked
                                    ? prev.filter((uid) => uid !== p.uid)
                                    : [...prev, p.uid]
                                );
                                console.log(tempAssigned);
                              };

                              return (
                                <HStack
                                  key={p.uid}
                                  style={{
                                    alignItems: "center",
                                    marginTop: 10,
                                  }}
                                >
                                  <Checkbox
                                    isChecked={isChecked}
                                    onChange={toggleCheck}
                                    value={p.uid}
                                    accessibilityLabel={`${p.firstName} ${p.lastName}`}
                                    hitSlop={{
                                      top: 10,
                                      bottom: 10,
                                      left: 10,
                                      right: 10,
                                    }}
                                  >
                                    <CheckboxIndicator>
                                      <CheckboxIcon as={CheckIcon} />
                                    </CheckboxIndicator>
                                  </Checkbox>

                                  <Avatar size="sm" style={{ marginLeft: 8 }}>
                                    <AvatarFallbackText>
                                      {p.firstName}
                                    </AvatarFallbackText>
                                    <AvatarBadge />
                                  </Avatar>

                                  <Text
                                    style={{
                                      fontSize: 13,
                                      marginLeft: 10,
                                    }}
                                  >
                                    {p.firstName} {p.lastName}
                                  </Text>
                                </HStack>
                              );
                            })}
                          </VStack>
                        </View>
                      );
                    })}
                </VStack>
              </ScrollView>
            </Box>
          </HStack>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="outline"
            action="secondary"
            className="mr-3"
            onPress={onClose}
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button onPress={addProject}>
            <ButtonText>
              {isSaving ? <Spinner size="small" color="grey" /> : "Save"}
            </ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
