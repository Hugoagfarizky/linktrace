import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { hashPassword, createSessionToken, setAuthCookies } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = registerSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password } = validated.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already registered
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user and initial default workspace
    const slugBase = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .substring(0, 20);
    const uniqueSlug = `${slugBase || "workspace"}-${Math.random().toString(36).substring(2, 7)}`;

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        workspaces: {
          create: {
            name: `${name}'s Workspace`,
            slug: uniqueSlug,
            members: {
              create: {
                role: "OWNER",
                user: {
                  connect: { email: normalizedEmail },
                },
              },
            },
          },
        },
      },
      include: {
        workspaces: true,
      },
    });

    const defaultWorkspace = user.workspaces[0];

    // Create session token and set cookies
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    await setAuthCookies(token, defaultWorkspace.id);

    return NextResponse.json(
      {
        user: { id: user.id, name: user.name, email: user.email },
        workspace: defaultWorkspace,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error during registration" },
      { status: 500 }
    );
  }
}
