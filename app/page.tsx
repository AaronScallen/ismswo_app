import Link from "next/link";
import {
  requestLifecycle,
  roleCards,
  summaryStats,
  workOrders,
} from "@/lib/mock-data";

const statusTone: Record<string, string> = {
  submitted: "bg-[#28344c] text-[#f7d27d]",
  "under-review": "bg-[#3b3622] text-[#f2d48e]",
  assigned: "bg-[#1f3b35] text-[#8ce2d5]",
  "in-progress": "bg-[#1f334b] text-[#98c7ff]",
  completed: "bg-[#213c2d] text-[#9edea8]",
};

const systemTone: Record<string, string> = {
  "access-control": "Access Control",
  "security-cameras": "Security Cameras",
  "intrusion-detection": "Intrusion Detection",
};

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="panel-glass reveal-up stagger-1 px-5 py-4 md:px-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--ink-2)]">
                Integrated Security Management Systems
              </p>
              <div className="max-w-3xl space-y-3">
                <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[var(--ink-1)] sm:text-5xl lg:text-6xl">
                  Work orders for access, video, and intrusion in one controlled
                  queue.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[var(--ink-2)] sm:text-lg">
                  A role-aware service hub where requesters file issues, systems
                  staff review and assign work, and technicians execute field
                  service with a clean operational view.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link href="/login" className="btn-primary px-5 py-3 text-sm">
                    Open Portal
                  </Link>
                  <Link
                    href="/register"
                    className="btn-subtle px-5 py-3 text-sm"
                  >
                    Create Requester Account
                  </Link>
                </div>
              </div>
            </div>
            <div className="grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[28rem] lg:grid-cols-2">
              {summaryStats.map((stat) => (
                <div
                  key={stat.label}
                  className="card-soft rounded-[1.6rem] bg-[rgba(24,41,71,0.72)] p-4 text-[var(--ink-1)]"
                >
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-[var(--ink-2)]">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-[var(--ink-2)]">
                    {stat.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="panel-glass reveal-up stagger-2 p-5 md:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--ink-2)]">
                  Request Flow
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--ink-1)]">
                  Review, assign, resolve.
                </h2>
              </div>
              <div className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white">
                16 users online
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {requestLifecycle.map((step, index) => (
                <article key={step} className="card-soft rounded-[1.5rem] p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.32em] text-[#84b1ff]">
                    Step {index + 1}
                  </p>
                  <p className="mt-3 text-base leading-7 text-[var(--ink-1)]">
                    {step}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <aside className="panel-strong reveal-up stagger-3 p-5 text-[var(--ink-1)] md:p-7">
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--ink-2)]">
              Authorization Model
            </p>
            <div className="mt-4 space-y-4">
              {roleCards.map((card) => (
                <article
                  key={card.role}
                  className="card-soft rounded-[1.4rem] bg-white/3 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold tracking-[-0.02em]">
                      {card.title}
                    </h3>
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[var(--ink-2)]">
                      {card.role}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[var(--ink-2)]">
                    {card.description}
                  </p>
                  <p className="mt-3 text-sm font-medium text-[#8ce2d5]">
                    {card.capability}
                  </p>
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="panel-glass reveal-up stagger-4 mt-6 p-5 md:p-7">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--ink-2)]">
                Live Queue
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--ink-1)]">
                Incoming and active work orders
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-[var(--ink-2)]">
              Each request records the timestamp, requester email, site
              location, affected system, assignment, and current status so
              management and administrators can route work without losing
              context.
            </p>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {workOrders.map((order) => (
              <article
                key={order.id}
                className="card-soft rounded-[1.6rem] p-5 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--ink-2)]">
                        {order.id}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusTone[order.status]}`}
                      >
                        {order.status.replaceAll("-", " ")}
                      </span>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[var(--ink-1)]">
                      {order.title}
                    </h3>
                  </div>
                  <div className="rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.03)] px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-[var(--ink-2)]">
                    {systemTone[order.system]}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-[var(--ink-2)]">
                  {order.description}
                </p>
                <dl className="mt-5 grid gap-4 text-sm text-[var(--ink-1)] sm:grid-cols-2">
                  <div>
                    <dt className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[var(--ink-2)]">
                      Requester
                    </dt>
                    <dd className="mt-2 font-medium">{order.requesterName}</dd>
                    <dd className="text-[var(--ink-2)]">
                      {order.requesterEmail}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[var(--ink-2)]">
                      Requested At
                    </dt>
                    <dd className="mt-2 font-medium">
                      {new Date(order.requestedAt).toLocaleString()}
                    </dd>
                    <dd className="text-[var(--ink-2)] capitalize">
                      Priority: {order.priority}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[var(--ink-2)]">
                      Location
                    </dt>
                    <dd className="mt-2 leading-6">{order.location}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[var(--ink-2)]">
                      Assigned To
                    </dt>
                    <dd className="mt-2 font-medium">
                      {order.assignedToName ?? "Awaiting assignment"}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
