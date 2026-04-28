"use client";

import { useState } from "react";
import { Tour } from "@/lib/tours";
import TourCard from "./TourCard";
import PurchaseModal from "./PurchaseModal";

interface TourGridProps {
  tours: Tour[];
  email: string;
}

export default function TourGrid({ tours, email }: TourGridProps) {
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleSuccess = () => {
    setSelectedTour(null);
    setToast("Booking confirmed! Check My Orders for details.");
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <>
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-green-900/80 border border-green-600/40 text-green-300 text-sm px-5 py-3 rounded-xl backdrop-blur-sm shadow-lg whitespace-nowrap">
          {toast}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} onBook={setSelectedTour} />
        ))}
      </div>
      {selectedTour && (
        <PurchaseModal
          tour={selectedTour}
          email={email}
          onClose={() => setSelectedTour(null)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
