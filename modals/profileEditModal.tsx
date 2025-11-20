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
    <Modal isOpen={visible} onClose={onClose} size="sm">
      <ModalBackdrop />
      <ModalContent className="bg-black ronded-12 border-0">
        <ModalHeader>
          <Heading size="lg" style={{color: "white"}}>Edit Profile</Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon}  color="white" />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          

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
            className="mr-3 text-black"
            onPress={onClose}
          >
            <ButtonText >Cancel</ButtonText>
          </Button>
          <Button onPress={handleSave} className="bg-white">
            <ButtonText className="text-white" >
              {isSaving ? <Spinner size="small" color="black" /> : "Save changes"}
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
    color: "#1f1f1f",
    backgroundColor: "#5a5a5aff",
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    marginTop: 5,
    color: "white",
  },
  error: { color: "red", marginBottom: 10, textAlign: "center" },
});
