"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FpEvent } from "@/lib/fpEvents";

export default function EventsPage() {
  const [events, setEvents] = useState<FpEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = () => {
    fetch("/api/events")
      .then((r) => r.json())
      .then(setEvents)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

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

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 px-8 py-4 flex items-center justify-between bg-white sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            ← Home
          </Link>
          <span className="font-bold text-gray-900 text-lg">
            Fingerprint Events
          </span>
        </div>
        <button
          onClick={fetchEvents}
          className="text-sm px-4 py-1.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
        >
          Refresh
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">No events yet.</p>
            <p className="text-sm mt-1">
              Webhook events from Fingerprint will appear here.
            </p>
            <p className="text-xs mt-3 font-mono text-gray-300">
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
                    className="text-gray-700 hover:bg-orange-50/40 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {e.timestamp}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400 ">
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
      </div>
    </main>
  );
}
