import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const sessionUser = await getSessionUser();

  if (sessionUser) {
    redirect("/portal");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-6 sm:px-8 lg:px-10">
      <section className="grid flex-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="panel-glass reveal-up stagger-1 p-6 md:p-8">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--ink-2)]">
            Requester Access
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[var(--ink-1)]">
            Create an account to submit and track your requests.
          </h1>
          <p className="mt-4 text-base leading-7 text-[var(--ink-2)]">
            Public registration is limited to requester accounts. Internal ISMS
            roles are provisioned separately and use seeded sign-in accounts in
            this prototype.
          </p>
          <p className="mt-8 text-sm leading-6 text-[var(--ink-2)]">
            Already registered?{" "}
            <Link
              href="/login"
              className="font-semibold text-[var(--accent-strong)]"
            >
              Sign in here.
            </Link>
          </p>
        </div>
        <div className="panel-strong reveal-up stagger-2 p-6 text-[var(--ink-1)] md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--ink-2)]">
                New Account
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">
                Requester registration
              </h2>
            </div>
            <Link
              href="/"
              className="text-sm font-medium text-[var(--ink-2)] transition hover:text-white"
            >
              Home
            </Link>
          </div>
          <div className="card-soft mt-8 rounded-[1.5rem] p-5">
            <RegisterForm />
          </div>
        </div>
      </section>
    </main>
  );
}
