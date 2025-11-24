import { auth, db } from "@/firebase/firebaseConfig";
import {
  doc,
  updateDoc,
  Timestamp,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

const handleLog = async (taskID: string, state: string) => {
  const logRef = collection(db, "taskLogs");
  try {
    {
      state === "start"
        ? await addDoc(logRef, {
            taskID,
            uid: auth.currentUser?.uid,
            createdAt: serverTimestamp(),
            text: "started this task",
          })
        : state === "unstart"
          ? await addDoc(logRef, {
              taskID,
              uid: auth.currentUser?.uid,
              createdAt: serverTimestamp(),
              text: "unstarted this task",
            })
          : state === "complete"
            ? await addDoc(logRef, {
                taskID,
                uid: auth.currentUser?.uid,
                createdAt: serverTimestamp(),
                text: "completed this task",
              })
            : state === "restart"
              ? await addDoc(logRef, {
                  taskID,
                  uid: auth.currentUser?.uid,
                  createdAt: serverTimestamp(),
                  text: "restarted this task",
                })
              : "";
    }
  } catch (error) {}
};

const handleStartTask = async (taskID: string, restart: boolean) => {
  try {
    const taskRef = doc(db, "tasks", taskID);
    await updateDoc(taskRef, {
      status: "Ongoing",
      createdAt: null,
    });

    await handleLog(taskID, restart ? "start" : "restart");
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

    await handleLog(taskID, "unstart");
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
    await handleLog(taskID, "complete");
  } catch (error) {
    console.log("Error completing task:", error);
  }
};

export { handleStartTask, handleUnstartTask, handleCompleteTask };
