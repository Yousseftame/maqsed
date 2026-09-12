import { EmployeeApiError } from "@/lib/employees/errors";

function apiKey() {
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!key) {
    throw new EmployeeApiError(500, "internal", "Missing Firebase API key.");
  }
  return key;
}

function projectId() {
  const id = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!id) {
    throw new EmployeeApiError(500, "internal", "Missing Firebase project id.");
  }
  return id;
}

function identityUrl(path: string) {
  return `https://identitytoolkit.googleapis.com/v1/${path}?key=${apiKey()}`;
}

function firestoreDocUrl(uid: string) {
  return `https://firestore.googleapis.com/v1/projects/${projectId()}/databases/(default)/documents/users/${encodeURIComponent(uid)}`;
}

function firestoreQueryUrl() {
  return `https://firestore.googleapis.com/v1/projects/${projectId()}/databases/(default)/documents:runQuery`;
}

async function readJson(response: Response) {
  return (await response.json().catch(() => ({}))) as Record<string, unknown>;
}

export async function lookupAccount(idToken: string) {
  const response = await fetch(identityUrl("accounts:lookup"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  const data = await readJson(response);
  const users = Array.isArray(data.users) ? data.users : [];
  const localId = typeof users[0]?.localId === "string" ? users[0].localId : "";
  if (!response.ok || !localId) {
    throw new EmployeeApiError(401, "unauthenticated", "You must be logged in.");
  }
  return localId;
}

export async function createAuthUser(email: string, password: string, displayName: string) {
  const response = await fetch(identityUrl("accounts:signUp"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  const data = await readJson(response);
  const errorMessage = typeof (data.error as { message?: string } | undefined)?.message === "string"
    ? (data.error as { message: string }).message
    : "";

  if (!response.ok) {
    if (errorMessage === "EMAIL_EXISTS") {
      throw new EmployeeApiError(409, "already-exists", "The email address is already in use by another account.");
    }
    throw new EmployeeApiError(500, "internal", errorMessage || "Failed to create employee account");
  }

  const uid = typeof data.localId === "string" ? data.localId : "";
  const idToken = typeof data.idToken === "string" ? data.idToken : "";
  if (!uid || !idToken) {
    throw new EmployeeApiError(500, "internal", "Failed to create employee account");
  }

  if (displayName) {
    await fetch(identityUrl("accounts:update"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, displayName, returnSecureToken: false }),
    }).catch(() => undefined);
  }

  return { uid, idToken };
}

export async function deleteAuthUser(idToken: string) {
  await fetch(identityUrl("accounts:delete"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  }).catch(() => undefined);
}

function stringField(value: string) {
  return { stringValue: value };
}

export async function getUserDocument(idToken: string, uid: string) {
  const response = await fetch(firestoreDocUrl(uid), {
    headers: { Authorization: `Bearer ${idToken}` },
  });
  const data = await readJson(response);
  if (!response.ok) {
    return null;
  }
  return decodeFields((data.fields || {}) as Record<string, Record<string, unknown>>);
}

export async function countEmployees(idToken: string, developerUid: string) {
  const response = await fetch(firestoreQueryUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: "users" }],
        where: {
          fieldFilter: {
            field: { fieldPath: "developerUid" },
            op: "EQUAL",
            value: stringField(developerUid),
          },
        },
      },
    }),
  });

  const rows = (await response.json().catch(() => [])) as Array<{ document?: unknown }>;
  if (!response.ok || !Array.isArray(rows)) {
    throw new EmployeeApiError(500, "internal", "Failed to load employee accounts.");
  }
  return rows.filter((row) => row.document).length;
}

export async function createUserDocument(
  idToken: string,
  uid: string,
  profile: {
    email: string;
    role: string;
    developerUid: string;
    displayName: string;
    lastName: string;
    phoneNumber: string;
    companyName: string;
    status: string;
  }
) {
  const response = await fetch(firestoreDocUrl(uid), {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: {
        uid: stringField(uid),
        email: stringField(profile.email),
        role: stringField(profile.role),
        developerUid: stringField(profile.developerUid),
        createdAt: { timestampValue: new Date().toISOString() },
        displayName: stringField(profile.displayName),
        lastName: stringField(profile.lastName),
        phoneNumber: stringField(profile.phoneNumber),
        companyName: stringField(profile.companyName),
        status: stringField(profile.status),
      },
    }),
  });

  if (!response.ok) {
    const data = await readJson(response);
    const message = typeof (data.error as { message?: string } | undefined)?.message === "string"
      ? (data.error as { message: string }).message
      : "Failed to create employee profile.";
    throw new EmployeeApiError(500, "internal", message);
  }
}

function decodeFields(fields: Record<string, Record<string, unknown>>) {
  const data: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    if ("stringValue" in value) data[key] = value.stringValue;
    else if ("integerValue" in value) data[key] = Number(value.integerValue);
    else if ("doubleValue" in value) data[key] = Number(value.doubleValue);
    else if ("booleanValue" in value) data[key] = value.booleanValue;
    else if ("timestampValue" in value) data[key] = value.timestampValue;
  }
  return data;
}
