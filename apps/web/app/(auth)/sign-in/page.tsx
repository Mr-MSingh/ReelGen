import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import SignInForm from "./sign-in-form";

export default async function SignInPage() {
  const session = await getSession();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6">
        <h1 className="text-3xl font-semibold">Sign in to ReelGen</h1>
        <p className="mt-2 text-sm text-slate-300">
          Use your Google account to continue.
        </p>
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <SignInForm />
        </div>
      </div>
    </main>
  );
}
