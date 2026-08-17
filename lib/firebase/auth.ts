import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";
import { getAuthErrorKey } from "@/lib/firebase/auth-errors";

async function withAuthError<T>(action: () => Promise<T>) {
  try {
    return await action();
  } catch (error) {
    throw new Error(getAuthErrorKey(error));
  }
}

export function signInWithEmail(email: string, password: string) {
  return withAuthError(() => signInWithEmailAndPassword(auth, email, password));
}

export function signOutCurrentUser() {
  return withAuthError(() => firebaseSignOut(auth));
}

export function sendResetEmail(email: string) {
  return withAuthError(() => sendPasswordResetEmail(auth, email));
}
