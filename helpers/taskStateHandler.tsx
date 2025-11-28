import { auth, db } from "@/firebase/firebaseConfig";
import {
  doc,
  updateDoc,
  Timestamp,
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDoc,
  getDocs,
  increment,
  writeBatch,
} from "firebase/firestore";
import { useUser } from "@/context/profileContext";
import { useProject } from "@/context/projectContext";




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
  } catch (error) { }
};

const handleStartTask = async (uid: string[],taskID: string, points: number, restart: boolean) => {
  try {



    const taskRef = doc(db, "tasks", taskID);
    await updateDoc(taskRef, {
      status: "Ongoing",
      createdAt: null,
    });


    // const batch = writeBatch(db);
    // const profileRef = collection(db, "profile");
    // const q = query(profileRef, where("uid", "==", uid));
    // const snapshot = await getDocs(q);
    // const docSnap = snapshot.docs[0];
    // if (snapshot.empty) {
    //   console.log("No profile found for UID:", uid);
    //   return;
    // }
    // const docRef = doc(db, "profile", docSnap.id);
    // batch.update(docRef, { points: increment(-points) });
    // await batch.commit();

    
    for (const user of uid){
        const assignRef = collection(db, "profile");
        const q = query(assignRef, 
          where("uid", "==", user)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const profileDoc = querySnapshot.docs[0];

           const userRef = doc(db, "profile", profileDoc.id);
          await updateDoc(userRef, {
            points: increment(-points)
          });
        }
        console.log('✅ Success! minus -', points, 'points to user', uid);
    }

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
  assignedUserIDs: string[],
  taskID: string,
  points: number,
  taskDeadline: Timestamp | null
) => {
  console.log('assignedUserIDs', assignedUserIDs)
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

    await updateDoc(taskRef,
      {
        status,
        completedAt: Timestamp.now(),
      });
    // call the handle add points here

    // Create a Set of assigned user IDs for faster lookup


    // if (assignedUserInTask?.length > 0) {
    //   for (const user of assignedUserInTask) {
    //      console.log(`all assigned user: ${user}`);
    //   }
    // }


    if (assignedUserIDs.length > 0) {
      for (const user of assignedUserIDs) {
    await handleAddPoints(user, points);
      }
    }
    console.log(`assigned user id: ${assignedUserIDs}`);

    await handleLog(taskID, "complete");
  } catch (error) {
    console.log("Error completing task:", error);
  }
};


const handleAddPoints = async (uid: string, points: number) => {
  try {
    const batch = writeBatch(db);

  
    const profileRef = collection(db, "profile");
    const q = query(profileRef, where("uid", "==", uid));
    const snapshot = await getDocs(q);
    const docSnap = snapshot.docs[0];

    if (snapshot.empty) {
      console.log("No profile found for UID:", uid);
      return;
    }

    const docRef = doc(db, "profile", docSnap.id);
    batch.update(docRef, { points: increment(points) });
    await batch.commit();

    console.log(`✅ Added ${points} points to user ${uid}`);
  } catch (err) {
    console.error("Error saving:", err);
  }
};


export { handleStartTask, handleUnstartTask, handleCompleteTask };
