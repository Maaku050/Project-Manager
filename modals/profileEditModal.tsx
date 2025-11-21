import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import {
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Modal,
} from "@/components/ui/modal";
import { Heading } from "@/components/ui/heading";
import { CloseIcon, Icon } from "@/components/ui/icon";
import { Button, ButtonText } from "@/components/ui/button";
import { useUser } from "@/context/profileContext";
import { db } from "@/firebase/firebaseConfig";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { Spinner } from "@/components/ui/spinner";

type ProfileTypes = {
  visible: boolean;
  onClose: () => void;
};

export default function ProfileEditModal({ visible, onClose }: ProfileTypes) {
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastName] = useState("");
  const [nickName, setNickName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { profile } = useUser();

  useEffect(() => {
    // Initiallizing fields
    if (profile) {
      setFirstname(profile.firstName);
      setLastName(profile.lastName);
      setNickName(profile.nickName);
    }
  }, [visible]);

  // Functions
  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim() || !nickName) return;
    if (!profile) return;
    setIsSaving(true);

    try {
      const UserRef = doc(db, "profile", profile.id);

      await updateDoc(UserRef, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        nickName: nickName.trim(),
      });
    } catch (err) {
      console.error("Error saving profile details: ", err);
    } finally {
      setIsSaving(false);
      onClose();
    }
  };

  return (
    <Modal isOpen={visible} onClose={onClose} size="md">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="lg">Edit Profile</Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.disabledInput}
            placeholder="Email"
            value={profile?.email}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={false}
            selectTextOnFocus={false}
            pointerEvents="none"
          />

          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName} // ✅ controlled input
            onChangeText={setFirstname}
            autoCapitalize="none"
            keyboardType="default"
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName} // ✅ controlled input
            onChangeText={setLastName}
            autoCapitalize="none"
            keyboardType="default"
          />

          <Text style={styles.label}>Nick Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Nick Name"
            value={nickName} // ✅ controlled input
            onChangeText={setNickName}
            autoCapitalize="none"
            keyboardType="default"
          />

          <Text style={styles.label}>Role</Text>
          <TextInput
            style={styles.disabledInput}
            placeholder="Role"
            value={profile?.role} // ✅ controlled input
            autoCapitalize="none"
            keyboardType="default"
            editable={false}
            selectTextOnFocus={false}
            pointerEvents="none"
          />
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
              {isSaving ? <Spinner size="small" color="white" /> : "Save"}
            </ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    marginBottom: 5,
    color: "black",
  },
  input: {
    borderWidth: 1,
    borderColor: "#0000005b",
    borderRadius: 8,
    padding: 7,
    marginBottom: 5,
    color: "#000000ff",
    backgroundColor: "white",
  },
  disabledInput: {
    borderWidth: 1,
    borderColor: "#0000005b",
    borderRadius: 8,
    padding: 7,
    marginBottom: 5,
    color: "gray",
    backgroundColor: "white",
  },
  label: {
    fontSize: 13,
    marginBottom: 4,
    marginTop: 5,
    color: "gray",
  },
  error: { color: "red", marginBottom: 10, textAlign: "center" },
});
