"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react";
import ReactMarkdown from "react-markdown";

const Alternatives = ({ subscriptionName }: { subscriptionName: string }) => {
  const { messages, handleSubmit, isLoading } = useChat({
    api: "/api/alternatives",
    initialInput: subscriptionName,
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingDots />
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <Button onClick={() => handleSubmit()}>Discover Alternatives</Button>
    );
  }

  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown>{messages[1]?.content ?? ""}</ReactMarkdown>
    </div>
  );
};

export default Alternatives;
