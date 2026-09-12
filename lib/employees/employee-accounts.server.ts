import { EmployeeApiError } from "@/lib/employees/errors";
import {
  countEmployees,
  createAuthUser,
  createUserDocument,
  deleteAuthUser,
  getUserDocument,
} from "@/lib/firebase/identity-toolkit";

export { EmployeeApiError };

async function getDeveloperCaller(idToken: string, uid: string) {
  const data = await getUserDocument(idToken, uid);
  if (!data) {
    throw new EmployeeApiError(403, "permission-denied", "Caller profile was not found.");
  }
  if (data.role !== "developer") {
    throw new EmployeeApiError(403, "permission-denied", "Only developers can manage employee accounts.");
  }
  return { uid, data };
}

export async function createEmployeeAccount(
  callerToken: string,
  callerUid: string,
  input: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phone?: string;
  }
) {
  const caller = await getDeveloperCaller(callerToken, callerUid);
  const firstName = (input.firstName || "").trim();
  const email = (input.email || "").trim();
  const password = input.password || "";

  if (!email || !password || !firstName) {
    throw new EmployeeApiError(400, "invalid-argument", "Missing required fields (email, password, firstName).");
  }

  const maxEmployees = Number(caller.data.usersPerDeveloper) || 0;
  const currentCount = await countEmployees(callerToken, caller.uid);

  if (currentCount >= maxEmployees) {
    throw new EmployeeApiError(
      409,
      "failed-precondition",
      `Employee limit reached (${currentCount}/${maxEmployees}).`
    );
  }

  const created = await createAuthUser(email, password, `${firstName} ${input.lastName || ""}`.trim());

  try {
    await createUserDocument(created.idToken, created.uid, {
      email,
      role: "employee",
      developerUid: caller.uid,
      displayName: firstName,
      lastName: input.lastName || "",
      phoneNumber: input.phone || "",
      companyName: typeof caller.data.companyName === "string" ? caller.data.companyName : "",
      status: "active",
    });
  } catch (error) {
    await deleteAuthUser(created.idToken);
    throw error;
  }

  return { success: true, uid: created.uid, message: "Employee account created successfully" };
}
