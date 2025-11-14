import { ButtonText } from "@/components/ui/button";
import { CloseIcon } from "@/components/ui/icon";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import React from "react";
import { Text } from "react-native";
import { LogOut } from "lucide-react-native";
import { auth } from "@/firebase/firebaseConfig";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { HStack } from "@/components/ui/hstack";

type LogoutModalType = {
  visible: boolean;
  onClose: () => void;
};

export default function LogoutModal({ visible, onClose }: LogoutModalType) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {}

    onClose();
    router.replace("/");
  };

  return (
    <Modal isOpen={visible} onClose={onClose} size="sm">
      <ModalBackdrop />
      <ModalContent
        style={{ backgroundColor: "#1F1F1F", borderColor: "#1F1F1F" }}
      >
        <ModalHeader>
          <HStack style={{ alignItems: "center" }}>
            <LogOut color={"white"} strokeWidth={2} size={30} />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "500",
                color: "white",
                marginLeft: 15,
              }}
            >
              Logging Out?
            </Text>
          </HStack>
          <ModalCloseButton>
            <Icon as={CloseIcon} color="white" size="xl" />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Text style={{ color: "white", marginTop: 15 }}>
            Are you sure you want to Log Out?
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            className="mr-3"
            onPress={onClose}
            style={{
              backgroundColor: "#5C5C5C",
              borderRadius: 8,
              height: 40,
              width: 100,
            }}
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button
            onPress={handleLogout}
            style={{
              backgroundColor: "#CDCCCC",
              borderRadius: 8,
              height: 40,
              width: 100,
            }}
          >
            <ButtonText style={{ color: "black" }}>Confirm</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
