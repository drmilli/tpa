import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  className?: string;
  style?: React.CSSProperties;
  responsive?: boolean;
}

export default function AdUnit({
  slot,
  format = 'auto',
  className = '',
  style = {},
  responsive = true,
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded yet
    }
  }, []);

  return (
    <div className={`ad-container overflow-hidden text-center ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-4554301395999456"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}

// Pre-configured variants for common placements
export function HorizontalAd({ className = '' }: { className?: string }) {
  return (
    <AdUnit
      slot="3791572680"
      format="horizontal"
      className={className}
      style={{ minHeight: '90px' }}
    />
  );
}

export function SquareAd({ className = '' }: { className?: string }) {
  return (
    <AdUnit
      slot="3791572680"
      format="rectangle"
      className={className}
      style={{ minHeight: '250px' }}
    />
  );
}

export function InFeedAd({ className = '' }: { className?: string }) {
  return (
    <AdUnit
      slot="3791572680"
      format="fluid"
      className={className}
    />
  );
}
