"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import DiscordIcon from "../../../../components/icons/discord-icon";
import GitHubIcon from "@/components/icons/github-icon";
import { CheckCircle2 } from "lucide-react";

export default function LoginButton({
  provider,
  isConnected,
}: {
  provider: string;
  isConnected?: boolean;
}) {
  const [loading, setLoading] = useState(false);

  // Get error message added by next/auth in URL.
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");
  console.log("isConnected", isConnected);

  useEffect(() => {
    // eslint-disable-next-line
    const errorMessage = Array.isArray(error) ? error.pop() : error;
    // eslint-disable-next-line
    errorMessage && toast.error(errorMessage);
  }, [error]);

  return (
    <button
      disabled={isConnected ?? loading}
      onClick={() => {
        setLoading(true);
        // eslint-disable-next-line
        signIn(provider);
      }}
      className={`${
        isConnected
          ? "bg-stone-200 dark:bg-stone-700"
          : loading
            ? "cursor-wait bg-stone-50 dark:bg-stone-800"
            : "bg-white hover:bg-stone-50 active:bg-stone-100 dark:bg-black dark:hover:border-white dark:hover:bg-black"
      } group my-2 flex h-10 w-full items-center justify-between space-x-2 rounded-md border border-stone-200 transition-colors duration-75 focus:outline-none dark:border-stone-700`}
    >
      {loading ? (
        <LoadingDots color="#A8A29E" />
      ) : (
        <>
          {isConnected && (
            <CheckCircle2 className="ml-2 h-5 w-5 text-green-500" />
          )}
          <div className="flex flex-grow items-center justify-center">
            {provider === "discord" && <DiscordIcon />}
            {provider === "github" && <GitHubIcon />}
            <span className="ml-2 text-sm font-medium text-stone-600 dark:text-stone-400">
              {isConnected ? `${provider}` : `Login with ${provider}`}
            </span>
          </div>
          {isConnected && <div className="mr-2 w-5" />} {/* Spacer */}
        </>
      )}
    </button>
  );
}
