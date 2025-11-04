import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useProject } from "@/context/projectContext";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon, ArrowLeftIcon } from "@/components/ui/icon";
import { router } from "expo-router";
import { VStack } from "@/components/ui/vstack";
import { Card } from "@/components/ui/card";
import { SquarePen } from "lucide-react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { TextInput } from "react-native-gesture-handler";
import { db } from "@/firebase/firebaseConfig";
import {
  updateDoc,
  doc,
  where,
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { useUser } from "@/context/profileContext";
import DateTimePicker from "@/components/DateTimePicker";

export default function TaskModal() {
  const { selectedProject, comment, tasks, selectedTask } = useProject();

  const { user, profile, profiles } = useUser();

  const currentTask = tasks.find(
    (t) => t.projectID === selectedProject && t.id === selectedTask
  );

  const editTitle = async (newText: string) => {
    console.log("Edit Function mounted!");
    if (!selectedTask) return; // 🧩 make sure a task is selected
    const trimmed = newText.trim();
    if (!trimmed) return;

    try {
      const taskRef = doc(db, "tasks", selectedTask);
      await updateDoc(taskRef, { title: trimmed });
      console.log("Task title updated successfully");
    } catch (error) {
      console.error("Error updating title:", error);
    }
  };

  const editDescription = async (newText: string) => {
    console.log("Edit Function mounted!");
    if (!selectedTask) return; // 🧩 make sure a task is selected
    const trimmed = newText.trim();
    if (!trimmed) return;

    try {
      const taskRef = doc(db, "tasks", selectedTask);
      await updateDoc(taskRef, { description: trimmed });
      console.log("Task description updated successfully");
    } catch (error) {
      console.error("Error updating description:", error);
    }
  };

  const handleAddComment = async () => {
    console.log("Comment Function Mounted!");

    // ✅ Basic validation
    if (!profile?.uid) {
      console.warn("No user profile found — cannot post comment.");
      return;
    }

    const trimmedComment = isComment.trim();
    if (!trimmedComment) {
      console.warn("Empty comment — skipping add.");
      return;
    }

    try {
      const commentRef = collection(db, "comment");

      await addDoc(commentRef, {
        text: trimmedComment,
        createdAt: serverTimestamp(),
        uid: profile.uid,
        taskID: selectedTask,
      });

      console.log("✅ Comment added successfully");

      // ✅ Clear input after success
      setIsComment("");
    } catch (error) {
      console.error("❌ Error adding comment:", error);
    }
  };

  const getInputValue = (e: any) =>
    e?.nativeEvent?.text ??
    (e?.target as HTMLInputElement | HTMLTextAreaElement)?.value ??
    "";

  const currentTaskComments = comment
    .filter((t) => t.taskID === selectedTask)
    .sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      const aTime =
        a.createdAt instanceof Timestamp ? a.createdAt.toDate().getTime() : 0;
      const bTime =
        b.createdAt instanceof Timestamp ? b.createdAt.toDate().getTime() : 0;
      return bTime - aTime;
    });

  const [isEdit, setIsEdit] = useState(false);
  const [descHeight, setDescHeight] = useState(40);
  const [isComment, setIsComment] = useState("");

  useEffect(() => {
    console.log("Current Task ID: ", selectedTask);
    console.log("Comments: ", currentTaskComments);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Box style={{ borderWidth: 0, width: 100 }}>
        <Pressable
          onPress={() => {
            setIsEdit(false);
            router.replace("/(screens)/projectModal");
          }}
        >
          <HStack style={{ alignItems: "center", alignContent: "center" }}>
            <Icon
              as={ArrowLeftIcon}
              className="text-typography-500 m-2 w-7 h-7 "
            />
            <Text style={{ fontSize: 23, fontWeight: "bold" }}>Back</Text>
          </HStack>
        </Pressable>
      </Box>

      {isEdit ? (
        <View style={{ flex: 1, borderWidth: 1 }}>
          <Box style={{ borderWidth: 1, alignItems: "flex-end" }}>
            <Button action="positive" onPress={() => setIsEdit(false)}>
              <ButtonText>Done</ButtonText>
            </Button>
          </Box>
          <HStack style={{ flex: 1 }}>
            <Box style={{ flex: 1, borderWidth: 1 }}>
              <VStack style={{ flex: 1 }}>
                <TextInput
                  style={{
                    padding: 8,
                    textAlignVertical: "top",
                  }}
                  defaultValue={currentTask?.title}
                  placeholder="Input a task here..."
                  onBlur={(e) => editTitle(getInputValue(e))}
                />
                <TextInput
                  multiline
                  scrollEnabled={false}
                  onContentSizeChange={(e) =>
                    setDescHeight(e.nativeEvent.contentSize.height)
                  }
                  style={{
                    minHeight: 40,
                    height: descHeight,
                    padding: 8,
                    textAlignVertical: "top",
                  }}
                  defaultValue={currentTask?.description}
                  placeholder="Input a task here..."
                  onBlur={(e) => editDescription(getInputValue(e))}
                />
              </VStack>
            </Box>
            <Box style={{ flex: 1, borderWidth: 1 }}>
              <VStack>
                <Text>{currentTask?.status}</Text>
                <HStack>
                  <Text>
                    {currentTask?.start instanceof Timestamp
                      ? currentTask.start.toDate().toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "No start date"}
                  </Text>

                  <Text> - </Text>

                  <Text>
                    {currentTask?.end instanceof Timestamp
                      ? currentTask.end.toDate().toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "No end date"}
                  </Text>
                </HStack>
              </VStack>
            </Box>
          </HStack>
        </View>
      ) : (
        <View style={{ flex: 1, borderWidth: 0, borderColor: "red" }}>
          <Box style={{ borderWidth: 1, alignItems: "flex-end" }}>
            <Pressable onPress={() => setIsEdit(true)}>
              <SquarePen />
            </Pressable>
          </Box>
          <HStack>
            <Box style={{ flex: 1, borderWidth: 1 }}>
              <VStack>
                <Text>{currentTask?.title}</Text>
                <Text>{currentTask?.description}</Text>
              </VStack>
            </Box>
            <Box style={{ flex: 1, borderWidth: 1 }}>
              <VStack>
                <Text>{currentTask?.status}</Text>
                <HStack>
                  <Text>
                    {currentTask?.start
                      ? currentTask.start.toDate().toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "No start date"}
                  </Text>
                  <Text> - </Text>
                  <Text>
                    {currentTask?.end
                      ? currentTask.end.toDate().toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "No start date"}
                  </Text>
                </HStack>
              </VStack>
            </Box>
          </HStack>
        </View>
      )}

      <View style={{ borderWidth: 0, flex: 1, borderColor: "yellow" }}>
        <Text>Comments</Text>
        <Box>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#0000005b",
              borderRadius: 8,
              padding: 10,
              color: "#000000ff",
            }}
            value={isComment}
            onChangeText={setIsComment}
            placeholder="Write a comment..."
          />

          <Button
            onPress={handleAddComment}
            action="primary"
            style={{ marginTop: 8 }}
          >
            <ButtonText>Post</ButtonText>
          </Button>
        </Box>

        <Box style={{ flex: 1, borderWidth: 0, borderColor: "blue" }}>
          <ScrollView>
            {currentTaskComments.map((t) => (
              <View key={t.id} style={{ borderWidth: 1, borderColor: "green" }}>
                <Card>
                  <Text>
                    {profiles.find((a) => a.uid === t.uid)?.firstName}{" "}
                    {profiles.find((a) => a.uid === t.uid)?.lastName}
                  </Text>
                  <Text>{t.text}</Text>
                </Card>
              </View>
            ))}
          </ScrollView>
        </Box>
      </View>
    </View>
  );
}
