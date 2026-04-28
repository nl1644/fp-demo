"use client";

import { Purchase } from "@/lib/purchases";

interface OrderCardProps {
  purchase: Purchase;
  onDispute: (id: number) => void;
}

export default function OrderCard({ purchase, onDispute }: OrderCardProps) {
  const date = new Date(purchase.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between gap-4 shadow-sm">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="text-gray-900 font-semibold text-sm truncate">{purchase.tourName}</h3>
          {purchase.chargeback === 1 && (
            <span className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
              Disputed
            </span>
          )}
        </div>
        <p className="text-gray-400 text-xs">
          {date} · {purchase.quantity} traveller{purchase.quantity > 1 ? "s" : ""}
        </p>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <span className="text-gray-900 font-bold">${purchase.price.toLocaleString()}</span>
        {purchase.chargeback === 0 && (
          <button
            onClick={() => onDispute(purchase.id)}
            className="text-xs px-3 py-1.5 border border-gray-200 text-gray-500 rounded-lg hover:border-red-300 hover:text-red-500 transition-all cursor-pointer"
          >
            Dispute
          </button>
        )}
      </div>
    </div>
  );
}
