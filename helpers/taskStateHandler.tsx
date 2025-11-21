import { db } from "@/firebase/firebaseConfig";
import { doc, updateDoc, Timestamp } from "firebase/firestore";

const handleStartTask = async (taskID: string) => {
  try {
    const taskRef = doc(db, "tasks", taskID);
    await updateDoc(taskRef, {
      status: "Ongoing",
      createdAt: null,
    });
  } catch (error) {
    console.log("Error starting task: ", error);
  }
};

const handleUnstartTask = async (taskID: string) => {
  try {
    const taskRef = doc(db, "tasks", taskID);
    await updateDoc(taskRef, {
      status: "To-do",
    });
  } catch (error) {
    console.log("Error Unstarting task: ", error);
  }
};

const handleCompleteTask = async (
  taskID: string,
  taskDeadline: Timestamp | null
) => {
  try {
    const taskRef = doc(db, "tasks", taskID);

    const status = (() => {
      if (!taskDeadline) return "Archived";

      // Clone Timestamp date so we don't mutate it
      const deadline = new Date(taskDeadline.toDate());
      const today = new Date();

      // Normalize both to midnight for fair comparison
      deadline.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      return deadline >= today ? "CompleteAndOnTime" : "CompleteAndOverdue";
    })();

    await updateDoc(taskRef, { status, completedAt: Timestamp.now() });
  } catch (error) {
    console.log("Error completing task:", error);
  }
};

export { handleStartTask, handleUnstartTask, handleCompleteTask };
