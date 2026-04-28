"use client";

import { useEffect, useState } from "react";
import { Purchase } from "@/lib/purchases";

interface RelatedPurchasesModalProps {
  purchaseId: number;
  onClose: () => void;
}

export default function RelatedPurchasesModal({ purchaseId, onClose }: RelatedPurchasesModalProps) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/purchases/${purchaseId}/related`)
      .then((r) => r.json())
      .then(setPurchases)
      .finally(() => setLoading(false));
  }, [purchaseId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-gray-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-gray-900 font-bold text-lg mb-1">Related Purchases</h2>
        <p className="text-gray-400 text-sm mb-5">Matched by email or device fingerprint</p>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : purchases.length === 0 ? (
          <p className="text-gray-400 text-sm">No related purchases found.</p>
        ) : (
          <div className="space-y-3">
            {purchases.map((p) => (
              <div key={p.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-900 text-sm font-medium">{p.tourName}</span>
                  {p.chargeback === 1 ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">Disputed</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200">Active</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mt-1">
                  <span>{p.email}</span>
                  <span>·</span>
                  <span>{p.quantity} traveller{p.quantity > 1 ? "s" : ""}</span>
                  <span>·</span>
                  <span>${p.price.toLocaleString()}</span>
                  <span>·</span>
                  <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
                {p.visitorId && (
                  <p className="text-xs text-gray-300 mt-1.5 font-mono">vid: {p.visitorId}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
