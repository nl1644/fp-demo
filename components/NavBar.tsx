"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface NavBarProps {
  email: string;
}

export default function NavBar({ email }: NavBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const linkClass = (href: string) =>
    `text-sm transition-colors ${
      pathname === href ? "text-gray-900 font-semibold" : "text-gray-500 hover:text-gray-900"
    }`;

  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white/90 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-8">
        <span className="text-gray-900 font-bold text-lg tracking-tight">🌴 SEA Tours</span>
        <div className="flex gap-6">
          <Link href="/home" className={linkClass("/home")}>Explore</Link>
          <Link href="/history" className={linkClass("/history")}>My Orders</Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400 hidden sm:block">{email}</span>
        <button
          onClick={handleLogout}
          className="px-4 py-1.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
        >
          Log out
        </button>
      </div>
    </nav>
  );
}
