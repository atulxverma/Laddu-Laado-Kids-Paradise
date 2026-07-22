"use server";

import { currentUser } from "@clerk/nextjs/server";

export async function isCurrentUserAdmin() {
  const user = await currentUser();

  console.log("USER:", user?.primaryEmailAddress?.emailAddress);
  console.log("ENV:", process.env.ADMIN_EMAIL);

  return (
    user?.primaryEmailAddress?.emailAddress?.toLowerCase() ===
    process.env.ADMIN_EMAIL?.toLowerCase()
  );
}