"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

export function RequestForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get("title") ?? ""),
      location: String(formData.get("location") ?? ""),
      system: String(formData.get("system") ?? ""),
      priority: String(formData.get("priority") ?? "normal"),
      description: String(formData.get("description") ?? ""),
    };

    const response = await fetch("/api/work-orders", {
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
      setError(result?.error ?? "Unable to submit the work order.");
      setIsPending(false);
      return;
    }

    event.currentTarget.reset();
    setSuccess("Work order submitted.");
    setIsPending(false);

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <label className="space-y-2 md:col-span-2">
        <span className="text-sm font-medium text-[var(--ink-1)]">
          Issue Title
        </span>
        <input
          required
          name="title"
          className="input-shell rounded-2xl px-4 py-3 text-sm"
          placeholder="Door controller not communicating"
        />
      </label>
      <label className="space-y-2 md:col-span-2">
        <span className="text-sm font-medium text-[var(--ink-1)]">
          Location
        </span>
        <input
          required
          name="location"
          className="input-shell rounded-2xl px-4 py-3 text-sm"
          placeholder="Building C, east entrance"
        />
      </label>
      <label className="space-y-2">
        <span className="text-sm font-medium text-[var(--ink-1)]">System</span>
        <select
          name="system"
          defaultValue="access-control"
          className="input-shell rounded-2xl px-4 py-3 text-sm"
        >
          <option value="access-control">Access Control</option>
          <option value="security-cameras">Security Cameras</option>
          <option value="intrusion-detection">Intrusion Detection</option>
        </select>
      </label>
      <label className="space-y-2">
        <span className="text-sm font-medium text-[var(--ink-1)]">
          Priority
        </span>
        <select
          name="priority"
          defaultValue="normal"
          className="input-shell rounded-2xl px-4 py-3 text-sm"
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
      </label>
      <label className="space-y-2 md:col-span-2">
        <span className="text-sm font-medium text-[var(--ink-1)]">
          Description
        </span>
        <textarea
          required
          name="description"
          rows={5}
          className="input-shell rounded-[1.5rem] px-4 py-3 text-sm"
          placeholder="Describe the issue, what changed, and any urgency details."
        />
      </label>
      {error ? (
        <p className="text-sm text-[#ff8b7f] md:col-span-2">{error}</p>
      ) : null}
      {success ? (
        <p className="text-sm text-[#7ee3ca] md:col-span-2">{success}</p>
      ) : null}
      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Submitting..." : "Submit Work Order"}
        </button>
      </div>
    </form>
  );
}
