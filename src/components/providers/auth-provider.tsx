"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuth, isLoading } = useAuthStore();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (!hasChecked.current) {
      hasChecked.current = true;
      checkAuth();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

