export async function createSessionCookie(idToken: string) {
  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    throw new Error("Could not start your session. Please try again.");
  }
}

export async function clearSessionCookie() {
  await fetch("/api/auth/session", { method: "DELETE" }).catch(() => undefined);
}
