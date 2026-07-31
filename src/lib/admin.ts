"use server";

import { currentUser } from "@clerk/nextjs/server";

export async function isCurrentUserAdmin() {
  const user = await currentUser();

  if (!user) return false;

  const email =
    user.primaryEmailAddress?.emailAddress?.toLowerCase() || "";

  const adminEmail =
    process.env.ADMIN_EMAIL?.toLowerCase() || "";

  return email === adminEmail;
}