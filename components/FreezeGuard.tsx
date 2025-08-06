import React, { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export const FreezeGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.frozen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [user?.frozen]);

  if (user?.frozen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 text-white">
        <div className="max-w-md text-center px-6">
          <h1 className="text-2xl font-bold mb-4">Account Frozen</h1>
          <p className="text-slate-300">
            Your account has been temporarily frozen. Please contact support or wait until it’s reactivated.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
