"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-gray-800 shadow-md">
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between text-white">
        <Link href="/" className="text-2xl font-bold text-blue-400">
          Data Structure Visualizer
        </Link>
        <div className="space-x-6 text-sm">
          <Link href="/heap" className="hover:text-indigo-300">
            Heap
          </Link>
        </div>
      </nav>
    </header>
  );
}
