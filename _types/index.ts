import { Timestamp } from "firebase/firestore";

export type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  nickName: string;
  role: string;
  email: string;
  points: number;
  uid: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  status: string;
  startedAt: string | null;
  deadline: Timestamp | null;
  createdBy: string;
};

export type Task = {
  id: string;
  projectID: string;
  title: string;
  description: string;
  status: string;
  start: Timestamp | null;
  end: Timestamp | null;
};

export type Comment = {
  id: string;
  taskID: string;
  text: string;
  uid: string;
  createdAt: Timestamp;
};

export type AssignedUser = {
  id: string;
  projectID: string;
  taskID: string;
  uid: string;
};

export type StarsPoints = {
  id: string;
  taskID: string;
  points: number;
  stars: number;
};
