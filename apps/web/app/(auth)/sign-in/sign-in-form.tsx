"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import type { LandingCopy } from "@/app/site-language";

type SignInFormProps = {
  googleAuthEnabled: boolean;
  copy: LandingCopy["auth"];
};

export default function SignInForm({ googleAuthEnabled, copy }: SignInFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCredentialsSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError(
        result.error === "CredentialsSignin"
          ? copy.invalidCredentials
          : copy.unexpectedError
      );
      return;
    }

    router.push(result?.url ?? callbackUrl);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <form className="space-y-4" onSubmit={handleCredentialsSignIn}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200" htmlFor="sign-in-email">
            {copy.emailLabel}
          </label>
          <input
            id="sign-in-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200" htmlFor="sign-in-password">
            {copy.passwordLabel}
          </label>
          <input
            id="sign-in-password"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-slate-400"
          />
        </div>

        {error ? (
          <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:bg-slate-500"
        >
          {isSubmitting ? `${copy.signInButton}...` : copy.signInButton}
        </button>
      </form>

      {googleAuthEnabled ? (
        <button
          type="button"
          className="inline-flex w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-slate-500 hover:bg-slate-900"
          onClick={() => {
            void signIn("google", { callbackUrl });
          }}
        >
          {copy.continueWithGoogle}
        </button>
      ) : (
        <p className="text-xs leading-6 text-slate-400">{copy.configureGoogle}</p>
      )}

      <p className="text-sm text-slate-300">
        {copy.noAccountText}{" "}
        <Link href="/sign-up" className="font-semibold text-white underline underline-offset-4">
          {copy.noAccountLink}
        </Link>
      </p>
    </div>
  );
}
