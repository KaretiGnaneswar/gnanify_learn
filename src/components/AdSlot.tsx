import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

type AdSlotProps = {
  slot: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function AdSlot({ slot, className, style }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      // Trigger AdSense to render this ad unit
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // no-op
    }
  }, []);

  return (
    <ins
      ref={adRef as any}
      className={`adsbygoogle ${className ?? ''}`}
      style={style ?? { display: 'block' }}
      data-ad-client="ca-pub-7372845869422591"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
