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
import { usersService } from "@/features/auth/users.service";
import type { UserData } from "@/types/user";

type AuthContextValue = {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        try {
          const profile = await usersService.getUserProfile(nextUser.uid);
          // If no profile found, we might treat them as a regular user or admin depending on logic.
          // For now, if no profile, we can just leave userData as null or create a default.
          setUserData(profile);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const credential = await signInWithEmail(email, password);
    const idToken = await credential.user.getIdToken();
    await createSessionCookie(idToken);
    await usersService.logUserAction(credential.user.uid, "login").catch(console.error);
  }, []);

  const signOut = useCallback(async () => {
    if (user) {
      await usersService.logUserAction(user.uid, "logout").catch(console.error);
    }
    await signOutCurrentUser();
    await clearSessionCookie();
  }, [user]);

  const resetPassword = useCallback(async (email: string) => {
    await sendResetEmail(email);
  }, []);

  const refreshUser = useCallback(async () => {
    if (user) {
      try {
        const profile = await usersService.getUserProfile(user.uid);
        setUserData(profile);
      } catch (error) {
        console.error("Failed to refresh user profile:", error);
      }
    }
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, userData, loading, signIn, signOut, resetPassword, refreshUser }),
    [user, userData, loading, signIn, signOut, resetPassword, refreshUser]
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
