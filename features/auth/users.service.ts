import { doc, getDoc, setDoc, collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase/firebase";
import type { UserData, UserRole, UserAuditLog } from "@/types/user";

class UsersService {
  private readonly collectionName = "users";

  async getUserProfile(uid: string): Promise<UserData | null> {
    const userDocRef = doc(db, this.collectionName, uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }

    return null;
  }

  async getUsersByRole(role: UserRole): Promise<UserData[]> {
    const { collection, query, where, getDocs } = await import("firebase/firestore");
    const usersRef = collection(db, this.collectionName);
    const q = query(usersRef, where("role", "==", role));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => doc.data() as UserData);
  }

  async createUserProfile(uid: string, email: string, role: UserRole, extraData: Partial<UserData> = {}): Promise<UserData> {
    const userDocRef = doc(db, this.collectionName, uid);
    
    const newUser: UserData = {
      uid,
      email,
      role,
      createdAt: Date.now(),
      ...extraData,
    };

    await setDoc(userDocRef, newUser, { merge: true });
    return newUser;
  }
  async updateUserData(uid: string, data: Partial<UserData>): Promise<void> {
    const userDocRef = doc(db, this.collectionName, uid);
    await setDoc(userDocRef, data, { merge: true });
  }

  async uploadAvatar(uid: string, file: File): Promise<string> {
    const fileExtension = file.name.split(".").pop();
    const filePath = `users/${uid}/avatar.${fileExtension}`;
    const storageRef = ref(storage, filePath);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    await this.updateUserData(uid, { photoURL: downloadURL });
    return downloadURL;
  }

  async logUserAction(uid: string, action: "login" | "logout"): Promise<void> {
    try {
      let ip = "Unknown IP";
      try {
        const res = await fetch("/api/ip");
        const data = await res.json();
        ip = data.ip || "Unknown IP";
      } catch (err) {
        console.warn("Could not fetch IP", err);
      }

      const logData: Omit<UserAuditLog, "id"> = {
        action,
        timestamp: Date.now(),
        ip,
      };

      const logsRef = collection(db, this.collectionName, uid, "auditLogs");
      await addDoc(logsRef, logData);

      // Also update the main user document with the latest login details so it can be efficiently displayed in the main table
      if (action === "login") {
        await this.updateUserData(uid, {
          lastLoginAt: logData.timestamp,
          lastLoginIp: ip,
        });
      }
    } catch (error) {
      console.error("Failed to log user action:", error);
    }
  }

  async getUserAuditLogs(uid: string): Promise<UserAuditLog[]> {
    const logsRef = collection(db, this.collectionName, uid, "auditLogs");
    const q = query(logsRef, orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as UserAuditLog[];
  }
}

export const usersService = new UsersService();
