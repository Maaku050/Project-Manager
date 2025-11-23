import React, { useState, useMemo, useCallback } from "react";
import { Text, TextInput, ActivityIndicator } from "react-native";
import { Box } from "./ui/box";
import { Heading } from "./ui/heading";
import { HStack } from "./ui/hstack";
import { Button, ButtonIcon } from "./ui/button";
import { Send } from "lucide-react-native";
import { useProject } from "@/context/projectContext";
import TaskLogs from "./taskLogs";
import TaskComments from "./taskComments";
import { useUser } from "@/context/profileContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

type TaskCommentSectionType = {
  taskID: string;
};

export default function TaskCommentSection({ taskID }: TaskCommentSectionType) {
  const { profile } = useUser();
  const { comment, taskLogs } = useProject();

  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [height, setHeight] = useState(40);

  // Memoize the combined and sorted list to avoid re-sorting on every render
  const combinedItems = useMemo(() => {
    const logs = taskLogs
      .filter((t) => t.taskID === taskID)
      .filter((t) => t.createdAt) // Filter out items without createdAt
      .map((l) => ({ ...l, type: "log" as const }));

    const comments = comment
      .filter((t) => t.taskID === taskID)
      .filter((t) => t.createdAt) // Filter out items without createdAt
      .map((c) => ({ ...c, type: "comment" as const }));

    return [...logs, ...comments].sort((a, b) => {
      // Safe null check before calling toDate()
      const timeB = b.createdAt ? (b.createdAt as any).toDate().getTime() : 0;
      const timeA = a.createdAt ? (a.createdAt as any).toDate().getTime() : 0;
      return timeB - timeA;
    });
  }, [taskLogs, comment, taskID]);

  // Memoize submit handler
  const handleSubmitComment = useCallback(async () => {
    if (!value.trim() || !profile || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const commentRef = collection(db, "comment");
      await addDoc(commentRef, {
        text: value.trim(),
        createdAt: serverTimestamp(),
        uid: profile.uid,
        taskID: taskID,
      });

      setValue(""); // Clear input on success
    } catch (error) {
      console.error("Error adding comment:", error);
      // Optionally show error toast/alert to user
    } finally {
      setIsSubmitting(false);
      setHeight(40);
    }
  }, [value, profile, taskID, isSubmitting]);

  return (
    <Box
      style={{
        borderWidth: 0,
        marginTop: 20,
        backgroundColor: "#171717",
        borderRadius: 12,
        padding: 15,
        flex: 1,
      }}
    >
      <Heading style={{ color: "white" }}>Comments</Heading>

      <HStack
        style={{ borderWidth: 0, marginTop: 12, marginBottom: 20 }}
        space="md"
      >
        <TextInput
          multiline
          value={value}
          onChangeText={(text) => {
            setValue(text);
            if (text.length === 0) {
              setHeight(40); // Reset to 1 line when empty
            }
          }}
          onContentSizeChange={(e) => {
            const newHeight = e.nativeEvent.contentSize.height;
            setHeight(Math.max(40, Math.min(newHeight, 120))); // Min 1 line (40), max 4 lines (120)
          }}
          placeholder="Enter your comment here"
          placeholderTextColor="#8C8C8C"
          editable={!isSubmitting}
          style={{
            flex: 1,
            color: "black",
            backgroundColor: "#FDFDFD",
            padding: 10,
            borderRadius: 8,
            height: height, // Use dynamic height
            maxHeight: 120, // Fallback max
            textAlignVertical: "top",
          }}
        />
        <Button
          size="md"
          style={{
            borderRadius: 8,
            backgroundColor: "#FDFDFD",
            opacity: isSubmitting || !value.trim() ? 0.5 : 1,
          }}
          onPress={handleSubmitComment}
          disabled={isSubmitting || !value.trim()}
        >
          {isSubmitting ? (
            <ActivityIndicator color="black" size="small" />
          ) : (
            <ButtonIcon as={Send} color="black" size="xl" />
          )}
        </Button>
      </HStack>

      {combinedItems.length === 0 ? (
        <Text style={{ color: "#8C8C8C", textAlign: "center", marginTop: 20 }}>
          No comments yet. Be the first to comment!
        </Text>
      ) : (
        combinedItems.map((item) => (
          <Box key={item.id} style={{ marginBottom: 20, borderWidth: 0 }}>
            {item.type === "log" ? (
              <TaskLogs
                uid={item.uid}
                text={item.text}
                createdAt={item.createdAt}
              />
            ) : (
              <TaskComments
                uid={item.uid}
                text={item.text}
                createdAt={item.createdAt}
              />
            )}
          </Box>
        ))
      )}
    </Box>
  );
}
