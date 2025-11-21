import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

// === TYPES ===
interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  startedAt: string | null;
  deadline: Timestamp | null;
  createdBy: string;
}

interface Task {
  id: string;
  projectID: string;
  title: string;
  description: string;
  status: string;
  start: Timestamp | null;
  end: Timestamp | null;
  completedAt: Timestamp | null;
}

interface Comment {
  id: string;
  taskID: string;
  text: string;
  uid: string;
  createdAt: Timestamp;
}

interface AssignedUser {
  id: string;
  projectID: string;
  taskID: string;
  uid: string;
}

interface StarsPoints {
  id: string;
  taskID: string;
  points: number;
  stars: number;
}

interface ProjectContextType {
  project: Project[];
  tasks: Task[];
  comment: Comment[];
  assignedUser: AssignedUser[];
  selectedProject: string | null;
  setSelectedProject: (id: string | null) => void;
  selectedTask: string | null;
  setSelectedTask: (id: string | null) => void;
  starsPoints: StarsPoints | null;
  setStarsPoints: (value: StarsPoints | null) => void;
}

// === CONTEXT ===
const ProjectContext = createContext<ProjectContextType>({
  project: [],
  tasks: [],
  comment: [],
  assignedUser: [],
  selectedProject: null,
  setSelectedProject: () => {},
  selectedTask: null,
  setSelectedTask: () => {},
  starsPoints: null,
  setStarsPoints: () => {},
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
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [starsPoints, setStarsPoints] = useState<StarsPoints | null>(null);

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
      }
    );

    // --- Comments ---
    const unsubComments = onSnapshot(collection(db, "comment"), (snapshot) => {
      const list: Comment[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Comment, "id">),
      }));
      setComment(list);
    });

    // --- Assigned Users ---
    const unsubAssignedUsers = onSnapshot(
      collection(db, "assignedUser"),
      (snapshot) => {
        const list: AssignedUser[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<AssignedUser, "id">),
        }));
        setAssignedUser(list);
      }
    );

    // --- Stars Points ---
    const unsubStarsPoints = onSnapshot(
      collection(db, "starsPoints"),
      (snapshot) => {
        const list: StarsPoints[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<StarsPoints, "id">),
        }));
        setStarsPoints(list[0] || null);
      }
    );

    // --- Cleanup ---
    return () => {
      unsubProject();
      unsubTasks();
      unsubComments();
      unsubAssignedUsers();
      unsubStarsPoints();
      console.log("❌ ProjectContext Unmounted");
    };
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        project,
        tasks,
        comment,
        assignedUser,
        selectedProject,
        setSelectedProject,
        selectedTask,
        setSelectedTask,
        starsPoints,
        setStarsPoints,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
