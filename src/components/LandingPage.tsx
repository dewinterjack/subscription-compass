"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronDown,
  ChevronUp,
  Bell,
  PiggyBank,
  Search,
  RefreshCw,
  Settings,
  Check,
  Send,
} from "lucide-react";
import type { Session } from "next-auth";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { CURRENCY_SYMBOL } from "@/lib/constants";
import { usePostHog } from "posthog-js/react";

export default function LandingPage({ session }: { session: Session | null }) {
  const posthog = usePostHog();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const sectionRefs = [
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
  ];

  const cardVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 0px 8px rgb(255,255,255)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        const currentIndex = sectionRefs.findIndex(
          (ref) => ref.current?.getBoundingClientRect().top === 0,
        );
        const nextIndex =
          event.key === "ArrowDown"
            ? Math.min(currentIndex + 1, sectionRefs.length - 1)
            : Math.max(currentIndex - 1, 0);
        sectionRefs[nextIndex]?.current?.scrollIntoView({ behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <ScrollArea className="h-screen" ref={scrollAreaRef}>
      <main className="flex flex-col">
        <section
          ref={sectionRefs[0]}
          className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white"
        >
          <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
            <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl md:text-[5rem]">
              Simplify Your{" "}
              <span className="text-[hsl(280,100%,70%)]">Subs</span>
              criptions
            </h1>
            <p className="mx-auto -mt-4 mb-8 max-w-[700px] text-center text-xl">
              Never miss a price change or discount. SubsCompass helps you
              manage all your subscriptions in one place, with a free base tier
              for everyone.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
              <button
                className="flex max-w-xs flex-col items-center justify-center gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
                onClick={() =>
                  sectionRefs[1]?.current?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
              >
                <h3 className="text-2xl font-bold">Features</h3>
                <div className="text-center text-lg">
                  Discover the key features that make our subscription tracking
                  service stand out.
                </div>
              </button>
              <button
                className="flex max-w-xs flex-col items-center justify-center gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
                onClick={() =>
                  sectionRefs[2]?.current?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
              >
                <h3 className="text-2xl font-bold">Pricing</h3>
                <div className="text-center text-lg">
                  Explore our pricing plans and choose the one that fits your
                  needs.
                </div>
              </button>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-center text-2xl text-white">
                  {session && <span>Logged in as {session.user?.name}</span>}
                </p>
                <button
                  className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
                  onClick={() => {
                    if (session) {
                      posthog?.identify(session.user?.id, {
                        email: session.user?.email,
                      });
                    }
                    window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}/login`;
                  }}
                >
                  {session ? "Go to App" : "Get Started"}
                </button>
              </div>
            </div>
          </div>
          <div className="absolute bottom-4">
            <Button
              variant="ghost"
              size="icon"
              className="animate-bounce"
              onClick={() =>
                sectionRefs[1]?.current?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <ChevronDown className="h-6 w-6" />
            </Button>
          </div>
        </section>

        <section
          ref={sectionRefs[1]}
          className="relative flex min-h-screen flex-col justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] p-8 text-white"
        >
          <div className="absolute left-1/2 top-4 -translate-x-1/2 transform">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <ChevronUp className="h-6 w-6" />
            </Button>
          </div>

          <div className="container mx-auto py-20">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">
              Key Features
            </h2>
            <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4">
                <Bell className="h-10 w-10" />
                <h3 className="text-xl font-bold">Price Change Alerts</h3>
                <p className="text-center text-gray-200">
                  Get notified instantly when your subscriptions change in
                  price.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <PiggyBank className="h-10 w-10" />
                <h3 className="text-xl font-bold">Savings Tracker</h3>
                <p className="text-center text-gray-200">
                  See how much you&apos;re saving with our intuitive savings
                  tracker.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <Search className="h-10 w-10" />
                <h3 className="text-xl font-bold">Subscription Discovery</h3>
                <p className="text-center text-gray-200">
                  Discover new subscriptions that align with your interests and
                  budget.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <RefreshCw className="h-10 w-10" />
                <h3 className="text-xl font-bold">
                  Subscription Alternative Discovery
                </h3>
                <p className="text-gray-200">
                  Find adequate replacements for your current subscriptions to
                  secure better prices and optimize your spending.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <Settings className="h-10 w-10" />
                <h3 className="text-xl font-bold">Configurable Alerts</h3>
                <p className="text-center text-gray-200">
                  Configure alerts for when your subscriptions are renewing to
                  stay informed and avoid unexpected charges.
                </p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform">
            <Button
              variant="ghost"
              size="icon"
              className="animate-bounce"
              onClick={() =>
                sectionRefs[2]?.current?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <ChevronDown className="h-6 w-6" />
            </Button>
          </div>
        </section>

        <section
          ref={sectionRefs[2]}
          className="relative flex min-h-screen flex-col justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] p-8 text-white"
        >
          <div className="absolute left-1/2 top-4 -translate-x-1/2 transform">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                sectionRefs[1]?.current?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <ChevronUp className="h-6 w-6" />
            </Button>
          </div>

          <div className="container mx-auto px-4 py-20 md:px-6">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Simple, Transparent Pricing
            </h2>
            <div className="mx-auto grid max-w-4xl gap-10 sm:grid-cols-2">
              <motion.div
                className="flex flex-col rounded-lg bg-white p-6 text-black shadow-lg"
                variants={cardVariants}
                whileHover="hover"
              >
                <h3 className="mb-4 text-center text-2xl font-bold">
                  Free Tier
                </h3>
                <p className="mb-4 text-center text-4xl font-bold">
                  {CURRENCY_SYMBOL}0/month
                </p>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <span>Unlimited subscription tracking</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <span>Configurable subscription alerts</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <span>Monthly spending summary</span>
                  </li>
                </ul>
                <Button className="mt-auto">Sign Up Free</Button>
              </motion.div>
              <motion.div
                className="flex flex-col rounded-lg bg-primary p-6 text-primary-foreground shadow-lg"
                variants={cardVariants}
                whileHover="hover"
              >
                <h3 className="mb-4 text-center text-2xl font-bold">
                  Pro Tier
                </h3>
                <p className="mb-4 text-center text-4xl font-bold">
                  {CURRENCY_SYMBOL}9.99/month
                </p>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5" />
                    <span>Everything in Free Tier</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5" />
                    <span>Advanced price change alerts</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5" />
                    <span>Personalized savings recommendations</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5" />
                    <span>Subscription Alternative Discovery</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5" />
                    <span>Priority customer support</span>
                  </li>
                </ul>
                <Button className="mt-auto bg-white text-primary hover:bg-gray-100">
                  Start 14-Day Free Trial
                </Button>
              </motion.div>
            </div>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform">
            <Button
              variant="ghost"
              size="icon"
              className="animate-bounce"
              onClick={() =>
                sectionRefs[3]?.current?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <ChevronDown className="h-6 w-6" />
            </Button>
          </div>
        </section>

        <section
          ref={sectionRefs[3]}
          className="relative flex min-h-screen flex-col justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] p-8 text-white"
        >
          <div className="absolute left-1/2 top-4 -translate-x-1/2 transform">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                sectionRefs[2]?.current?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <ChevronUp className="h-6 w-6" />
            </Button>
          </div>

          <h2 className="mb-8 text-center text-4xl font-bold">About</h2>
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4">
              As a developer and tech enthusiast, I couldn&apos;t resist trying
              out every promising SaaS product on the market. But with a growing
              list of subscriptions, I quickly found myself losing money on
              services I wasn&apos;t even using.
            </p>
            <p className="mb-4">
              I realized I wasn&apos;t alone—many of us are drowning in
              subscriptions we&apos;ve forgotten about or can&apos;t keep track
              of.
            </p>
            <p className="mb-4">
              That&apos;s why I built SubsCompass. It&apos;s designed to help
              you take back control by tracking all your subscriptions in one
              place.
            </p>
            <p className="mb-4">
              Not only does it organize your expenses, but it also keeps an eye
              on pricing pages for changes, discounts, and coupons, ensuring you
              always get the best deal.
            </p>
            <p className="mb-4">
              Whether you&apos;re managing personal subscriptions or overseeing
              business expenses, this app is your go-to solution for smarter,
              stress-free subscription management.
            </p>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform">
            <Button
              variant="ghost"
              size="icon"
              className="animate-bounce"
              onClick={() =>
                sectionRefs[4]?.current?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <ChevronDown className="h-6 w-6" />
            </Button>
          </div>
        </section>

        <section
          ref={sectionRefs[4]}
          className="relative flex min-h-screen flex-col justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] p-8 text-white"
        >
          <div className="absolute left-1/2 top-4 -translate-x-1/2 transform">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                sectionRefs[3]?.current?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <ChevronUp className="h-6 w-6" />
            </Button>
          </div>

          <div className="container mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-4xl font-bold">
              Get in Touch
            </h2>
            <ContactForm />
          </div>
        </section>
      </main>
    </ScrollArea>
  );
}

function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>Thank You!</CardTitle>
          <CardDescription>
            Your message has been sent successfully.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>I&apos;ll get back to you as soon as possible.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardDescription>
          Send me a message and I&apos;ll get back to you soon.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" required />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Send className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
