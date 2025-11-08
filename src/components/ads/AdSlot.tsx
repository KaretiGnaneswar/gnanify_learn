import React from 'react';

interface AdSlotProps {
  id: string;
  sizes?: string;
  className?: string;
}

export default function AdSlot({ id, sizes, className }: AdSlotProps) {
  const primary = (sizes || '').split(',')[0]?.trim();
  const [w, h] = primary?.split('x').map((n) => parseInt(n, 10)) || [];
  const style: React.CSSProperties = {
    minWidth: w ? `${w}px` : undefined,
    minHeight: h ? `${h}px` : undefined,
  };
  return (
    <div
      id={`ad-${id}`}
      data-ad-slot={id}
      data-ad-sizes={sizes}
      className={
        `flex items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-400 dark:text-neutral-500 ${className || ''}`
      }
      style={style}
    >
      <span className="text-xs">Ad</span>
    </div>
  );
}
