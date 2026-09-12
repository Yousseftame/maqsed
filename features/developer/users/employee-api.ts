import { auth } from "@/lib/firebase/firebase";

type EmployeeApiResult = {
  success?: boolean;
  uid?: string;
  status?: string;
  message?: string;
  error?: string;
  code?: string;
};

async function employeeRequest(method: string, body: Record<string, unknown>) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) {
    const error = new Error("You must be logged in.");
    (error as Error & { code?: string }).code = "unauthenticated";
    throw error;
  }

  const response = await fetch("/api/employees", {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => ({}))) as EmployeeApiResult;
  if (!response.ok) {
    const error = new Error(data.error || "Request failed");
    (error as Error & { code?: string }).code = data.code;
    throw error;
  }

  return data;
}

export function createEmployeeAccount(payload: {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  password: string;
}) {
  return employeeRequest("POST", payload);
}
