import React from 'react';

/**
 * ViewSkeletonFallback — Placeholder de carga optimizado y fluido.
 * Cumple con CLS = 0 (Cumulative Layout Shift) y micro-animación pulsante por hardware.
 */
export const ViewSkeletonFallback: React.FC = () => {
  return (
    <div
      role="status"
      aria-label="Cargando contenido..."
      className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-pulse select-none"
    >
      {/* 1. Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-white/[0.04] rounded-md" />
          <div className="h-8 w-64 bg-white/[0.06] rounded-xl" />
        </div>
        <div className="h-10 w-36 bg-white/[0.05] rounded-xl self-start sm:self-auto" />
      </div>

      {/* 2. Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-white/[0.04] rounded" />
              <div className="w-8 h-8 rounded-lg bg-white/[0.04]" />
            </div>
            <div className="h-7 w-28 bg-white/[0.07] rounded-lg" />
            <div className="h-2.5 w-36 bg-white/[0.03] rounded" />
          </div>
        ))}
      </div>

      {/* 3. Main Bento / Content Panel Skeleton */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.04]">
          <div className="h-5 w-48 bg-white/[0.05] rounded-lg" />
          <div className="h-8 w-24 bg-white/[0.04] rounded-lg" />
        </div>
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((row) => (
            <div
              key={row}
              className="h-12 w-full bg-white/[0.015] rounded-xl border border-white/[0.03]"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

