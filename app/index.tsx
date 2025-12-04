import React, { useState } from 'react'
import { Text, TextInput, StyleSheet, Image } from 'react-native'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '@/firebase/firebaseConfig'
import { useRouter } from 'expo-router'
import {
  Toast,
  ToastTitle,
  ToastDescription,
  useToast,
} from '@/components/ui/toast'
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal'
import { HStack } from '@/components/ui/hstack'
import { VStack } from '@/components/ui/vstack'
import { CloseIcon, HelpCircleIcon, Icon } from '@/components/ui/icon'
import { Box } from '@/components/ui/box'
import { ButtonText } from '@/components/ui/button'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Divider } from '@/components/ui/divider'
import { Heading } from '@/components/ui/heading'
import { useUser } from '@/context/profileContext'
import { collection, query, where, getDocs } from 'firebase/firestore'

export default function LoginScreen() {
  const router = useRouter()
  const { profiles } = useUser()
  const [email, setEmail] = useState('')
  const [forgotPasswordEmail, setforgotPasswordEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const toastError = useToast()
  const toastMissingField = useToast()
  const [toastId, setToastId] = useState(0)
  const handleToastError = (error: string) => {
    if (!toastError.isActive(String(toastId))) {
      showNewToastError(error)
    }
  }
  const handleToastMissingField = () => {
    if (!toastMissingField.isActive(String(toastId))) {
      showNewToastMissingField()
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

  const showNewToastMissingField = () => {
    const newId = Math.random()
    setToastId(newId)
    toastMissingField.show({
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
                  Missing fields!
                </ToastTitle>
                <ToastDescription size="sm">
                  Please enter both email and password.
                </ToastDescription>
              </VStack>
            </HStack>
          </Toast>
        )
      },
    })
  }

  const handleLogin = async () => {
    if (!email || !password) {
      handleToastMissingField()
      return
    }

    try {
      setLoading(true)
      const response = await signInWithEmailAndPassword(auth, email, password)
      const isValid = await handleUserValidation(response.user.uid)

      if (isValid === 'Valid') {
        router.replace('/(screens)/home')
      } else {
        // Sign out the user since their account is disabled
        await auth.signOut()
        handleToastError('This account is currently disabled.')
      }
    } catch (error: any) {
      // Handle specific Firebase auth errors
      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/wrong-password'
      ) {
        handleToastError('Invalid email or password.')
      } else if (error.code === 'auth/user-not-found') {
        handleToastError('No account found with this email.')
      } else if (error.code === 'auth/too-many-requests') {
        handleToastError('Too many failed attempts. Please try again later.')
      } else {
        handleToastError(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleUserValidation = async (uid: string) => {
    try {
      // Fetch the user directly from Firestore instead of relying on context
      const profileRef = collection(db, 'profile')
      const q = query(profileRef, where('uid', '==', uid))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        return 'Invalid' // User not found in database
      }

      const userData = querySnapshot.docs[0].data()

      if (userData?.status === 'Archived') {
        return 'Invalid'
      }

      return 'Valid'
    } catch (error) {
      console.error('Error validating user:', error)
      return 'Invalid' // Default to invalid on error
    }
  }
  const [showModal, setShowModal] = React.useState(false)
  return (
    <HStack style={{ flex: 1 }}>
      {/* Login Section */}
      <Box
        style={{
          width: 600,
          backgroundColor: 'black',
          borderWidth: 0,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 50,
        }}
      >
        {/* Header */}
        <Box
          style={{
            marginBottom: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 24 }}>Welcome back!</Text>
          <Text style={{ color: 'white', fontSize: 14 }}>
            Please enter your details to log into the system.
          </Text>
        </Box>

        {/* Inputs */}
        <Box style={{ borderWidth: 0, width: 320 }}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Enter Your Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.inputs}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Enter Your Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            onSubmitEditing={handleLogin}
            autoCapitalize="none"
            style={styles.inputs}
          />
        </Box>

        {/* Forgot Password Button */}
        <Box
          style={{
            width: 320,
            alignItems: 'flex-end',
            borderWidth: 0,
            marginTop: 10,
          }}
        >
          <Text style={{ color: 'white', fontSize: 14 }}>Forgot Password?</Text>
        </Box>

        {/* Login Button */}
        <Box
          style={{
            width: 320,
            borderWidth: 0,
            marginTop: 30,
            marginBottom: 30,
          }}
        >
          <Button
            style={{ backgroundColor: '#CDCCCC', borderRadius: 8, height: 36 }}
            onPress={handleLogin}
          >
            <ButtonText style={{ color: 'black', fontSize: 14 }}>
              {loading ? (
                <Spinner size="small" color="black" style={{ marginTop: 7 }} />
              ) : (
                'Log in'
              )}
            </ButtonText>
          </Button>
        </Box>
      </Box>

      {/* Company Logo Section */}
      <Box
        style={{
          flex: 1,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box style={{ borderWidth: 0, height: 500, width: 500 }}>
          <Image
            source={require('@/assets/images/Innoendo Logo_Main Logo.png')}
            alt="image"
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
            }}
          />
        </Box>
      </Box>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg">Forgot Your Password?</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text>Enter Your Email</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#0000005b',
                borderRadius: 8,
                padding: 10,
                color: '#000000ff',
                marginTop: 8,
              }}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="default"
              value={forgotPasswordEmail}
              onChangeText={setforgotPasswordEmail}
            />
          </ModalBody>
          <ModalFooter className="flex-col items-start">
            <Button
              // onPress={handlePasswordReset}
              className="w-full"
              action="positive"
              size="lg"
            >
              <ButtonText>Submit</ButtonText>
            </Button>
            <Button
              onPress={() => {
                setShowModal(false)
                setforgotPasswordEmail('')
              }}
              className="w-full"
              action="negative"
              size="lg"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </HStack>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  content: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    borderRadius: 10,
  },
  text: {
    color: '#fff',
    fontSize: 24,
  },
  blurContainer: {
    width: 320,
    height: 340,
    borderRadius: 50,
    overflow: 'hidden',
  },
  buttonFeedback: {
    backgroundColor: 'gray',
  },
  inputs: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    padding: 8,
    color: '#ffffffff',
  },
  label: {
    fontSize: 14,
    marginVertical: 10,
    color: 'white',
  },
})
