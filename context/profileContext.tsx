import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";

interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  nickName: string;
  role: string;
  email: string;
  points: number;
  uid: string;
}

interface UserContextType {
  user: any;
  profile: Profile | null;
}

const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    console.log("UserContext mounted");
    let unsubProfile: (() => void) | undefined;

    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setProfile(null);
        if (unsubProfile) unsubProfile(); // cleanup profile listener
        return;
      }

      setUser(currentUser);

      const profileQuery = query(
        collection(db, "profile"),
        where("uid", "==", currentUser.uid)
      );

      unsubProfile = onSnapshot(profileQuery, (snapshot) => {
        const doc = snapshot.docs[0];
        setProfile(
          doc ? { id: doc.id, ...(doc.data() as Omit<Profile, "id">) } : null
        );
      });
    });

    return () => {
      unsubAuth();
      if (unsubProfile) unsubProfile();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, profile }}>
      {children}
    </UserContext.Provider>
  );
};
