import Link from "next/link";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6">
        <h1 className="text-3xl font-semibold">Create your ReelGen account</h1>
        <p className="mt-2 text-sm text-slate-300">
          Sign up using Google to start generating.
        </p>
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <Link
            href="/sign-in"
            className="inline-flex w-full items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900"
          >
            Continue to sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
