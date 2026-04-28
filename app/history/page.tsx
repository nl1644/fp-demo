import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getPurchasesByEmail } from "@/lib/purchases";
import NavBar from "@/components/NavBar";
import OrderList from "@/components/OrderList";

export default async function HistoryPage() {
  const session = await getSession();
  if (!session) redirect("/");

  const purchases = getPurchasesByEmail(session.email);

  return (
    <main className="min-h-screen bg-amber-50">
      <NavBar email={session.email} />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">My Orders</h1>
        <p className="text-gray-400 text-sm mb-8">Your booking history</p>
        <OrderList initialPurchases={purchases} />
      </div>
    </main>
  );
}
