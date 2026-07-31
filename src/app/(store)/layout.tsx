import { currentUser } from "@clerk/nextjs/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  const isAdmin =
    user?.primaryEmailAddress?.emailAddress?.toLowerCase() ===
    process.env.ADMIN_EMAIL?.toLowerCase();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar isAdmin={isAdmin} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}