import React, { useState } from "react";
import { Button, ButtonText } from "../ui/button";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../ui/modal";
import { Heading } from "../ui/heading";
import { AlertCircleIcon, CloseIcon, Icon } from "../ui/icon";
import { VStack } from "../ui/vstack";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "../ui/form-control";
import { Input, InputField } from "../ui/input";

const AddRoleModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [inputValue, setInputValue] = useState<string | undefined>(undefined);

  const handleModal = (value: boolean) => {
    setShowModal(value);
  };

  const handleSubmit = () => {
    if (!inputValue) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
      handleModal(false);
    }
  };

  return (
    <>
      <Button
        onPress={() => handleModal(true)}
        size="md"
        style={{ width: 118 }}
        className="data-[hover=true]:bg-transparent color-[#FFFFFF] bg-transparent"
      >
        <ButtonText style={{ fontSize: 18, fontWeight: 500 }}>Add role</ButtonText>
      </Button>
      <Modal
        isOpen={showModal}
        onClose={() => {
          handleModal(false);
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent className="bg-[#000000] border-0 gap-4">
          <ModalHeader>
            <Heading size="lg" className="font-size-[24px] font-weight-600 text-[#FFFFFF]">
              Add A Role
            </Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} className="bg-[#000000] text-[#FFFFFF]" />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <VStack>
              <FormControl
                isInvalid={isInvalid}
                size="md"
                isDisabled={false}
                isReadOnly={false}
                isRequired={false}
              >
                <FormControlLabel>
                  <FormControlLabelText className="text-[#FFFFFF]">Role</FormControlLabelText>
                </FormControlLabel>
                <Input className="data-[focus=true]:border-transparent data-[focus=true]:shadow-none bg-[#FFFFFF] border-none rounded-md">
                  <InputField
                    type="text"
                    placeholder="Role"
                    value={inputValue}
                    onChangeText={(text) => setInputValue(text)}
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} className="text-red-500" />
                  <FormControlErrorText className="text-red-500">
                    Role is required.
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => {
                handleModal(false);
              }}
              className="data-[hover=true]:bg-[#000000] rounded-md"
            >
              <ButtonText className="data-[hover=true]:text-[#FFFFFF] text-[#FFFFFF] font-size-[18px] font-weight-500">
                Cancel
              </ButtonText>
            </Button>
            <Button
              onPress={() => {
                handleSubmit();
              }}
              className="data-[hover=true]:bg-[#FFFFFF] color-[#FFFFFF] bg-[#FFFFFF] rounded-md"
            >
              <ButtonText className="data-[hover=true]:text-[#000000] text-[#000000] font-size-[18px] font-weight-500">
                Add role
              </ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddRoleModal;
