"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    if (!response.ok) {
      setError(result?.error ?? "Unable to sign in.");
      setIsPending(false);
      return;
    }

    startTransition(() => {
      router.push("/portal");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-[var(--ink-1)]">Email</span>
        <input
          required
          type="email"
          name="email"
          className="input-shell rounded-2xl px-4 py-3 text-sm"
          placeholder="manager@isms.local"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-[var(--ink-1)]">
          Password
        </span>
        <input
          required
          type="password"
          name="password"
          className="input-shell rounded-2xl px-4 py-3 text-sm"
          placeholder="Password123!"
        />
      </label>
      {error ? <p className="text-sm text-[#ff8b7f]">{error}</p> : null}
      <button
        type="submit"
        disabled={isPending}
        className="btn-primary w-full px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
