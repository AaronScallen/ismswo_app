import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { RequestForm } from "@/components/portal/request-form";
import { WorkOrderActions } from "@/components/portal/work-order-actions";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { getSessionUser } from "@/lib/auth";
import {
  getDashboardStats,
  listTechnicians,
  listVisibleWorkOrders,
} from "@/lib/store";

const statusTone: Record<string, string> = {
  submitted: "bg-[#28344c] text-[#f7d27d]",
  "under-review": "bg-[#3b3622] text-[#f2d48e]",
  assigned: "bg-[#1f3b35] text-[#8ce2d5]",
  "in-progress": "bg-[#1f334b] text-[#98c7ff]",
  completed: "bg-[#213c2d] text-[#9edea8]",
};

const systemLabel: Record<string, string> = {
  "access-control": "Access Control",
  "security-cameras": "Security Cameras",
  "intrusion-detection": "Intrusion Detection",
};

const roleMessage: Record<string, string> = {
  requester:
    "Submit new requests, monitor open issues, and review prior work orders.",
  secretary:
    "Triage incoming requests and keep incomplete tickets moving into review.",
  technician:
    "See assigned work, update field progress, and close completed jobs.",
  sysadmin:
    "Review requests, verify ownership, and assign jobs to technicians.",
  manager:
    "Oversee queue health, resolve escalations, and direct technician workload.",
};

export const dynamic = "force-dynamic";

export default async function PortalPage() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect("/login");
  }

  const [workOrders, technicians] = await Promise.all([
    listVisibleWorkOrders(sessionUser),
    sessionUser.role === "manager" || sessionUser.role === "sysadmin"
      ? listTechnicians()
      : Promise.resolve([]),
  ]);

  const sortedWorkOrders = [...workOrders].sort((left, right) =>
    right.requestedAt.localeCompare(left.requestedAt),
  );
  const stats = getDashboardStats(sortedWorkOrders);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
      <section className="panel-strong reveal-up stagger-1 p-6 text-[var(--ink-1)] md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/isms_logo.png"
                alt="ISMS Logo"
                width={48}
                height={48}
                className="shrink-0"
                style={{ width: "auto", height: "auto" }}
              />
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--ink-2)]">
                Authenticated Portal
              </p>
            </div>
            <div>
              <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                {sessionUser.name}
                <span className="ml-3 align-middle font-mono text-sm uppercase tracking-[0.28em] text-[#8ce2d5]">
                  {sessionUser.role}
                </span>
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--ink-2)]">
                {roleMessage[sessionUser.role]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="btn-subtle px-4 py-2 text-sm">
              Home
            </Link>
            <SignOutButton />
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="card-soft rounded-[1.5rem] p-4">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-[var(--ink-2)]">
              Visible Orders
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
              {stats.total}
            </p>
          </div>
          <div className="card-soft rounded-[1.5rem] p-4">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-[var(--ink-2)]">
              Open
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
              {stats.open}
            </p>
          </div>
          <div className="card-soft rounded-[1.5rem] p-4">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-[var(--ink-2)]">
              Awaiting Review
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
              {stats.awaitingReview}
            </p>
          </div>
          <div className="card-soft rounded-[1.5rem] p-4">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-[var(--ink-2)]">
              High Priority
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
              {stats.highPriority}
            </p>
          </div>
        </div>
      </section>

      {sessionUser.role === "requester" || sessionUser.role === "secretary" ? (
        <section className="panel-glass reveal-up stagger-2 mt-6 p-6 md:p-8">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--ink-2)]">
            New Request
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[var(--ink-1)]">
            Submit a work order
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ink-2)]">
            Capture the issue with a location, affected system, email-backed
            requester identity, and a brief operational summary so the ISMS
            review team can route it correctly.
          </p>
          <div className="mt-6">
            <RequestForm />
          </div>
        </section>
      ) : null}

      <section className="panel-glass reveal-up stagger-3 mt-6 p-6 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--ink-2)]">
              Work Order Queue
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[var(--ink-1)]">
              Current requests
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-[var(--ink-2)]">
            Requesters only see their own tickets. Technicians only see work
            assigned to them. Secretary, systems administrators, and manager
            accounts can supervise the broader queue.
          </p>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {sortedWorkOrders.map((workOrder) => (
            <article
              key={workOrder.id}
              className="card-soft rounded-[1.6rem] p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--ink-2)]">
                      {workOrder.id}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusTone[workOrder.status]}`}
                    >
                      {workOrder.status.replaceAll("-", " ")}
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[var(--ink-1)]">
                    {workOrder.title}
                  </h3>
                </div>
                <div className="rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.03)] px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-[var(--ink-2)]">
                  {systemLabel[workOrder.system]}
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-[var(--ink-2)]">
                {workOrder.description}
              </p>
              <dl className="mt-5 grid gap-4 text-sm text-[var(--ink-1)] sm:grid-cols-2">
                <div>
                  <dt className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[var(--ink-2)]">
                    Requester
                  </dt>
                  <dd className="mt-2 font-medium">
                    {workOrder.requesterName}
                  </dd>
                  <dd className="text-[var(--ink-2)]">
                    {workOrder.requesterEmail}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[var(--ink-2)]">
                    Requested At
                  </dt>
                  <dd className="mt-2 font-medium">
                    {new Date(workOrder.requestedAt).toLocaleString()}
                  </dd>
                  <dd className="text-[var(--ink-2)] capitalize">
                    Priority: {workOrder.priority}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[var(--ink-2)]">
                    Location
                  </dt>
                  <dd className="mt-2 leading-6">{workOrder.location}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[var(--ink-2)]">
                    Assigned To
                  </dt>
                  <dd className="mt-2 font-medium">
                    {workOrder.assignedToName ?? "Awaiting assignment"}
                  </dd>
                </div>
              </dl>
              {sessionUser.role === "manager" ||
              sessionUser.role === "sysadmin" ||
              sessionUser.role === "secretary" ||
              (sessionUser.role === "technician" &&
                workOrder.assignedToUserId === sessionUser.id) ? (
                <WorkOrderActions
                  currentUserId={sessionUser.id}
                  currentUserRole={sessionUser.role}
                  technicians={technicians}
                  workOrder={workOrder}
                />
              ) : null}
            </article>
          ))}
          {sortedWorkOrders.length === 0 ? (
            <div className="card-soft rounded-[1.6rem] border-dashed bg-[rgba(255,255,255,0.03)] p-8 text-sm leading-6 text-[var(--ink-2)]">
              No work orders are visible for this role yet.
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
