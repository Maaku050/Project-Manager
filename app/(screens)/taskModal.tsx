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

  const toDate = (t?: Timestamp | null) => (t ? t.toDate() : undefined);
  const toTimestamp = (d?: Date | null) => (d ? Timestamp.fromDate(d) : null);

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

  useEffect(() => {
    console.log("Current Task ID: ", selectedTask);
    console.log("Comments: ", currentTaskComments);
  }, []);

  useEffect(() => {
    if (currentTask) {
      setTempTitle(currentTask.title ?? "");
      setTempDescription(currentTask.description ?? "");
      setTempStart(currentTask.start ?? null);
      setTempEnd(currentTask.end ?? null);
    }

    console.log("Tasks start: ", tempStart);
  }, [currentTask]);

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

  const [tempTitle, setTempTitle] = useState<string>("");
  const [tempDescription, setTempDescription] = useState<string>("");
  const [tempStart, setTempStart] = useState<Timestamp | null>(null);
  const [tempEnd, setTempEnd] = useState<Timestamp | null>(null);
  const [descriptionPressed, setDescriptionPressed] = useState(false);

  const handleSaveChanges = async () => {
    if (
      !tempTitle.trim() ||
      !tempDescription.trim() ||
      !tempStart ||
      !tempEnd
    ) {
      console.log("Empty Fields!");
      return;
    }

    if (!selectedTask) {
      console.log("No selected task!");
      return;
    }

    try {
      const taskRef = doc(db, "tasks", selectedTask);
      await updateDoc(taskRef, {
        title: tempTitle,
        description: tempDescription,
        start: tempStart,
        end: tempEnd,
      });

      console.log("✅ Task updated successfully");
    } catch (error) {
      console.error("❌ Error updating task:", error);
    }
  };

  const truncateWords = (text: string | undefined, wordLimit: number) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + " ..."
      : text;
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <Box style={{ borderWidth: 0 }}>
        <HStack
          style={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Pressable
            onPress={() => {
              setIsEdit(false);
              router.replace("/(screens)/projectModal");
            }}
          >
            <HStack style={{ alignItems: "center" }}>
              <Icon
                as={ArrowLeftIcon}
                className="text-typography-500 w-7 h-6 mr-1 mt-1"
              />
              <Text style={{ fontSize: 25, fontWeight: "bold" }}>Back</Text>
            </HStack>
          </Pressable>

          <Pressable
            onPress={() => {
              if (currentTask) {
                setTempTitle(currentTask.title);
                setTempDescription(currentTask.description);
                setTempStart(currentTask.start);
                setTempEnd(currentTask.end);
              }
              setIsEdit(true);
            }}
          >
            <SquarePen />
          </Pressable>
        </HStack>
      </Box>

      {/* {isEdit ? (
        <View style={{ flex: 1, borderWidth: 1 }}>
          <Box style={{ borderWidth: 1, alignItems: "flex-end" }}>
            <Button
              action="negative"
              onPress={() => {
                if (currentTask) {
                  setTempTitle(currentTask.title ?? "");
                  setTempDescription(currentTask.description ?? "");
                  setTempStart(currentTask.start ?? null);
                  setTempEnd(currentTask.end ?? null);
                }

                setIsEdit(false);
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              action="positive"
              onPress={() => {
                handleSaveChanges();
                setIsEdit(false);
              }}
            >
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
                  value={tempTitle}
                  placeholder="Input the title here"
                  onChangeText={setTempTitle}
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
                  value={tempDescription}
                  placeholder="Input the description here"
                  onChangeText={setTempDescription}
                />
              </VStack>
            </Box>
            <Box style={{ flex: 1, borderWidth: 1 }}>
              <VStack>
                <Text>{currentTask?.status}</Text>
                <HStack>
                  <DateTimePicker
                    value={tempStart ? tempStart.toDate() : null} // ✅ null, not undefined
                    onChange={(date) =>
                      setTempStart(date ? Timestamp.fromDate(date) : null)
                    }
                    mode="date"
                    placeholder="Select a date and time"
                  />

                  <Text> - </Text>

                  <DateTimePicker
                    value={tempEnd ? tempEnd.toDate() : null}
                    onChange={(date) =>
                      setTempEnd(date ? Timestamp.fromDate(date) : null)
                    }
                    mode="date"
                    placeholder="Select a date and time"
                  />
                </HStack>
              </VStack>
            </Box>
          </HStack>
        </View>
      ) : ( */}

      <View
        style={{
          borderWidth: 1,
          borderColor: "red",
          borderRadius: 15,
          marginTop: 10,
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        <HStack>
          <Box style={{ flex: 1, borderWidth: 0 }}>
            <VStack>
              <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                Task title
              </Text>
              <Text style={{ marginBottom: 5, fontSize: 15 }}>
                {currentTask?.title}
              </Text>
              <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                Task description
              </Text>
              <Box style={{ borderWidth: 0 }}>
                <ScrollView>
                  {descriptionPressed ? (
                    <Pressable onPress={() => setDescriptionPressed(false)}>
                      <Text style={{ fontSize: 15 }}>
                        {truncateWords(currentTask?.description, 1000)}
                      </Text>
                    </Pressable>
                  ) : (
                    <Pressable onPress={() => setDescriptionPressed(true)}>
                      <Text style={{ fontSize: 15 }}>
                        {truncateWords(currentTask?.description, 50)}
                      </Text>
                    </Pressable>
                  )}
                </ScrollView>
              </Box>
            </VStack>
          </Box>

          <Box style={{ borderWidth: 0 }}>
            <HStack>
              <Box style={{ borderWidth: 1, justifyContent: "space-between" }}>
                <Text style={{ fontWeight: "bold", marginBottom: 20 }}>
                  Status
                </Text>
                <Text style={{ fontWeight: "bold", marginBottom: 20 }}>
                  Time Line
                </Text>
                <Text style={{ fontWeight: "bold", marginBottom: 20 }}>
                  assigned Members
                </Text>
              </Box>

              <Box style={{ borderWidth: 1 }}>
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
              </Box>
            </HStack>
          </Box>
        </HStack>
      </View>

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
