import React, { useEffect, useState } from 'react'
import { Text, useWindowDimensions } from 'react-native'
import { Button, ButtonText } from '../ui/button'
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '../ui/modal'
import { Heading } from '../ui/heading'
import { AlertCircleIcon, CloseIcon, Icon } from '../ui/icon'
import { VStack } from '../ui/vstack'
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '../ui/form-control'
import { Input, InputField } from '../ui/input'
import { addDoc, collection, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'
import { useProject } from '@/context/projectContext'
import { Toast, ToastDescription, ToastTitle, useToast } from '../ui/toast'
import { HStack } from '../ui/hstack'
import { ChevronDownIcon, HelpCircleIcon } from 'lucide-react-native'
import { Spinner } from '../ui/spinner'
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from '../ui/select'
import { Box } from '../ui/box'
import { useRouter } from 'expo-router'

const colorSelection = [
  { id: 1, name: 'Neutral', color: '#404040' },
  { id: 2, name: 'Stone', color: '#44403c' },
  { id: 3, name: 'Zinc', color: '#3f3f46' },
  { id: 4, name: 'Slate', color: '#334155' },
  { id: 5, name: 'Gray', color: '#374151' },
  { id: 6, name: 'red', color: '#b91c1c' },
  { id: 7, name: 'Orange', color: '#c2410c' },
  { id: 8, name: 'Amber', color: '#b45309' },
  { id: 9, name: 'Yellow', color: '#a16207' },
  { id: 10, name: 'Lime', color: '#4d7c0f' },
  { id: 11, name: 'Green', color: '#15803d' },
  { id: 12, name: 'Emerald', color: '#047857' },
  { id: 13, name: 'Teal', color: '#0f766e' },
  { id: 14, name: 'Cyan', color: '#0e7490' },
  { id: 15, name: 'Sky', color: '#0369a1' },
  { id: 16, name: 'Blue', color: '#1d4ed8' },
  { id: 17, name: 'Indigo', color: '#4338ca' },
  { id: 18, name: 'Violet', color: '#6d28d9' },
  { id: 19, name: 'Purple', color: '#7e22ce' },
  { id: 20, name: 'Fuchsia', color: '#a21caf' },
  { id: 21, name: 'Pink', color: '#be185d' },
  { id: 21, name: 'Rose', color: '#be123c' },
]

const AddRoleModal = () => {
  const dimensions = useWindowDimensions()
  const isMobile = dimensions.width <= 786
  const router = useRouter()
  const { roles } = useProject()
  const [isSaving, setIsSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [isInvalid, setIsInvalid] = useState(false)
  const [inputValue, setInputValue] = useState<string | undefined>(undefined)
  const [color, setColor] = useState<string>('')
  const [colorError, setColorError] = useState(false)
  const toastError = useToast()
  const [toastId, setToastId] = useState(0)

  useEffect(() => {
    setInputValue('')
    setColor('')
  }, [showModal])

  const handleToastError = (error: string) => {
    if (!toastError.isActive(String(toastId))) {
      showNewToastError(error)
    }
  }

  const handleModal = (value: boolean) => {
    setShowModal(value)
  }

  const handleSubmit = () => {
    let hasError = false

    if (!inputValue) {
      setIsInvalid(true)
      hasError = true
    } else {
      setIsInvalid(false)
    }

    if (!color) {
      setColorError(true)
      hasError = true
    } else {
      setColorError(false)
    }

    // If there are validation errors, stop here
    if (hasError) {
      return
    }

    // Check if role already exists (only after basic validation passes)
    const roleExists = roles.some((role) => role.role === inputValue)

    if (roleExists) {
      handleToastError('Role already exist')
      setInputValue('')
      return
    }

    // All validations passed, save the role
    handleSaveRole()
  }
  // Update your getSelectedLabel function to return a component
  const getSelectedDisplay = () => {
    const selectedColor = colorSelection.find((c) => c.color === color)
    if (!selectedColor) return null

    return (
      <HStack
        space="sm"
        style={{ alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Box
          style={{
            width: 20,
            height: 20,
            backgroundColor: selectedColor.color,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: '#e5e5e5',
            marginLeft: 10,
          }}
        />
        <Text>{selectedColor.name}</Text>
      </HStack>
    )
  }

  const handleSaveRole = async () => {
    setIsSaving(true)
    try {
      const docRef = collection(db, 'roles')

      await addDoc(docRef, {
        role: inputValue?.trim(),
        color: color,
        createdAt: serverTimestamp(),
      })
    } catch (error) {
      console.log('Failed to add role: ', error)
    } finally {
      setIsSaving(false)
      setInputValue('')
      handleModal(false)
    }
  }

  const showNewToastError = (error: string) => {
    const newId = Math.random()
    setToastId(newId)
    toastError.show({
      id: String(newId),
      placement: 'top',
      duration: 3000,
      render: ({ id }) => {
        const uniqueToastId = 'toast-' + id
        return (
          <Toast
            action="error"
            variant="outline"
            nativeID={uniqueToastId}
            className="p-4 gap-6 border-error-500 w-full shadow-hard-5 max-w-[443px] flex-row justify-between"
          >
            <HStack space="md">
              <Icon as={HelpCircleIcon} className="stroke-error-500 mt-0.5" />
              <VStack space="xs">
                <ToastTitle className="font-semibold text-error-500">
                  Error!
                </ToastTitle>
                <ToastDescription size="sm">{error}</ToastDescription>
              </VStack>
            </HStack>
          </Toast>
        )
      },
    })
  }

  return (
    <>
      <Button
        onPress={() =>
          isMobile
            ? router.replace('/(screens)/addRoleScreen')
            : handleModal(true)
        }
        size={isMobile ? 'sm' : 'md'}
        className="data-[hover=true]:bg-transparent color-[#FFFFFF] bg-transparent"
      >
        <ButtonText style={{ fontSize: isMobile ? 14 : 18, fontWeight: 500 }}>
          Add role
        </ButtonText>
      </Button>
      <Modal
        isOpen={showModal}
        onClose={() => {
          handleModal(false)
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent className="bg-[#000000] border-0 gap-4">
          <ModalHeader>
            <Heading
              size="lg"
              className="font-size-[24px] font-weight-600 text-[#FFFFFF]"
            >
              Add A Role
            </Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} className="bg-[#000000] text-[#FFFFFF]" />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <VStack space="md">
              <FormControl
                isInvalid={isInvalid}
                size="md"
                isDisabled={false}
                isReadOnly={false}
                isRequired={false}
              >
                <FormControlLabel>
                  <FormControlLabelText className="text-[#FFFFFF]">
                    Role
                  </FormControlLabelText>
                </FormControlLabel>
                <Input className="data-[focus=true]:border-transparent data-[focus=true]:shadow-none bg-[#FFFFFF] border-none rounded-md">
                  <InputField
                    type="text"
                    placeholder="Role"
                    value={inputValue}
                    onChangeText={(text) => {
                      setInputValue(text)
                      setIsInvalid(false)
                    }}
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon
                    as={AlertCircleIcon}
                    className="text-red-500"
                  />
                  <FormControlErrorText className="text-red-500">
                    Role is required.
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              <FormControl isInvalid={colorError} size="md">
                <FormControlLabel>
                  <FormControlLabelText className="text-[#FFFFFF]">
                    Color
                  </FormControlLabelText>
                </FormControlLabel>
                <Select
                  selectedValue={color}
                  onValueChange={(value) => {
                    setColor(value)
                    setColorError(false)
                  }}
                >
                  <SelectTrigger
                    variant="outline"
                    size="md"
                    style={{ justifyContent: 'space-between' }}
                    className={`data-[focus=true]:border-transparent data-[focus=true]:shadow-none bg-[#FFFFFF] rounded-md ${
                      colorError ? 'border-red-500 border-2' : 'border-none'
                    }`}
                  >
                    {color ? (
                      getSelectedDisplay()
                    ) : (
                      <SelectInput placeholder="Select color" />
                    )}
                    <SelectIcon className="mr-3" as={ChevronDownIcon} />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      {colorSelection.map((colorItem) => (
                        <SelectItem
                          key={colorItem.id}
                          label={colorItem.name}
                          value={colorItem.color}
                        >
                          <HStack space="sm" style={{ alignItems: 'center' }}>
                            <Box
                              style={{
                                width: 20,
                                height: 20,
                                backgroundColor: colorItem.color,
                                borderRadius: 4,
                                borderWidth: 1,
                                borderColor: '#e5e5e5',
                              }}
                            />
                            <Text>{colorItem.name}</Text>
                          </HStack>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
                {colorError && (
                  <FormControlError>
                    <FormControlErrorIcon
                      as={AlertCircleIcon}
                      className="text-red-500"
                    />
                    <FormControlErrorText className="text-red-500">
                      Color is required.
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => {
                handleModal(false)
              }}
              className="data-[hover=true]:bg-[#000000] rounded-md"
            >
              <ButtonText className="data-[hover=true]:text-[#FFFFFF] text-[#FFFFFF] font-size-[18px] font-weight-500">
                Cancel
              </ButtonText>
            </Button>
            <Button
              onPress={() => {
                handleSubmit()
              }}
              className="data-[hover=true]:bg-[#FFFFFF] color-[#FFFFFF] bg-[#FFFFFF] rounded-md"
            >
              <ButtonText className="data-[hover=true]:text-[#000000] text-[#000000] font-size-[18px] font-weight-500">
                {isSaving ? <Spinner size="small" color="grey" /> : 'Add role'}
              </ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddRoleModal
