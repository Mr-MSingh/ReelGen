"use client";

import { signIn } from "next-auth/react";

export default function SignInForm() {
  return (
    <button
      type="button"
      className="inline-flex w-full items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200"
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
    >
      Continue with Google
    </button>
  );
}
