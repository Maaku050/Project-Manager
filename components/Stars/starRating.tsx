import React, { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Star } from 'lucide-react-native'
import {
  Popover,
  PopoverBackdrop,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
} from '@/components/ui/popover'
import { useUser } from '@/context/profileContext'
import { useProject } from '@/context/projectContext'
import TaskStars from '@/components/Stars/starPoints'
import { HStack } from "@/components/ui/hstack";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";


type prop = {
  taskID: string | undefined
}

export default function popStar({ taskID }: prop) {
  const [isOpen, setIsOpen] = useState(false)
  const [isStar, setIsStar] = useState(Number)



  const { tasks } = useProject()


  const currentTask = tasks.find((t) => t.id === taskID);
  if (!currentTask) {
    return (
      console.log(`task not found ${currentTask}`)
    );
  }

  const saveRatingToFirestore = async (rating: number) => {
    setIsStar(rating)

    try {
      if (!currentTask) {
        console.warn('saveRatingToFirestore: missing starID, aborting.');
        return;
      }

      const docRef = doc(db, 'tasks', currentTask.id);
      await updateDoc(docRef, { starPoints: rating });

    } catch (error) {
      console.error('Error saving rating:', error);

    }
  };

  const styles = StyleSheet.create({
    numberIndicator: {
      position: 'absolute',
      top: 8.8,
      right: 14.8,
      fontSize: 16,
      fontWeight: "bold"
    },
    numberIndicatorRate: {
      position: "absolute",
      top: 7,
      right: 12.8,
      fontSize: 16,
      fontWeight: "bold"
    }
  })

  return (

    <Popover
      isOpen={isOpen}
      // onOpen={setIsOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}

      placement="right"
      size="md"
      trigger={(click) => {
        return (
          <Pressable {...click}>
            <Star color={'yellow'} fill={'yellow'} size={35} />
            <Text style={{ ...styles.numberIndicatorRate }}>
              {currentTask.starPoints}
            </Text>
          </Pressable>
        )
      }}
    >
      <PopoverBackdrop />
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <>

            <HStack style={{ gap: 8 }}>
              <Pressable onPress={() => { saveRatingToFirestore(1); setIsOpen(false) }}>
                <Star color={"#EFBF04"} fill={"#EFBF04"} size={40} />
                <Text style={{ ...styles.numberIndicator }}>1</Text>
              </Pressable>
              <Pressable onPress={() => { saveRatingToFirestore(2); setIsOpen(false) }}>
                <Star color={"#EFBF04"} fill={"#EFBF04"} size={40} />
                <Text style={{ ...styles.numberIndicator }}>2</Text>
              </Pressable>
              <Pressable onPress={() => { saveRatingToFirestore(3);  setIsOpen(false) }}>
                <Star color={"#EFBF04"} fill={"#EFBF04"} size={40} />
                <Text style={{ ...styles.numberIndicator }}>3</Text>
              </Pressable>
              <Pressable onPress={() => { saveRatingToFirestore(4);  setIsOpen(false) }}>
                <Star color={"#EFBF04"} fill={"#EFBF04"} size={40} />
                <Text style={{ ...styles.numberIndicator }}>4</Text>
              </Pressable>
              <Pressable onPress={() => { saveRatingToFirestore(5);  setIsOpen(false) }}>
                <Star color={"#EFBF04"} fill={"#EFBF04"} size={40} />
                <Text style={{ ...styles.numberIndicator }}>5</Text>
              </Pressable>
            </HStack>
          </>
        </PopoverBody>
      </PopoverContent>
    </Popover>

  )
}
