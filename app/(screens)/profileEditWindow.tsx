import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native'
import { Button, ButtonText } from '@/components/ui/button'
import { useUser } from '@/context/profileContext'
import { db } from '@/firebase/firebaseConfig'
import { doc, updateDoc, Timestamp } from 'firebase/firestore'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft } from 'lucide-react-native';
import { HStack } from '@/components/ui/hstack'
import { router } from 'expo-router'



export default function profileWindow() {
  const [firstName, setFirstname] = useState('')
  const [lastName, setLastName] = useState('')
  const [nickName, setNickName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const { profile } = useUser()

  useEffect(() => {
    // Initiallizing fields
    if (profile) {
      setFirstname(profile.firstName)
      setLastName(profile.lastName)
      setNickName(profile.nickName)
    }
  }, [profile])

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim() || !nickName) return
    if (!profile) return
    setIsSaving(true)

    try {
      const UserRef = doc(db, 'profile', profile.id)

      await updateDoc(UserRef, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        nickName: nickName.trim(),
      })
    } catch (err) {
      console.error('Error saving profile details: ', err)
    } finally {
      setIsSaving(false)
      router.push("/(screens)/home")
    }
  }

  const styles = StyleSheet.create({
    paddingaround: {
      padding: 12,
      gap: 8,
      alignItems: "center"
    },
     title: {
    fontSize: 20,
    marginBottom: 5,
    color: "white",
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
  viewBG: {
    backgroundColor: "#000000",
    padding: 16,
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  }
  })

  return (
    <View style={{...styles.viewBG, }}>
       <Pressable onPress={() => {
        router.push("/(screens)/home")
       }}
        style={{alignSelf: "flex-start"}}>
           <HStack style={{...styles.paddingaround}}>
            <ArrowLeft className='color-white size-lg' />
            <Text style={{...styles.title}}>Edit Profile</Text>
          </HStack>
        </Pressable>     

      <View style={{borderWidth: 0, borderColor: "white", flex: 1, width: "100%"}}>
        <View>
          <Text style={{...styles.label}}>First Name</Text>
          <TextInput
            style={{...styles.input}}
            placeholder="First Name"
            value={firstName} // ✅ controlled input
            onChangeText={setFirstname}
            autoCapitalize="none"
            keyboardType="default"
          />

          <Text style={{...styles.label}}>Last Name</Text>
          <TextInput
            style={{...styles.input}}
            placeholder="Last Name"
            value={lastName} // ✅ controlled input
            onChangeText={setLastName}
            autoCapitalize="none"
            keyboardType="default"
          />

          <Text style={{...styles.label}}>Nick Name</Text>
          <TextInput
            style={{...styles.input}}
            placeholder="Nick Name"
            value={nickName} // ✅ controlled input
            onChangeText={setNickName}
            autoCapitalize="none"
            keyboardType="default"
          />

          <Text style={{...styles.label}}>Email</Text>
          <TextInput
            style={{...styles.disabledInput}}
            placeholder="Email"
            value={profile?.email}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={false}
            selectTextOnFocus={false}
            pointerEvents="none"
          />

          <Text style={{...styles.label}}>Role</Text>
          <TextInput
            style={{...styles.disabledInput}}
            placeholder="Role"
            value={profile?.role} // ✅ controlled input
            autoCapitalize="none"
            keyboardType="default"
            editable={false}
            selectTextOnFocus={false}
            pointerEvents="none"
          />   
        </View>    

          
          <Button onPress={handleSave} className="bg-white" style={{marginTop: "auto"}}>
            <ButtonText className="text-black" >
              {isSaving ? <Spinner size="small" color="black" /> : "Save changes"}
            </ButtonText>
          </Button>       
      </View>
    </View>
  );
}
