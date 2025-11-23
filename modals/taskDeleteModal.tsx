import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { CloseIcon, Icon } from "@/components/ui/icon";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { Spinner } from "@/components/ui/spinner";
import { db } from "@/firebase/firebaseConfig";
import { router } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Text } from "react-native";

type TaskDeleteModalType = {
  taskID: string;
  visible: boolean;
  onClose: () => void;
};

export default function TaskDeleteModal({
  taskID,
  visible,
  onClose,
}: TaskDeleteModalType) {
  const [isHover, setIsHover] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const handleDeleteTask = async () => {
    try {
      setIsSaving(true);
      const tasktRef = doc(db, "tasks", taskID);
      await updateDoc(tasktRef, {
        status: "Archived",
      });
    } catch (error) {
      console.log("Error deleting task!", error);
    } finally {
      setIsSaving(false);
      onClose();
      router.replace("/(screens)/projectWindow");
    }
  };

  return (
    <Modal isOpen={visible} onClose={onClose} size="md">
      <ModalBackdrop />
      <ModalContent
        style={{
          borderColor: "red",
          borderWidth: 0,
          backgroundColor: "#000000",
        }}
      >
        <ModalHeader>
          <Heading size="xl" style={{ color: "white" }}>
            Deleting Task
          </Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Text style={{ color: "white", fontSize: 18 }}>
            Are you sure you want to delete task?
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="outline"
            className="mr-3"
            onPress={onClose}
            onHoverIn={() => setIsHover(true)}
            onHoverOut={() => setIsHover(false)}
            style={{ backgroundColor: isHover ? "gray" : "" }}
          >
            <ButtonText style={{ color: "white" }}>Cancel</ButtonText>
          </Button>
          <Button onPress={handleDeleteTask} action="negative">
            <ButtonText>
              {isSaving ? (
                <Spinner size="small" color="white" style={{ marginTop: 6 }} />
              ) : (
                "Delete Project"
              )}
            </ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
