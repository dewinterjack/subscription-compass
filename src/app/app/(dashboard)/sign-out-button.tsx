"use client";

import { signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);
  // Get error message added by next/auth in URL.
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");

  useEffect(() => {
    // eslint-disable-next-line
    const errorMessage = Array.isArray(error) ? error.pop() : error;
    // eslint-disable-next-line
    errorMessage && toast.error(errorMessage);
  }, [error]);

  return (
    <button
      disabled={loading}
      onClick={() => {
        setLoading(true);
        // eslint-disable-next-line
        signOut();
      }}
    >
      <span className="text-sm font-medium text-stone-600 dark:text-stone-400">
        Sign out
      </span>
    </button>
  );
}
