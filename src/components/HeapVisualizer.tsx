"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Props = {
  heap: number[];
  highlighted?: number[];
};

type NodePosition = {
  x: number;
  y: number;
};

export default function HeapVisualizer({ heap, highlighted }: Props) {
  const [positions, setPositions] = useState<NodePosition[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const nodeSize = 60;

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });

      const observer = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      });

      observer.observe(containerRef.current);

      return () => {
        if (containerRef.current) observer.unobserve(containerRef.current);
      };
    }
  }, []);

  useEffect(() => {
    const horizontalGap = 40;
    const levelGap = 100;

    const newPositions: NodePosition[] = [];

    heap.forEach((_, i) => {
      const level = Math.floor(Math.log2(i + 1));
      const maxNodes = 2 ** level;
      const indexInLevel = i - (2 ** level - 1);
      const x = (indexInLevel - (maxNodes - 1) / 2) * (nodeSize + horizontalGap);
      const y = level * levelGap;
      newPositions.push({ x, y });
    });

    setPositions(newPositions);
  }, [heap]);

  return (
    <div ref={containerRef} className="relative flex justify-center min-h-[400px] min-w-[800px]">
      <svg className="absolute w-full h-full pointer-events-none">
        {heap.map((_, i) => {
          const parent = Math.floor((i - 1) / 2);
          if (i === 0 || parent < 0 || !positions[i] || !positions[parent]) return null;
          const x1 = positions[parent].x + dimensions.width / 2;
          const y1 = positions[parent].y + nodeSize / 2;
          const x2 = positions[i].x + dimensions.width / 2;
          const y2 = positions[i].y + nodeSize / 2;
          return <line key={`line-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="2" />;
        })}
      </svg>

      <AnimatePresence>
        {heap.map((val, i) => {
          const pos = positions[i];
          if (!pos) return null;
          return (
            <motion.div
              key={val + "-" + i}
              initial={{ scale: 0 }}
              animate={{ scale: 1, x: pos.x, y: pos.y }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`absolute w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl shadow-md
    ${highlighted?.includes(i) ? "bg-red-400 text-white" : "bg-yellow-400 text-black"}
  `}
            >
              {val}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
