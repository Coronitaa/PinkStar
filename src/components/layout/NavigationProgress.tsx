'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * NavigationProgress — shows a shimmer progress bar at the top of the page
 * IMMEDIATELY when any internal link is clicked (before Next.js even starts
 * navigating), and disappears as soon as the new page finishes rendering.
 *
 * Works with the dynamic nature of the site: it intercepts ALL <a> clicks
 * via a document-level event, so no hardcoded routes are needed.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(0);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Simulate gradual progress ─────────────────────────────────────────────
  const startProgress = () => {
    setLoading(true);
    setWidth(0);

    // Jump quickly to ~30 %, then slow down as we approach 90 %
    const ticks = [
      { target: 30, delay: 80 },
      { target: 55, delay: 200 },
      { target: 70, delay: 400 },
      { target: 82, delay: 700 },
      { target: 90, delay: 1200 },
    ];

    let i = 0;
    const tick = () => {
      if (i >= ticks.length) return;
      timerRef.current = setTimeout(() => {
        setWidth(ticks[i].target);
        i++;
        tick();
      }, ticks[i].delay);
    };
    tick();
  };

  const finishProgress = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setWidth(100);
    // Give the bar 300 ms to animate to 100 % before hiding
    timerRef.current = setTimeout(() => {
      setLoading(false);
      setWidth(0);
    }, 350);
  };

  // ─── Detect navigation completion ─────────────────────────────────────────
  // pathname / searchParams change only AFTER Next.js finishes rendering the
  // new page, so this is the reliable "done" signal.
  const initialRender = useRef(true);
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    finishProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  // ─── Detect link clicks ────────────────────────────────────────────────────
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Skip: external links, hash-only links, mailto/tel, target=_blank
      if (
        href.startsWith('http') ||
        href.startsWith('//') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        anchor.getAttribute('target') === '_blank' ||
        anchor.getAttribute('download') !== null
      ) {
        return;
      }

      // Skip if it's the same page (no navigation will happen)
      const currentPath = window.location.pathname + window.location.search;
      const targetPath = href.split('#')[0]; // ignore hash
      if (targetPath === currentPath || targetPath === window.location.pathname) {
        return;
      }

      startProgress();
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!loading) return null;

  return (
    <>
      {/* ── Thin top progress bar ── */}
      <div
        aria-hidden
        className="fixed top-0 left-0 z-[9999] h-[3px] pointer-events-none"
        style={{
          width: `${width}%`,
          transition: width === 0 ? 'none' : 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
          background:
            'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))',
          boxShadow: '0 0 10px hsl(var(--primary) / 0.8), 0 0 20px hsl(var(--accent) / 0.4)',
        }}
      />

      {/* ── Subtle full-page dim overlay so the old content clearly "steps back" ── */}
      <div
        aria-hidden
        className="fixed inset-0 z-[9998] pointer-events-none bg-background/40 backdrop-blur-[1px]"
        style={{
          opacity: width > 10 ? 1 : 0,
          transition: 'opacity 0.15s ease',
        }}
      />
    </>
  );
}
