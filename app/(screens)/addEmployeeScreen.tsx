import React, { useEffect, useState } from 'react'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@/components/ui/modal'
import { Heading } from '@/components/ui/heading'
import {
  AddIcon,
  AlertCircleIcon,
  ChevronDownIcon,
  CloseIcon,
  Icon,
} from '@/components/ui/icon'
import { VStack } from '@/components/ui/vstack'
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control'
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
} from '@/components/ui/select'
import { Input, InputField } from '@/components/ui/input'
import { Pressable, ScrollView, useWindowDimensions, Text } from 'react-native'
import { useProject } from '@/context/projectContext'
import { addDoc, collection } from 'firebase/firestore'
import { auth, db } from '@/firebase/firebaseConfig'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { Spinner } from '@/components/ui/spinner'
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from '@/components/ui/toast'
import { HStack } from '@/components/ui/hstack'
import { ArrowLeft, HelpCircleIcon } from 'lucide-react-native'
import { useFocusEffect, useRouter } from 'expo-router'
import { Box } from '@/components/ui/box'

export default function AddRoleScreen() {
  const dimensions = useWindowDimensions()
  const isMobile = dimensions.width <= 786
  const router = useRouter()
  const { roles } = useProject()
  const [showModal, setShowModal] = useState(false)
  const [email, setEmail] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [nickname, setNickname] = useState<string>('')
  const [role, setRole] = useState<string>('')
  const [selectKey, setSelectKey] = useState(0)
  const [password, setPassword] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
  const toastError = useToast()
  const [toastId, setToastId] = useState(0)

  const [emailError, setEmailError] = useState(false)
  const [firstNameError, setFirstNameError] = useState(false)
  const [lastNameError, setLastNameError] = useState(false)
  const [nicknameError, setNicknameError] = useState(false)
  const [roleError, setRoleError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)

  const handleToastError = (error: string) => {
    if (!toastError.isActive(String(toastId))) {
      showNewToastError(error)
    }
  }

  const getSelectedLabel = () => {
    if (!role || role.trim().length === 0) return undefined
    const selectedOption = roles.find((roles) => roles.role === role)
    return selectedOption?.role
  }

  useFocusEffect(
    React.useCallback(() => {
      // Reset fields every time screen comes into focus
      setEmail('')
      setFirstName('')
      setLastName('')
      setNickname('')
      setRole('')
      setSelectKey((prev) => prev + 1)
      setPassword('')
      setEmailError(false)
      setFirstNameError(false)
      setLastNameError(false)
      setNicknameError(false)
      setRoleError(false)
      setPasswordError(false)
    }, [])
  )

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = () => {
    let hasError = false

    if (!email || !validateEmail(email)) {
      setEmailError(true)
      hasError = true
    } else {
      setEmailError(false)
    }

    if (!firstName || firstName.trim().length === 0) {
      setFirstNameError(true)
      hasError = true
    } else {
      setFirstNameError(false)
    }

    if (!lastName || lastName.trim().length === 0) {
      setLastNameError(true)
      hasError = true
    } else {
      setLastNameError(false)
    }

    if (!nickname || nickname.trim().length === 0) {
      setNicknameError(true)
      hasError = true
    } else {
      setNicknameError(false)
    }

    if (!role || role.trim().length === 0) {
      // Check for empty string instead of just !role
      setRoleError(true)
      hasError = true
    } else {
      setRoleError(false)
    }

    if (!password || password.length < 6) {
      setPasswordError(true)
      hasError = true
    } else {
      setPasswordError(false)
    }

    if (!hasError) {
      handleCreateUser()
    }
  }

  const handleCreateUser = async () => {
    setIsSaving(true)

    try {
      // Get current user's ID token
      const token = await auth.currentUser?.getIdToken()

      if (!token) {
        throw new Error('Not authenticated')
      }

      const response = await fetch(
        'http://localhost:3000/api/employees/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email,
            password,
            firstName,
            lastName,
            nickname,
            role,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create employee')
      }

      // Success! Modal closes and form resets
      router.replace('/(screens)/employee')

      // Optional: Show success toast
      console.log('Employee created successfully:', data)
    } catch (error: any) {
      console.log('Error adding employee:', error)
      handleToastError(error.message || 'Failed to create employee')
    } finally {
      setIsSaving(false)
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
    <ScrollView
      style={{ flex: 1, backgroundColor: '#000000', paddingHorizontal: 10 }}
      showsVerticalScrollIndicator={false}
    >
      <Pressable
        onPress={() => router.replace('/(screens)/employee')}
        style={{ marginBottom: 10 }}
      >
        <HStack style={{ alignItems: 'center' }} space="sm">
          <ArrowLeft color={'white'} size={20} />
          <Text style={{ color: 'white', fontSize: 15 }}>Add Employee</Text>
        </HStack>
      </Pressable>

      <Box style={{ marginBottom: 10 }}>
        <FormControl isInvalid={firstNameError} size="md">
          <FormControlLabel>
            <FormControlLabelText className="text-[#FFFFFF]">
              First Name
            </FormControlLabelText>
          </FormControlLabel>
          <Input className="data-[focus=true]:border-transparent data-[focus=true]:shadow-none bg-[#FFFFFF] border-none rounded-md">
            <InputField
              type="text"
              placeholder="First Name"
              value={firstName}
              onChangeText={(text) => {
                setFirstName(text)
                setFirstNameError(false)
              }}
            />
          </Input>
          {firstNameError && (
            <FormControlError>
              <FormControlErrorIcon
                as={AlertCircleIcon}
                className="text-red-500"
              />
              <FormControlErrorText className="text-red-500">
                First name is required.
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      </Box>

      <Box style={{ marginBottom: 10 }}>
        <FormControl isInvalid={lastNameError} size="md">
          <FormControlLabel>
            <FormControlLabelText className="text-[#FFFFFF]">
              Last Name
            </FormControlLabelText>
          </FormControlLabel>
          <Input className="data-[focus=true]:border-transparent data-[focus=true]:shadow-none bg-[#FFFFFF] border-none rounded-md">
            <InputField
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChangeText={(text) => {
                setLastName(text)
                setLastNameError(false)
              }}
            />
          </Input>
          {lastNameError && (
            <FormControlError>
              <FormControlErrorIcon
                as={AlertCircleIcon}
                className="text-red-500"
              />
              <FormControlErrorText className="text-red-500">
                Last name is required.
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      </Box>

      <Box style={{ marginBottom: 10 }}>
        <FormControl isInvalid={nicknameError} size="md">
          <FormControlLabel>
            <FormControlLabelText className="text-[#FFFFFF]">
              Nickname
            </FormControlLabelText>
          </FormControlLabel>
          <Input
            className="data-[focus=true]:border-transparent data-[focus=true]:shadow-none bg-[#FFFFFF] border-none rounded-md"
            size="md"
          >
            <InputField
              type="text"
              placeholder="Nickname"
              value={nickname}
              onChangeText={(text) => {
                setNickname(text)
                setNicknameError(false)
              }}
            />
          </Input>
          {nicknameError && (
            <FormControlError>
              <FormControlErrorIcon
                as={AlertCircleIcon}
                className="text-red-500"
              />
              <FormControlErrorText className="text-red-500">
                Nickname is required.
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      </Box>

      <Box style={{ marginBottom: 10 }}>
        <FormControl isInvalid={emailError} size="md">
          <FormControlLabel>
            <FormControlLabelText className="text-[#FFFFFF]">
              Email
            </FormControlLabelText>
          </FormControlLabel>
          <Input className="data-[focus=true]:border-transparent data-[focus=true]:shadow-none bg-[#FFFFFF] border-none rounded-md">
            <InputField
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text)
                setEmailError(false)
              }}
            />
          </Input>
          {emailError && (
            <FormControlError>
              <FormControlErrorIcon
                as={AlertCircleIcon}
                className="text-red-500"
              />
              <FormControlErrorText className="text-red-500">
                {!email
                  ? 'Email is required.'
                  : 'Please enter a valid email address.'}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      </Box>

      <Box style={{ marginBottom: 10 }}>
        <FormControl isInvalid={roleError} size="md">
          <FormControlLabel>
            <FormControlLabelText className="text-[#FFFFFF]">
              Role
            </FormControlLabelText>
          </FormControlLabel>
          <Select
            key={selectKey}
            selectedValue={role}
            onValueChange={(value) => {
              setRole(value)
              setRoleError(false)
            }}
          >
            <SelectTrigger
              variant="outline"
              size="md"
              className={`data-[focus=true]:border-transparent data-[focus=true]:shadow-none bg-[#FFFFFF] rounded-md ${
                roleError ? 'border-red-500 border-2' : 'border-none'
              }`}
            >
              <SelectInput
                placeholder="Select role"
                value={getSelectedLabel()}
              />
              <SelectIcon className="mr-3" as={ChevronDownIcon} />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                {roles.map((role) => (
                  <SelectItem
                    key={role.id}
                    label={role.role}
                    value={role.role}
                  />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>
          {roleError && (
            <FormControlError>
              <FormControlErrorIcon
                as={AlertCircleIcon}
                className="text-red-500"
              />
              <FormControlErrorText className="text-red-500">
                Role is required.
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      </Box>

      <Box style={{ marginBottom: 10 }}>
        <FormControl isInvalid={passwordError} size="md">
          <FormControlLabel>
            <FormControlLabelText className="text-[#FFFFFF]">
              Password
            </FormControlLabelText>
          </FormControlLabel>
          <Input className="data-[focus=true]:border-transparent data-[focus=true]:shadow-none bg-[#FFFFFF] border-none rounded-md">
            <InputField
              type="password"
              placeholder="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text)
                setPasswordError(false)
              }}
            />
          </Input>
          {passwordError && (
            <FormControlError>
              <FormControlErrorIcon
                as={AlertCircleIcon}
                className="text-red-500"
              />
              <FormControlErrorText className="text-red-500">
                {!password
                  ? 'Password is required.'
                  : 'Password must be at least 6 characters.'}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      </Box>

      <VStack style={{ marginTop: 20, marginBottom: 20 }} space="xs">
        <Button
          variant="solid"
          onPress={() => router.replace('/(screens)/employee')}
        >
          <ButtonText>Cancel</ButtonText>
        </Button>
        <Button onPress={handleSubmit} style={{ backgroundColor: 'white' }}>
          <ButtonText style={{ color: 'black' }}>
            {isSaving ? <Spinner size="small" color="grey" /> : 'Add employee'}
          </ButtonText>
        </Button>
      </VStack>
    </ScrollView>
  )
}
