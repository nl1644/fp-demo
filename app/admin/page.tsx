"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Purchase } from "@/lib/purchases";
import { FpEvent } from "@/lib/fpEvents";
import RelatedPurchasesModal from "@/components/RelatedPurchasesModal";

interface Account {
  email: string;
}

interface LoginAttempt {
  id: number;
  visitorId: string;
  email: string;
  success: number;
  createdAt: number;
}

type PurchaseFilter = "all" | "chargebacks";

export default function AdminPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [events, setEvents] = useState<FpEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<PurchaseFilter>("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/accounts/all").then((r) => r.json()),
      fetch("/api/login-attempts/all").then((r) => r.json()),
      fetch("/api/purchases/all").then((r) => r.json()),
      fetch("/api/events").then((r) => r.json()),
    ]).then(([accts, attempts, purch, evts]) => {
      setAccounts(accts);
      setLoginAttempts(attempts);
      setPurchases(purch);
      setEvents(evts);
      setLoading(false);
    });
  }, []);

  const filteredPurchases =
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

  const bool = (val: number | null) =>
    val == null ? (
      <span className="text-gray-300 text-xs">—</span>
    ) : val ? (
      <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
        Yes
      </span>
    ) : (
      <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200">
        No
      </span>
    );

  const sections = [
    { id: "accounts", label: "Accounts" },
    { id: "login-attempts", label: "Login Attempts" },
    { id: "purchases", label: "Purchases" },
    { id: "identification-events", label: "Identification Events" },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 px-8 py-4 flex items-center justify-between bg-white sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-6">
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
          <nav className="flex items-center gap-1">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-sm px-3 py-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>
        <button
          onClick={exportCsv}
          className="text-sm px-4 py-1.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
        >
          Export CSV
        </button>
      </div>

      {loading ? (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-gray-400">Loading...</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-12">
          {/* Accounts */}
          <section id="accounts">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Accounts{" "}
              <span className="text-gray-400 font-normal text-sm">
                ({accounts.length})
              </span>
            </h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    {["#", "Email"].map((h) => (
                      <th key={h} className="px-4 py-3 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {accounts.map((a, i) => (
                    <tr
                      key={a.email}
                      className="text-gray-700 hover:bg-teal-50/40 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                        {i + 1}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{a.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Login Attempts */}
          <section id="login-attempts">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Login Attempts{" "}
              <span className="text-gray-400 font-normal text-sm">
                ({loginAttempts.length})
              </span>
            </h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    {["ID", "Email", "Visitor ID", "Date", "Result"].map(
                      (h) => (
                        <th key={h} className="px-4 py-3 font-medium">
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loginAttempts.map((a) => (
                    <tr
                      key={a.id}
                      className="text-gray-700 hover:bg-teal-50/40 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                        #{a.id}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{a.email}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">
                        {a.visitorId}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {a.success === 1 ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200">
                            Success
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                            Failed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {loginAttempts.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-6 text-center text-gray-400 text-xs"
                      >
                        No login attempts yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Purchases */}
          <section id="purchases">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">
                Purchases{" "}
                <span className="text-gray-400 font-normal text-sm">
                  ({purchases.length})
                </span>
              </h2>
              <div className="flex items-center gap-3">
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
            </div>
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
                  {filteredPurchases.map((p) => (
                    <tr
                      key={p.id}
                      className="text-gray-700 hover:bg-teal-50/40 transition-colors"
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
          </section>

          {/* Identification Events */}
          <section id="identification-events">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Identification Events{" "}
              <span className="text-gray-400 font-normal text-sm">
                ({events.length})
              </span>
            </h2>
            {events.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm text-center py-16 text-gray-400">
                <p className="text-sm">No events yet.</p>
                <p className="text-xs mt-1 font-mono text-gray-300">
                  POST /api/webhook
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-gray-500 border-b border-gray-200">
                      {[
                        "Timestamp",
                        "Event ID",
                        "Visitor ID",
                        "Confidence",
                        "IP Address",
                        "Suspect Score",
                        "VPN",
                        "Dev Tools",
                        "Incognito",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 font-medium whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {events.map((e) => (
                      <tr
                        key={e.id}
                        className="text-gray-700 hover:bg-teal-50/40 transition-colors"
                      >
                        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                          {e.timestamp}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-400">
                          {e.event_id ?? "—"}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">
                          {e.visitor_id ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {e.confidence_score != null
                            ? e.confidence_score.toFixed(2)
                            : "—"}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">
                          {e.ip_address ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {e.suspect_score ?? "—"}
                        </td>
                        <td className="px-4 py-3">{bool(e.vpn)}</td>
                        <td className="px-4 py-3">{bool(e.developer_tool)}</td>
                        <td className="px-4 py-3">{bool(e.incognito)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}

      {selectedId !== null && (
        <RelatedPurchasesModal
          purchaseId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </main>
  );
}
