import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, signInAnonymously, type Auth } from "firebase/auth";
import { doc, getFirestore, increment, updateDoc } from "firebase/firestore";

type ViewKind = "property" | "unit";

const COLLECTION: Record<ViewKind, string> = {
  property: "properties",
  unit: "units",
};

let viewsApp: FirebaseApp | null = null;
let viewsAuth: Auth | null = null;
let anonymousReady: Promise<void> | null = null;

function firebaseConfig() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!apiKey || !projectId) {
    throw new Error("Missing Firebase env vars.");
  }
  return {
    apiKey,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

function getViewsApp() {
  if (viewsApp) return viewsApp;
  viewsApp = getApps().find((app) => app.name === "public-views") || initializeApp(firebaseConfig(), "public-views");
  return viewsApp;
}

async function ensureAnonymousAuth() {
  if (!viewsAuth) viewsAuth = getAuth(getViewsApp());
  if (viewsAuth.currentUser) return;
  if (!anonymousReady) {
    anonymousReady = signInAnonymously(viewsAuth)
      .then(() => undefined)
      .catch((error) => {
        anonymousReady = null;
        throw error;
      });
  }
  await anonymousReady;
}

function collectionName(kind: ViewKind) {
  return COLLECTION[kind];
}

export async function recordPublicViewUnauthenticated(kind: ViewKind, id: string) {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!apiKey || !projectId) throw new Error("Missing Firebase env vars.");

  const documentName = `projects/${projectId}/databases/(default)/documents/${collectionName(kind)}/${id}`;
  const response = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:commit?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        writes: [
          {
            transform: {
              document: documentName,
              fieldTransforms: [
                {
                  fieldPath: "views",
                  increment: { integerValue: "1" },
                },
              ],
            },
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    const error = new Error(text || `Unauthenticated view increment failed (${response.status})`);
    (error as Error & { code?: string }).code =
      response.status === 403 ? "permission-denied" : String(response.status);
    throw error;
  }
}

export async function recordPublicView(kind: ViewKind, id: string) {
  await ensureAnonymousAuth();
  const db = getFirestore(getViewsApp());
  await updateDoc(doc(db, COLLECTION[kind], id), {
    views: increment(1),
  });
}

export async function recordPublicViewViaFunction(kind: ViewKind, id: string) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) throw new Error("Missing Firebase project id.");
  const response = await fetch(`https://us-central1-${projectId}.cloudfunctions.net/recordPublicView`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, id }),
  });
  if (!response.ok) {
    throw new Error(`recordPublicView function failed (${response.status})`);
  }
}

export function isViewKind(value: unknown): value is ViewKind {
  return value === "property" || value === "unit";
}

export function isViewId(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9_-]{1,128}$/.test(value);
}
