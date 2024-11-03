import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { CURRENCY_SYMBOL } from "@/lib/constants";

interface ProPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

export default function ProPlanModal({
  isOpen,
  onClose,
  onSubscribe,
}: ProPlanModalProps) {
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    // Simulating an API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubscribing(false);
    onSubscribe();
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md rounded-lg bg-white p-6 text-black shadow-xl"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
            <h2 className="mb-4 text-center text-2xl font-bold">
              Upgrade to Pro
            </h2>
            <p className="mb-6 text-center text-lg">
              Get access to all these amazing features for just{" "}
              {CURRENCY_SYMBOL}9.99/month
            </p>
            <ul className="mb-6 space-y-2">
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-green-500" />
                <span>Bank account import</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-green-500" />
                <span>Advanced price change alerts</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-green-500" />
                <span>Personalized savings recommendations</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-green-500" />
                <span>Subscription Alternative Discovery</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-green-500" />
                <span>Priority customer support</span>
              </li>
            </ul>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleSubscribe}
              disabled={isSubscribing}
            >
              {isSubscribing ? "Processing..." : "Subscribe Now"}
            </Button>
            <p className="mt-4 text-center text-sm text-gray-500">
              Start your 14-day free trial today. Cancel anytime.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
