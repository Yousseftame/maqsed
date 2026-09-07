const FIRESTORE_TIMEOUT_MS = 4000;

function firestoreUrl() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!projectId || !apiKey) return null;
  return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/maintenance/settings?key=${apiKey}`;
}

export async function getMaintenanceEnabled(): Promise<boolean | null> {
  const url = firestoreUrl();
  if (!url) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FIRESTORE_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (response.status === 404) return false;
    if (!response.ok) return null;
    const payload = (await response.json()) as {
      fields?: { enabled?: { booleanValue?: boolean } };
    };
    return payload.fields?.enabled?.booleanValue === true;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
