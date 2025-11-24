import React, { createContext, useContext, useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { AssignedUser, Project, StarsPoints, Task, TaskLogs } from "@/_types";

interface ProjectContextType {
  project: Project[];
  tasks: Task[];
  comment: Comment[];
  taskLogs: TaskLogs[];
  assignedUser: AssignedUser[];
  starsPoints: StarsPoints[];
  selectedProject: string | null;
  setSelectedProject: (id: string | null) => void;
  selectedTask: string | null;
  setSelectedTask: (id: string | null) => void;
  loading: boolean;
  error: string | null;
}

// === CONTEXT ===
const ProjectContext = createContext<ProjectContextType>({
  project: [],
  tasks: [],
  comment: [],
  taskLogs: [],
  assignedUser: [],
  starsPoints: [],
  selectedProject: null,
  setSelectedProject: () => {},
  selectedTask: null,
  setSelectedTask: () => {},
  loading: true,
  error: null,
});

export const useProject = () => useContext(ProjectContext);

// === PROVIDER ===
export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [project, setProject] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comment, setComment] = useState<Comment[]>([]);
  const [taskLogs, setTaskLogs] = useState<TaskLogs[]>([]);
  const [assignedUser, setAssignedUser] = useState<AssignedUser[]>([]);
  const [starsPoints, setStarsPoints] = useState<StarsPoints[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("✅ ProjectContext Mounted - Loading all data");

    let loadedCount = 0;
    const totalCollections = 6;

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === totalCollections) {
        setLoading(false);
        console.log("✅ All collections loaded");
      }
    };

    // --- Projects ---
    const unsubProject = onSnapshot(
      query(collection(db, "project")),
      (snapshot) => {
        const list: Project[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Project, "id">),
        }));
        setProject(list);
        checkAllLoaded();
      },
      (err) => {
        console.error("❌ Error loading projects:", err);
        setError("Failed to load projects");
        checkAllLoaded();
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
        checkAllLoaded();
      },
      (err) => {
        console.error("❌ Error loading tasks:", err);
        setError("Failed to load tasks");
        checkAllLoaded();
      }
    );

    // --- Comments (ordered by newest first) ---
    const unsubComments = onSnapshot(
      query(collection(db, "comment"), orderBy("createdAt", "desc")),
      (snapshot) => {
        const list: Comment[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Comment, "id">),
        }));
        setComment(list);
        checkAllLoaded();
      },
      (err) => {
        console.error("❌ Error loading comments:", err);
        setError("Failed to load comments");
        checkAllLoaded();
      }
    );

    // --- Task Logs (ordered by newest first) ---
    const unsubTaskLogs = onSnapshot(
      query(collection(db, "taskLogs"), orderBy("createdAt", "desc")),
      (snapshot) => {
        const list: TaskLogs[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<TaskLogs, "id">),
        }));
        setTaskLogs(list);
        checkAllLoaded();
      },
      (err) => {
        console.error("❌ Error loading task logs:", err);
        setError("Failed to load task logs");
        checkAllLoaded();
      }
    );

    // --- Assigned Users ---
    const unsubAssignedUsers = onSnapshot(
      collection(db, "assignedUser"),
      (snapshot) => {
        const list: AssignedUser[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<AssignedUser, "id">),
        }));
        setAssignedUser(list);
        checkAllLoaded();
      },
      (err) => {
        console.error("❌ Error loading assigned users:", err);
        setError("Failed to load assigned users");
        checkAllLoaded();
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
        setStarsPoints(list);
        checkAllLoaded();
      },
      (err) => {
        console.error("❌ Error loading stars/points:", err);
        setError("Failed to load stars/points");
        checkAllLoaded();
      }
    );

    // --- Cleanup ---
    return () => {
      unsubProject();
      unsubTasks();
      unsubComments();
      unsubTaskLogs();
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
        taskLogs,
        assignedUser,
        starsPoints,
        selectedProject,
        setSelectedProject,
        selectedTask,
        setSelectedTask,
        loading,
        error,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
