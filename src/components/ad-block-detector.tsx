"use client";

import { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';

export function AdBlockDetector({ children }: { children: React.ReactNode }) {
  const [isAdBlockerDetected, setIsAdBlockerDetected] = useState(false);

  useEffect(() => {
    // This is the bait file. Ad blockers will prevent this from being fetched.
    const baitFile = new Request('/ads.js', {
      method: 'HEAD',
      mode: 'no-cors',
    });

    // We assume an ad blocker is present initially.
    // If the fetch succeeds, we know there isn't one.
    // If it fails, the error is caught, and we know an ad blocker is active.
    fetch(baitFile)
        .then(response => {
            // If the request succeeds, it means no ad blocker is active.
            setIsAdBlockerDetected(false);
        })
        .catch(error => {
            // This error indicates that the request was blocked
            console.warn('Ad blocker detected.');
            setIsAdBlockerDetected(true);
        });
  }, []);


  if (isAdBlockerDetected) {
    return (
      <div className="fixed inset-0 z-50 flex h-full w-full flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
        <div className="flex max-w-md flex-col items-center text-center p-6">
            <ShieldAlert className="h-20 w-20 text-destructive mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">Ad Blocker Detectado</h1>
            <p className="text-muted-foreground mb-8">
                Nosso site depende da exibição de anúncios para se manter gratuito. Por favor, desative seu bloqueador de anúncios (AdBlock) e recarregue a página para continuar.
            </p>
            <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold shadow-md hover:bg-primary/90 transition-colors"
            >
                Recarregar Página
            </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
