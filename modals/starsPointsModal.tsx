import React from "react";
import {
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Modal,
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import { useEffect, useState } from "react";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Star } from 'lucide-react-native';



type StarsPointsModalProps = {
  visible: boolean;
  onClose: () => void;
  // starsPointsId: string;
};

export default function StarsPointsModal({ visible, onClose}: StarsPointsModalProps) { 

    const [isOpen, setIsOpen] = useState(visible);
    // const [starsPoints, setStarsPoints] = useState(null);

    useEffect(() => {
      setIsOpen(visible);
    }, [visible]);

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading>Confirmation</Heading>
            <ModalCloseButton onPress={onClose} />
          </ModalHeader>
          <ModalBody>
            <Box>
              <Text>This is where Stars & Points details will be displayed.</Text>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button onPress={onClose} style={{backgroundColor: "transparent"}}>Close</Button>
            <Button onPress={onClose} style={{ marginLeft: 8, backgroundColor: "#419134ff"}}>
            <Text style={{color: "#CDCCCC", fontWeight: "bold", fontSize: 16, fontFamily: "roboto, arial" }}>Continue</Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );      

}
