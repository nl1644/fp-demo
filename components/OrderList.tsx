"use client";

import { useState } from "react";
import { Purchase } from "@/lib/purchases";
import OrderCard from "./OrderCard";

interface OrderListProps {
  initialPurchases: Purchase[];
}

export default function OrderList({ initialPurchases }: OrderListProps) {
  const [purchases, setPurchases] = useState(initialPurchases);

  const handleDispute = async (id: number) => {
    const res = await fetch(`/api/purchases/${id}/chargeback`, { method: "POST" });
    const data = await res.json();
    if (data.success) {
      setPurchases((prev) => prev.map((p) => (p.id === id ? { ...p, chargeback: 1 } : p)));
    }
  };

  if (purchases.length === 0) {
    return (
      <div className="text-center py-20 text-gray-600">
        <p className="text-lg">No orders yet.</p>
        <p className="text-sm mt-1">Book a tour to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {purchases.map((p) => (
        <OrderCard key={p.id} purchase={p} onDispute={handleDispute} />
      ))}
    </div>
  );
}
