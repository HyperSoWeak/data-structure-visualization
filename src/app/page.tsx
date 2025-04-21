"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaCodeBranch } from "react-icons/fa";

const dataStructures = [{ name: "Heap", icon: <FaCodeBranch />, href: "/heap" }];

export default function HomePage() {
  return (
    <main className="px-8 py-16">
      <div className="text-center mb-20">
        <h1 className="text-5xl font-bold mb-4">Data Structure Visualizer</h1>
      </div>

      <section className="grid gap-6 max-w-6xl mx-auto justify-center">
        {dataStructures.map((ds, i) => (
          <Link key={ds.name} href={ds.href}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl cursor-pointer transition"
            >
              <div className="text-4xl mb-4 text-blue-400">{ds.icon}</div>
              <h2 className="text-2xl font-semibold">{ds.name}</h2>
            </motion.div>
          </Link>
        ))}
      </section>
    </main>
  );
}
