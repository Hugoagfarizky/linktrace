import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "linktrace-super-secret-key-change-in-production-32-chars-long"
);

const SESSION_COOKIE_NAME = "linktrace_session";
const WORKSPACE_COOKIE_NAME = "linktrace_workspace";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string | null;
  [key: string]: unknown;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function setAuthCookies(token: string, workspaceId?: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  if (workspaceId) {
    cookieStore.set(WORKSPACE_COOKIE_NAME, workspaceId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(WORKSPACE_COOKIE_NAME);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        createdAt: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
}

export async function getActiveWorkspace(userId: string) {
  const cookieStore = await cookies();
  const preferredWorkspaceId = cookieStore.get(WORKSPACE_COOKIE_NAME)?.value;

  try {
    if (preferredWorkspaceId) {
      const workspace = await prisma.workspace.findFirst({
        where: {
          id: preferredWorkspaceId,
          OR: [
            { ownerId: userId },
            { members: { some: { userId } } },
          ],
        },
      });
      if (workspace) return workspace;
    }

    // Default to the first owned workspace
    const defaultWorkspace = await prisma.workspace.findFirst({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    return defaultWorkspace;
  } catch (error) {
    console.error("Failed to get active workspace:", error);
    return null;
  }
}
