"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Purchase } from "@/lib/purchases";
import RelatedPurchasesModal from "@/components/RelatedPurchasesModal";

type Filter = "all" | "chargebacks";

export default function AdminPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/purchases/all")
      .then((r) => r.json())
      .then(setPurchases)
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "chargebacks"
      ? purchases.filter((p) => p.chargeback === 1)
      : purchases;
  const chargebackCount = purchases.filter((p) => p.chargeback === 1).length;

  const exportCsv = () => {
    const header = "id,tourName,email,quantity,price,visitorId,chargeback,date";
    const rows = purchases.map((p) =>
      [
        p.id,
        `"${p.tourName}"`,
        p.email,
        p.quantity,
        p.price,
        p.visitorId ?? "",
        p.chargeback,
        new Date(p.createdAt).toISOString(),
      ].join(","),
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "purchases.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 px-8 py-4 flex items-center justify-between bg-white sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/home"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            ← Home
          </Link>
          <span className="font-bold text-gray-900 text-lg">
            Admin Dashboard
          </span>
        </div>
        <button
          onClick={exportCsv}
          className="text-sm px-4 py-1.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
        >
          Export CSV
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              filter === "all"
                ? "bg-theme text-white shadow-sm"
                : "border border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            All ({purchases.length})
          </button>
          <button
            onClick={() => setFilter("chargebacks")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              filter === "chargebacks"
                ? "bg-red-500 text-white shadow-sm"
                : "border border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Chargebacks ({chargebackCount})
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  {[
                    "ID",
                    "Tour",
                    "Email",
                    "Qty",
                    "Total",
                    "Visitor ID",
                    "Date",
                    "Status",
                    "",
                  ].map((h) => (
                    <th key={h} className="px-4 py-3 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="text-gray-700 hover:bg-orange-50/40 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                      #{p.id}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-[160px] truncate">
                      {p.tourName}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.email}</td>
                    <td className="px-4 py-3 text-gray-600">{p.quantity}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      ${p.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">
                      {p.visitorId ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {p.chargeback === 1 ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                          Disputed
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedId(p.id)}
                        className="text-xs text-theme hover:underline cursor-pointer font-medium"
                      >
                        Related
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedId !== null && (
        <RelatedPurchasesModal
          purchaseId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </main>
  );
}
