"use client";

import { useEffect, useRef, useState } from "react";

export function TaglineReveal({ lines }: { lines: string[] }) {
  const rootRef = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  let wordIndex = 0;

  return (
    <section ref={rootRef} className="bg-mist-deep">
      <div className="mx-auto max-w-6xl px-4 py-8 text-left">
        <p className="heading-3 max-w-[680px] text-left text-ink">
          {lines.map((line) => (
            <span key={line} className="block">
              {line.split(" ").map((word) => {
                const index = wordIndex;
                wordIndex += 1;
                return (
                  <span
                    key={`${line}-${word}-${index}`}
                    className={`mr-[0.3em] inline-block transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      shown ? "text-ink" : "text-muted"
                    }`}
                    style={{ transitionDelay: shown ? `${index * 80}ms` : "0ms" }}
                  >
                    {word}
                  </span>
                );
              })}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
