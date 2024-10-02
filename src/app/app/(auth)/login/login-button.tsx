"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import DiscordIcon from "../../../../components/icons/discord-icon";
import GitHubIcon from "@/components/icons/github-icon";
import { CheckCircle2, X } from "lucide-react";
import { removeProvider } from "@/app/actions/remove-provider";

export default function LoginButton({
  provider,
  isConnected,
  userId,
  totalConnectedProviders,
}: {
  provider: string;
  isConnected?: boolean;
  userId: string;
  totalConnectedProviders: number;
}) {
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const error = searchParams?.get("error");

  useEffect(() => {
    // eslint-disable-next-line
    const errorMessage = Array.isArray(error) ? error.pop() : error;
    // eslint-disable-next-line
    errorMessage && toast.error(errorMessage);
  }, [error]);

  const handleDelete = async () => {
    if (totalConnectedProviders <= 1) {
      toast.error("Cannot remove the only connected provider");
      return;
    }

    setLoading(true);
    try {
      const result = await removeProvider(provider, userId);
      if (result.error) {
        throw new Error(result.error);
      }
      toast.success(`${provider} account disconnected`);
    } catch (error) {
      console.error("Error disconnecting account:", error);
      toast.error(`Error disconnecting ${provider} account`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        disabled={loading || (isConnected && totalConnectedProviders <= 1)}
        onClick={() => {
          if (isConnected) {
            void handleDelete();
          } else {
            setLoading(true);
            void signIn(provider);
          }
        }}
        className={`${
          isConnected
            ? "bg-stone-100 dark:bg-stone-800"
            : loading
              ? "cursor-wait bg-stone-50 dark:bg-stone-800"
              : "bg-white hover:bg-stone-50 active:bg-stone-100 dark:bg-black dark:hover:border-white dark:hover:bg-black"
        } group my-2 flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-stone-200 transition-colors duration-75 focus:outline-none dark:border-stone-700`}
      >
        {loading ? (
          <LoadingDots color="#A8A29E" />
        ) : (
          <>
            {isConnected ? (
              <CheckCircle2 className="absolute left-2 h-5 w-5 text-green-500" />
            ) : (
              <div className="absolute left-2 w-5" />
            )}
            <div className="flex items-center justify-center">
              {provider === "discord" && <DiscordIcon />}
              {provider === "github" && <GitHubIcon />}
              <span className="ml-2 text-sm font-medium text-stone-600 dark:text-stone-400">
                {isConnected ? `${provider}` : `Login with ${provider}`}
              </span>
            </div>
          </>
        )}
      </button>
      {isConnected && totalConnectedProviders > 1 && (
        <button
          onClick={handleDelete}
          disabled={loading}
          className="absolute right-[-24px] top-1/2 h-5 w-5 -translate-y-1/2 transform text-red-500 hover:text-red-600 focus:outline-none"
          aria-label={`Disconnect ${provider} account`}
        >
          <X />
        </button>
      )}
    </div>
  );
}
