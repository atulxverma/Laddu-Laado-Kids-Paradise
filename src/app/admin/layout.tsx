import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import AdminSidebar from "./AdminSidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()

  if (user?.primaryEmailAddress?.emailAddress !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-x-hidden bg-neutral-50">{children}</main>
    </div>
  )
}