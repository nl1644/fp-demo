"use client";

import { Tour } from "@/lib/tours";

interface TourCardProps {
  tour: Tour;
  onBook: (tour: Tour) => void;
}

export default function TourCard({ tour, onBook }: TourCardProps) {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white flex flex-col group hover:shadow-lg hover:border-teal-200 transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        <img
          src={tour.image}
          alt={tour.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute bottom-3 left-4 text-xs font-medium text-white bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
          {tour.duration}
        </span>
      </div>
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <h3 className="text-gray-900 font-semibold text-base">{tour.name}</h3>
          <p className="text-gray-400 text-xs mt-0.5">{tour.location}</p>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed flex-1">{tour.description}</p>
        <ul className="space-y-1">
          {tour.highlights.slice(0, 3).map((h) => (
            <li key={h} className="text-xs text-gray-500 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-theme inline-block shrink-0" />
              {h}
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
          <span className="text-gray-900 font-bold text-lg">
            ${tour.price.toLocaleString()}
            <span className="text-gray-400 text-xs font-normal"> / person</span>
          </span>
          <button
            onClick={() => onBook(tour)}
            className="px-4 py-2 bg-theme hover:bg-theme-hover text-white text-sm font-semibold rounded-lg transition-all cursor-pointer shadow-sm"
          >
            Book Tour
          </button>
        </div>
      </div>
    </div>
  );
}
