import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { getSessionUser } from "@/lib/auth";
import { getDemoCredentials } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const sessionUser = await getSessionUser();

  if (sessionUser) {
    redirect("/portal");
  }

  const demo = await getDemoCredentials();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10">
      <section className="grid flex-1 gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="panel-strong reveal-up stagger-1 p-6 text-[var(--ink-1)] md:p-8">
          <div className="flex items-center gap-4">
            <Image
              src="/isms_logo.png"
              alt="ISMS Logo"
              width={56}
              height={56}
              className="shrink-0"
              priority
            />
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--ink-2)]">
              ISMS Portal Access
            </p>
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Sign in to review, assign, or track work orders.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[var(--ink-2)]">
            Manager and systems administrators can review and assign requests.
            Technicians can update their work. Requesters can check status and
            submit new issues tied to access control, cameras, and intrusion
            systems.
          </p>
          <div className="card-soft mt-8 rounded-[1.5rem] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--ink-2)]">
              Demo Accounts
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {demo.users.map((user) => (
                <div
                  key={user.email}
                  className="card-soft rounded-[1.25rem] p-4"
                >
                  <p className="text-sm font-semibold capitalize">
                    {user.role}
                  </p>
                  <p className="mt-2 text-sm text-[var(--ink-2)]">
                    {user.email}
                  </p>
                  <p className="mt-1 font-mono text-xs uppercase tracking-[0.24em] text-[#8ce2d5]">
                    {demo.password}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel-glass reveal-up stagger-2 p-6 md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--ink-2)]">
                Welcome Back
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[var(--ink-1)]">
                Secure sign-in
              </h2>
            </div>
            <Link
              href="/"
              className="text-sm font-medium text-[var(--ink-2)] transition hover:text-white"
            >
              Home
            </Link>
          </div>
          <div className="mt-8">
            <LoginForm />
          </div>
          <p className="mt-6 text-sm leading-6 text-[var(--ink-2)]">
            Need a requester account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[var(--accent-strong)]"
            >
              Create one here.
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
