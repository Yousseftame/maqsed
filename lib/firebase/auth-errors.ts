import { FirebaseError } from "firebase/app";

const AUTH_ERROR_KEYS: Record<string, string> = {
  "auth/invalid-email": "auth.errors.invalidEmail",
  "auth/user-disabled": "auth.errors.disabled",
  "auth/user-not-found": "auth.errors.notFound",
  "auth/wrong-password": "auth.errors.invalidCredential",
  "auth/invalid-credential": "auth.errors.invalidCredential",
  "auth/invalid-login-credentials": "auth.errors.invalidCredential",
  "auth/too-many-requests": "auth.errors.tooMany",
  "auth/operation-not-allowed": "auth.errors.notAllowed",
  "auth/missing-password": "auth.errors.missingPassword",
  "auth/missing-email": "auth.errors.missingEmail",
};

export function getAuthErrorKey(error: unknown) {
  if (error instanceof FirebaseError) {
    return AUTH_ERROR_KEYS[error.code] ?? "auth.errors.generic";
  }

  return "auth.errors.generic";
}
