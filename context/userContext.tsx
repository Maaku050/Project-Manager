// import React, { createContext, useContext, useEffect, useState } from "react";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import {
//   collection,
//   onSnapshot,
//   orderBy,
//   query,
//   where,
// } from "firebase/firestore";
// import { auth, db } from "@/firebase/firebaseConfig";

// interface Project {
//   id: string;
//   title: string;
//   description: string;
//   status: string;
//   startedAt: string | null;
//   deadline: string | null;
//   createdBy: string;
// }

// interface Task {
//   id: string;
//   projectID: string;
//   text: string;
//   status: string;
//   start: string | null;
//   end: string | null;
// }

// interface Comment {
//   id: string;
//   taskID: string;
//   text: string;
//   uid: string;
// }

// interface AssignedUser {
//   id: string;
//   projectID: string;
//   uid: string;
// }

// interface Profile {
//   id: string;
//   firstName: string;
//   lastName: string;
//   nickName: string;
//   role: string;
//   email: string;
//   points: number;
//   uid: string;
// }

// interface UserContextType {
//   user: any;
//   project: Project[];
//   tasks: Task[];
//   comment: Comment[];
//   assignedUser: AssignedUser[];
//   profile: Profile[];
// }

// const UserContext = createContext<UserContextType>({
//   user: null,
//   project: [],
//   tasks: [],
//   comment: [],
//   assignedUser: [],
//   profile: [],
// });

// export const useUser = () => useContext(UserContext);

// export const UserProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<any>(null);
//   const [project, setProject] = useState<Project[]>([]);
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [comment, setComment] = useState<Comment[]>([]);
//   const [assignedUser, setAssignedUser] = useState<AssignedUser[]>([]);
//   const [profile, setProfile] = useState<Profile[]>([]);

//   useEffect(() => {
//     console.log("UserContext mounted");

//     const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
//       if (!currentUser) {
//         setUser(null);
//         setTasks([]);
//         setProfile([]);
//         return;
//       }

//       setUser(currentUser);

//       // Fetch Project
//       const projectQuery = query(collection(db, "project"));

//       const unsubProject = onSnapshot(projectQuery, (snapshot) => {
//         const list: Project[] = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...(doc.data() as Omit<Project, "id">),
//         }));
//         setProject(list);
//       });

//       // Fetch Tasks
//       const taskQuery = query(
//         collection(db, "tasks"),
//         where("projectID", "==", currentUser.uid),
//         orderBy("createdAt", "desc")
//       );

//       const unsubTasks = onSnapshot(taskQuery, (snapshot) => {
//         const list: Task[] = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...(doc.data() as Omit<Task, "id">),
//         }));
//         setTasks(list);
//       });

//       // 👇 Fetch "profile"
//       const profileQuery = query(
//         collection(db, "profile"),
//         where("uid", "==", currentUser.uid)
//       );

//       const unsubProfile = onSnapshot(profileQuery, (snapshot) => {
//         const list: Profile[] = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...(doc.data() as Omit<Profile, "id">),
//         }));
//         setProfile(list);
//         // setFetchLoading(false);
//       });

//       return () => {
//         unsubTasks();
//         unsubProfile();
//       };
//     });

//     return () => unsubAuth();
//   }, []);

//   return (
//     <UserContext.Provider
//       value={{ user, project, tasks, comment, assignedUser, profile }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };
