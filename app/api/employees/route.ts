import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/constants";
import { EmployeeApiError } from "@/lib/employees/errors";
import {
  createEmployeeAccount,
} from "@/lib/employees/employee-accounts.server";
import { lookupAccount } from "@/lib/firebase/identity-toolkit";

export const runtime = "nodejs";
export const maxDuration = 30;

async function getCaller(request: NextRequest) {
  if (request.cookies.get(SESSION_COOKIE)?.value !== "1") {
    throw new EmployeeApiError(401, "unauthenticated", "You must be logged in.");
  }

  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) {
    throw new EmployeeApiError(401, "unauthenticated", "You must be logged in.");
  }

  const uid = await lookupAccount(token);
  return { uid, token };
}

function errorResponse(error: unknown) {
  if (error instanceof EmployeeApiError) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
  }
  console.error("Employee API failed", error);
  const message = error instanceof Error ? error.message : "Request failed";
  return NextResponse.json({ error: message, code: "internal" }, { status: 500 });
}

export async function POST(request: NextRequest) {
  try {
    const caller = await getCaller(request);
    const body = await request.json().catch(() => null);
    const result = await createEmployeeAccount(caller.token, caller.uid, {
      firstName: body?.firstName,
      lastName: body?.lastName,
      email: body?.email,
      password: body?.password,
      phone: body?.phone,
    });
    return NextResponse.json(result);
  } catch (error) {
    return errorResponse(error);
  }
}
