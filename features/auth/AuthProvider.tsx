"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";
import {
  sendResetEmail,
  signInWithEmail,
  signOutCurrentUser,
} from "@/lib/firebase/auth";
import { clearSessionCookie, createSessionCookie } from "@/lib/auth/session";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const credential = await signInWithEmail(email, password);
    const idToken = await credential.user.getIdToken();
    await createSessionCookie(idToken);
  }, []);

  const signOut = useCallback(async () => {
    await signOutCurrentUser();
    await clearSessionCookie();
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await sendResetEmail(email);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, signIn, signOut, resetPassword }),
    [user, loading, signIn, signOut, resetPassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
