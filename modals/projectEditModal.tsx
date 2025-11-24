import { Box } from "@/components/ui/box";
import { ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { CheckIcon, CloseIcon, Icon } from "@/components/ui/icon";
import { View } from "@/components/Themed";
import { useUser } from "@/context/profileContext";
import { useProject } from "@/context/projectContext";
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
import { useEffect, useState } from "react";
import React from "react";
import { TextInput } from "react-native-gesture-handler";
import { db } from "@/firebase/firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
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

export default function ProjectEditModal({
  visible,
  onClose,
}: projectModalType) {
  // UseStates
  const [tempTitle, setTempTitle] = useState<string>("");
  const [tempDescription, setTempDescription] = useState<string>("");
  const [tempDeadline, setTempDeadline] = useState<Date | null>(null);
  const [tempAssigned, setTempAssigned] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Contexts
  const { selectedProject, project, assignedUser } = useProject();
  const { profiles } = useUser();

  // On Load Innitializations
  const currentProjectData = project.find((t) => t.id === selectedProject);
  const projectDeadline =
    currentProjectData?.deadline && "toDate" in currentProjectData.deadline
      ? currentProjectData.deadline.toDate()
      : null;

  // Remove other tempAssigned effects and use only this one:
  useEffect(() => {
    if (!visible) return;

    // Initialize assigned users for this project when modal opens
    const assignedUids = assignedUser
      .filter((a) => a.projectID === selectedProject)
      .map((a) => a.uid);

    setTempAssigned(assignedUids);

    // Initialize other fields
    if (currentProjectData) {
      const projectDeadline =
        currentProjectData.deadline && "toDate" in currentProjectData.deadline
          ? currentProjectData.deadline.toDate()
          : null;
      setTempTitle(currentProjectData.title);
      setTempDescription(currentProjectData.description);
      setTempDeadline(projectDeadline);
    }
  }, [visible]);

  // Functions
  const handleSave = async () => {
    if (!tempTitle.trim() || !tempDescription.trim() || !tempDeadline) return;
    if (!selectedProject) return;
    setIsSaving(true);
    try {
      const projectRef = doc(db, "project", selectedProject);
      const localDeadline = new Date(tempDeadline);
      localDeadline.setHours(0, 0, 0, 0);

      await updateDoc(projectRef, {
        title: tempTitle.trim(),
        description: tempDescription.trim(),
        deadline: Timestamp.fromDate(localDeadline),
      });

      await handleSaveAssignedUsers(); // ✅ Save assigned users last
    } catch (err) {
      console.error("Error saving project details: ", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAssignedUsers = async () => {
    try {
      const userRef = collection(db, "assignedUser");

      // Get current assignments for this project
      const q = query(userRef, where("projectID", "==", selectedProject));
      const snapshot = await getDocs(q);

      // Map current assignments
      const currentAssignments = snapshot.docs.map((doc) => ({
        id: doc.id,
        uid: doc.data().uid,
        ref: doc.ref,
      }));

      const currentUIDs = new Set(currentAssignments.map((a) => a.uid));
      const tempUIDs = new Set(tempAssigned);

      // Find users to remove (in current but not in temp)
      const toRemove = currentAssignments.filter((a) => !tempUIDs.has(a.uid));

      // Find users to add (in temp but not in current)
      const toAdd = tempAssigned.filter((uid) => !currentUIDs.has(uid));

      // Batch delete users not in tempAssigned
      const deletePromises = toRemove.map((a) => deleteDoc(a.ref));

      // Batch add new users
      const addPromises = toAdd.map((uid) =>
        addDoc(userRef, {
          projectID: selectedProject,
          uid,
        })
      );

      // Execute all operations in parallel
      await Promise.all([...deletePromises, ...addPromises]);

      onClose();
    } catch (err) {
      console.error("Error saving assignments:", err);
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
            Edit Project
          </Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} color="white" />
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
                  Project Name
                </Text>
                <TextInput
                  style={{
                    borderBottomWidth: 1,
                    borderColor: "#fff",
                    paddingVertical: 8,
                    fontSize: 16,
                    color: "#ffffffff",
                  }}
                  placeholder="Enter your Project Title"
                  placeholderTextColor="#999"
                  defaultValue={currentProjectData?.title}
                  onChangeText={setTempTitle}
                />
              </Box>

              <Box style={{ borderWidth: 0, marginBottom: 20 }}>
                <Text
                  style={{
                    marginBottom: 5,
                    color: "#ffffff",
                  }}
                >
                  Project Description
                </Text>
                <Textarea
                  size="sm"
                  isReadOnly={false}
                  isInvalid={false}
                  style={{ maxHeight: 200 }}
                >
                  <TextareaInput
                    style={{ color: "#000000", backgroundColor: "#ffffff" }}
                    placeholder="Enter your Project Description"
                    defaultValue={currentProjectData?.description}
                    onChangeText={setTempDescription}
                  />
                </Textarea>
              </Box>

              <Box style={{ margin: 5 }}>
                <Text
                  style={{
                    marginBottom: 5,
                    color: "#ffffff",
                  }}
                >
                  Project Deadline
                </Text>
                <DateTimePicker
                  value={tempDeadline ? tempDeadline : projectDeadline}
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
              <Text style={{ color: "#ffffffff" }}>Project Members</Text>

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
                            <Divider
                              style={{
                                flex: 1,
                                marginHorizontal: 8,
                                borderWidth: 0.5,
                              }}
                            />
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
          <Button onPress={handleSave}>
            <ButtonText>
              {isSaving ? <Spinner size="small" color="grey" /> : "Save"}
            </ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
