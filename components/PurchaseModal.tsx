"use client";

import { useState, useEffect } from "react";
import * as Fingerprint from "@fingerprint/agent";
import { env } from "@/lib/env";
import { Tour } from "@/lib/tours";

interface PurchaseModalProps {
  tour: Tour;
  email: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PurchaseModal({ tour, email, onClose, onSuccess }: PurchaseModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fpAgent, setFpAgent] = useState<ReturnType<typeof Fingerprint.start> | null>(null);

  useEffect(() => {
    setFpAgent(Fingerprint.start({ apiKey: env.fpPublicKey }));
  }, []);

  const total = tour.price * quantity;

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      let eventId = "";
      if (fpAgent) {
        try {
          const result = await fpAgent.get();
          eventId = result.event_id || "";
        } catch (e) {
          console.warn("Fingerprint failed:", e);
        }
      }

      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tourId: tour.id, quantity, eventId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Purchase failed");
      onSuccess();
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-gray-200 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <h2 className="text-gray-900 font-bold text-xl">{tour.name}</h2>
          <p className="text-gray-400 text-sm mt-1">{tour.location} · {tour.duration}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Travellers</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-all cursor-pointer font-bold"
              >
                −
              </button>
              <span className="text-gray-900 font-semibold w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="w-9 h-9 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-all cursor-pointer font-bold"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Booking email</label>
            <div className="px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 text-sm">
              {email}
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm px-3 py-2 bg-red-50 rounded-lg border border-red-200">
              {error}
            </p>
          )}

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs">Total</p>
              <p className="text-gray-900 font-bold text-2xl">${total.toLocaleString()}</p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 bg-theme hover:bg-theme-hover text-white font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
