import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import type { UserData, UserRole } from "@/types/user";

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
}

export const usersService = new UsersService();
