"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import type { PublicUser, UserRole, WorkOrder } from "@/lib/contracts";

type Props = {
  currentUserId: string;
  currentUserRole: UserRole;
  technicians: PublicUser[];
  workOrder: WorkOrder;
};

export function WorkOrderActions({
  currentUserId,
  currentUserRole,
  technicians,
  workOrder,
}: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState(
    workOrder.assignedToUserId ?? technicians[0]?.id ?? "",
  );

  async function sendPatch(payload: Record<string, string>) {
    setError(null);
    setIsPending(true);

    const response = await fetch(`/api/work-orders/${workOrder.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    if (!response.ok) {
      setError(result?.error ?? "Unable to update the work order.");
      setIsPending(false);
      return;
    }

    setIsPending(false);
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="card-soft mt-5 space-y-3 rounded-[1.4rem] bg-[rgba(255,255,255,0.03)] p-4">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[var(--ink-2)]">
        Available Actions
      </p>
      {currentUserRole === "manager" || currentUserRole === "sysadmin" ? (
        <div className="space-y-3">
          <div className="flex flex-col gap-3 md:flex-row">
            <select
              value={selectedTechnician}
              onChange={(event) => setSelectedTechnician(event.target.value)}
              className="input-shell flex-1 rounded-full px-4 py-2 text-sm"
            >
              {technicians.map((technician) => (
                <option key={technician.id} value={technician.id}>
                  {technician.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={isPending || !selectedTechnician}
              onClick={() =>
                sendPatch({
                  assignedToUserId: selectedTechnician,
                  status: "assigned",
                })
              }
              className="btn-primary px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-70"
            >
              Assign Technician
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={isPending}
              onClick={() => sendPatch({ status: "under-review" })}
              className="btn-outline px-4 py-2 text-sm font-medium"
            >
              Mark Under Review
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => sendPatch({ status: "completed" })}
              className="btn-outline px-4 py-2 text-sm font-medium"
            >
              Close Request
            </button>
          </div>
        </div>
      ) : null}
      {currentUserRole === "secretary" ? (
        <button
          type="button"
          disabled={isPending}
          onClick={() => sendPatch({ status: "under-review" })}
          className="btn-primary px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-70"
        >
          Mark Under Review
        </button>
      ) : null}
      {currentUserRole === "technician" &&
      workOrder.assignedToUserId === currentUserId ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={isPending}
            onClick={() => sendPatch({ status: "in-progress" })}
            className="btn-primary px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-70"
          >
            Start Work
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => sendPatch({ status: "completed" })}
            className="btn-outline px-4 py-2 text-sm font-medium"
          >
            Mark Complete
          </button>
        </div>
      ) : null}
      {error ? <p className="text-sm text-[#ff8b7f]">{error}</p> : null}
    </div>
  );
}
