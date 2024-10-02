"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import DiscordIcon from "../../../../components/icons/discord-icon";
import GitHubIcon from "@/components/icons/github-icon";

export default function LoginButton({ provider }: { provider: string }) {
  const [loading, setLoading] = useState(false);

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
        void signIn(provider);
      }}
      className={`${
        loading
          ? "cursor-not-allowed bg-stone-50 dark:bg-stone-800"
          : "bg-white hover:bg-stone-50 active:bg-stone-100 dark:bg-black dark:hover:border-white dark:hover:bg-black"
      } group my-2 flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-stone-200 transition-colors duration-75 focus:outline-none dark:border-stone-700`}
    >
      {loading ? (
        <LoadingDots color="#A8A29E" />
      ) : (
        <>
          {provider === "discord" && <DiscordIcon />}
          {provider === "github" && <GitHubIcon />}
          <span className="text-sm font-medium text-stone-600 dark:text-stone-400">
            Login with {provider}
          </span>
        </>
      )}
    </button>
  );
}
