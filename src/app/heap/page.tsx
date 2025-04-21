"use client";

import HeapVisualizer from "@/components/HeapVisualizer";
import { useEffect, useState } from "react";

type Step =
  | { type: "compare"; a: number; b: number }
  | { type: "swap"; a: number; b: number }
  | { type: "delete"; a: number }
  | { type: "insert"; a: number };

const generateRandomHeap = (size: number = 7): number[] => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
};

export default function HeapPage() {
  const [heap, setHeap] = useState<number[]>([]);
  const [highlighted, setHighlighted] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHeapified, setIsHeapified] = useState(false);

  useEffect(() => {
    const savedHeap = localStorage.getItem("heap");
    const savedHeapified = localStorage.getItem("isHeapified");

    if (savedHeap) {
      setHeap(JSON.parse(savedHeap));
      setIsHeapified(savedHeapified === "true");
    } else {
      const newHeap = generateRandomHeap();
      setHeap(newHeap);
    }
  }, []);

  useEffect(() => {
    if (heap.length > 0) {
      localStorage.setItem("heap", JSON.stringify(heap));
      localStorage.setItem("isHeapified", JSON.stringify(isHeapified));
    }
  }, [heap, isHeapified]);

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const runSteps = async (steps: Step[]) => {
    const currentHeap = [...heap];
    console.log("Heap before steps:", currentHeap);
    setIsAnimating(true);

    for (const step of steps) {
      if (step.type === "compare") {
        setHighlighted([step.a, step.b]);
        await delay(600);
      } else if (step.type === "swap") {
        [currentHeap[step.a], currentHeap[step.b]] = [currentHeap[step.b], currentHeap[step.a]];
        setHeap([...currentHeap]);
        await delay(800);
      } else if (step.type === "delete") {
        currentHeap[step.a] = currentHeap[currentHeap.length - 1];
        currentHeap.pop();
        setHeap([...currentHeap]);
        await delay(800);
      } else if (step.type === "insert") {
        currentHeap.push(step.a);
        setHeap([...currentHeap]);
        await delay(800);
      }
    }
    setHighlighted([]);

    setIsAnimating(false);
  };

  const insert = async (val: number) => {
    const newHeap = [...heap, val];
    const steps: Step[] = [];
    let idx = newHeap.length - 1;

    steps.push({ type: "insert", a: val });

    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      steps.push({ type: "compare", a: parentIdx, b: idx });
      if (newHeap[parentIdx] <= newHeap[idx]) break;
      steps.push({ type: "swap", a: parentIdx, b: idx });
      [newHeap[parentIdx], newHeap[idx]] = [newHeap[idx], newHeap[parentIdx]];
      idx = parentIdx;
    }

    await delay(100);
    runSteps(steps);
  };

  const deleteMin = async () => {
    if (heap.length === 0) return;

    const newHeap = [...heap];
    const steps: Step[] = [];
    const minIdx = 0;
    steps.push({ type: "compare", a: minIdx, b: newHeap.length - 1 });
    steps.push({ type: "swap", a: minIdx, b: newHeap.length - 1 });
    steps.push({ type: "delete", a: newHeap.length - 1 });

    newHeap[minIdx] = newHeap[newHeap.length - 1];
    newHeap.pop();

    let idx = minIdx;
    const n = newHeap.length;

    while (idx < n) {
      const leftChildIdx = idx * 2 + 1;
      const rightChildIdx = idx * 2 + 2;
      let smallestIdx = idx;

      if (leftChildIdx < n) {
        steps.push({ type: "compare", a: smallestIdx, b: leftChildIdx });
        if (newHeap[leftChildIdx] < newHeap[smallestIdx]) {
          smallestIdx = leftChildIdx;
        }
      }

      if (rightChildIdx < n) {
        steps.push({ type: "compare", a: smallestIdx, b: rightChildIdx });
        if (newHeap[rightChildIdx] < newHeap[smallestIdx]) {
          smallestIdx = rightChildIdx;
        }
      }

      if (smallestIdx === idx) break;

      steps.push({ type: "swap", a: idx, b: smallestIdx });
      [newHeap[idx], newHeap[smallestIdx]] = [newHeap[smallestIdx], newHeap[idx]];
      idx = smallestIdx;
    }

    await delay(100);
    runSteps(steps);
  };

  const heapify = async () => {
    const newHeap = [...heap];
    const steps: Step[] = [];
    const n = newHeap.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      let idx = i;
      while (idx < n) {
        const leftChildIdx = idx * 2 + 1;
        const rightChildIdx = idx * 2 + 2;
        let smallestIdx = idx;

        if (leftChildIdx < n) {
          steps.push({ type: "compare", a: smallestIdx, b: leftChildIdx });
          if (newHeap[leftChildIdx] < newHeap[smallestIdx]) {
            smallestIdx = leftChildIdx;
          }
        }

        if (rightChildIdx < n) {
          steps.push({ type: "compare", a: smallestIdx, b: rightChildIdx });
          if (newHeap[rightChildIdx] < newHeap[smallestIdx]) {
            smallestIdx = rightChildIdx;
          }
        }

        if (smallestIdx === idx) break;

        steps.push({ type: "swap", a: idx, b: smallestIdx });
        [newHeap[idx], newHeap[smallestIdx]] = [newHeap[smallestIdx], newHeap[idx]];
        idx = smallestIdx;
      }
    }

    await delay(100);
    runSteps(steps);
    setIsHeapified(true);
  };

  const reset = () => {
    localStorage.removeItem("heap");
    localStorage.removeItem("isHeapified");
    const newHeap = generateRandomHeap();
    setHeap(newHeap);
    setHighlighted([]);
    setIsHeapified(false);
  };

  return (
    <main className="p-6">
      <section className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-20">🌱 Heap Visualizer</h1>
      </section>

      <HeapVisualizer heap={heap} highlighted={highlighted} />

      <div className="mt-10 flex justify-center gap-4">
        <button
          onClick={() => {
            const val = prompt("Insert value:");
            const n = Number(val);
            if (val === null || val.trim() === "" || isNaN(n)) {
              alert("Please enter a valid number.");
              return;
            }
            if (n > 100 || n < 1) {
              alert("Please enter a number between 1 and 100.");
              return;
            }
            insert(n);
          }}
          disabled={isAnimating || !isHeapified || heap.length >= 15}
          className="bg-green-500 hover:bg-green-600 py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Insert
        </button>
        <button
          onClick={deleteMin}
          disabled={isAnimating || !isHeapified || heap.length === 0}
          className="bg-red-500 hover:bg-red-600 py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Delete Min
        </button>
        <button
          onClick={heapify}
          disabled={isAnimating || isHeapified}
          className="bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Heapify
        </button>
        <button
          onClick={reset}
          disabled={isAnimating}
          className="bg-gray-500 hover:bg-gray-600 py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset
        </button>
      </div>
    </main>
  );
}
