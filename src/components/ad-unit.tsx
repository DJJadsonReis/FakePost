"use client";

import { useEffect } from 'react';

declare global {
    interface Window {
        adsbygoogle: any;
    }
}

interface AdUnitProps {
  adClient: string;
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  className?: string;
}

export function AdUnit({
  adClient,
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  className = ""
}: AdUnitProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={String(fullWidthResponsive)}
      ></ins>
    </div>
  );
}
