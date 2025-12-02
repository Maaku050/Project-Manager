import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Star } from 'lucide-react-native';
import { HStack } from "@/components/ui/hstack";
import { useUser } from "@/context/profileContext";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useProject } from "@/context/projectContext";

type prop = {
    starID: string | undefined;
};

export default function TaskStars({ starID }: prop) {


    const [isStar, setIsStar] = useState(Number);
    const { profile } = useUser();
    const { tasks, assignedUser } = useProject();

     const currentTask = tasks.find((t) => t.id === starID);
          if (!currentTask) {
            return (
              console.log(`task not found ${currentTask}`)
            );
          }

    const saveRatingToFirestore = async (rating: number) => {
        setIsStar(rating)
        try {
        // ensure starID is defined before calling doc(...)
        if (!currentTask) {
            console.warn('saveRatingToFirestore: missing starID, aborting.');
            return;
        }

        // Replace with your actual document reference
        const docRef = doc(db, 'tasks', currentTask.id); // adjust collection and doc ID
        

        await updateDoc(docRef, {starPoints: rating});
        console.log('Rating saved successfully!');
        } catch (error) {
        console.error('Error saving rating:', error);
        } 
    };


    const styles = StyleSheet.create({
        numberIndicator: {
            position: "absolute",
            top: 10,
            right: 16.8,
        }
    })



    return (
        <>
            {/* <Text className="text-typography-900">
                Current Rating: {isStar} star(s)
            </Text> */}
            <HStack style={{ gap: 8 }}>
                <Pressable onPress={() => saveRatingToFirestore(1)}>
                    <Star color={"#EFBF04"} fill={"#EFBF04"} size={40} />
                    <Text style={{...styles.numberIndicator}}>1</Text>
                </Pressable>
                <Pressable onPress={() => saveRatingToFirestore(2)}>
                    <Star color={"#EFBF04"} fill={"#EFBF04"} size={40} />
                    <Text style={{...styles.numberIndicator}}>2</Text>
                </Pressable>
                <Pressable onPress={() => saveRatingToFirestore(3)}>
                    <Star color={"#EFBF04"} fill={"#EFBF04"} size={40} />
                    <Text style={{...styles.numberIndicator}}>3</Text>
                </Pressable>
                <Pressable onPress={() => saveRatingToFirestore(4)}>
                    <Star color={"#EFBF04"} fill={"#EFBF04"} size={40} />
                    <Text style={{...styles.numberIndicator}}>4</Text>
                </Pressable>
                <Pressable onPress={() => saveRatingToFirestore(5)}>
                    <Star color={"#EFBF04"} fill={"#EFBF04"} size={40} />
                    <Text style={{...styles.numberIndicator}}>5</Text>
                </Pressable>
            </HStack>

        </>


    );

}


