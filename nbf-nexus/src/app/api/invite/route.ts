import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Verify admin role via metadata
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  
  if (user.publicMetadata.role !== "admin") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    // Create invitation
    // Note: Clerk invitations allow users to sign up and automatically be linked to your instance.
    // We can also set publicMetadata for the invited user if the plan allows.
    const invitation = await client.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/sign-up`,
      publicMetadata: {
        role: "trainee",
      },
      ignoreExisting: true,
    });

    return NextResponse.json(invitation);
  } catch (error: any) {
    console.error("[INVITE_ERROR]", error);
    return new NextResponse(error.message || "Internal Error", { status: 500 });
  }
}
