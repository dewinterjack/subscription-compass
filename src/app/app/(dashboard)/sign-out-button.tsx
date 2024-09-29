"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>;
}
