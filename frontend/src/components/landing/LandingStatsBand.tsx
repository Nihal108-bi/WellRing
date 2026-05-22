"use client";

import { useEffect, useRef, useState } from "react";

const statsConfig = [
  { target: 2000, format: (n: number) => `${n.toLocaleString()}+`, label: "Families protected" },
  { target: 98,   format: (n: number) => `${n}%`,                  label: "Call completion rate" },
  { target: 23,   format: (n: number) => `${n} days`,              label: "Avg streak" },
  { target: 49,   format: (n: number) => `${(n / 10).toFixed(1)}★`, label: "App rating" },
];

function CountUp({ target, format, started }: { target: number; format: (n: number) => string; started: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    const duration = 1400;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [started, target]);

  return <>{format(count)}</>;
}

export default function LandingStatsBand() {
  const ref = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-14 px-5 bg-zinc-900 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {statsConfig.map(({ target, format, label }) => (
          <div key={label}>
            <p className="text-3xl font-semibold text-[#2d9574] mb-1" style={{ fontFamily: "var(--font-dm-serif)" }}>
              <CountUp target={target} format={format} started={started} />
            </p>
            <p className="text-sm text-zinc-400">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
