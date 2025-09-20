'use client';

import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <div className="app-providers">
      {children}
    </div>
  );
}
