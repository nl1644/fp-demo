import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { tours } from "@/lib/tours";
import NavBar from "@/components/NavBar";
import TourGrid from "@/components/TourGrid";

export default async function HomePage() {
  const session = await getSession();
  if (!session) redirect("/");

  return (
    <main className="min-h-screen bg-amber-50">
      <NavBar email={session.email} />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Explore Southeast Asia</h1>
          <p className="text-gray-500 mt-2">
            Welcome back, <span className="text-theme font-medium">{session.email}</span>. Where are you headed next?
          </p>
        </div>
        <TourGrid tours={tours} email={session.email} />
      </div>
    </main>
  );
}
