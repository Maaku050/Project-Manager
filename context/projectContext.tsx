import React, { createContext, useContext, useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

// === TYPES ===
interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  startedAt: string | null;
  deadline: string | null;
  createdBy: string;
}

interface Task {
  id: string;
  projectID: string;
  text: string;
  status: string;
  start: string | null;
  end: string | null;
}

interface Comment {
  id: string;
  taskID: string;
  text: string;
  uid: string;
}

interface AssignedUser {
  id: string;
  projectID: string;
  uid: string;
}

interface ProjectContextType {
  project: Project[];
  tasks: Task[];
  comment: Comment[];
  assignedUser: AssignedUser[];
}

// === CONTEXT ===
const ProjectContext = createContext<ProjectContextType>({
  project: [],
  tasks: [],
  comment: [],
  assignedUser: [],
});

export const useProject = () => useContext(ProjectContext);

// === PROVIDER ===
export const ProjectProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [project, setProject] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comment, setComment] = useState<Comment[]>([]);
  const [assignedUser, setAssignedUser] = useState<AssignedUser[]>([]);

  useEffect(() => {
    console.log("✅ ProjectContext Mounted");

    // --- Projects ---
    const unsubProject = onSnapshot(
      query(collection(db, "project")),
      (snapshot) => {
        const list: Project[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Project, "id">),
        }));
        setProject(list);
        console.log(list);
      }
    );

    // --- Tasks ---
    const unsubTasks = onSnapshot(
      query(collection(db, "tasks")),
      (snapshot) => {
        const list: Task[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Task, "id">),
        }));
        setTasks(list);
        console.log("Tasks: ", list);
      }
    );

    // --- Comments ---
    const unsubComments = onSnapshot(collection(db, "comments"), (snapshot) => {
      const list: Comment[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Comment, "id">),
      }));
      setComment(list);
    });

    // --- Assigned Users ---
    const unsubAssignedUsers = onSnapshot(
      collection(db, "assignedUsers"),
      (snapshot) => {
        const list: AssignedUser[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<AssignedUser, "id">),
        }));
        setAssignedUser(list);
      }
    );

    // --- Cleanup ---
    return () => {
      unsubProject();
      unsubTasks();
      unsubComments();
      unsubAssignedUsers();
    };
  }, []);

  return (
    <ProjectContext.Provider value={{ project, tasks, comment, assignedUser }}>
      {children}
    </ProjectContext.Provider>
  );
};
