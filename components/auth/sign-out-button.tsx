"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleSignOut() {
    setIsPending(true);
    await fetch("/api/auth/logout", { method: "POST" });

    startTransition(() => {
      router.push("/login");
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isPending}
      className="btn-subtle px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isPending ? "Signing out..." : "Sign Out"}
    </button>
  );
}
