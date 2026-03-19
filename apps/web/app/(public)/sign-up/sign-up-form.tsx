"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import type { LandingCopy } from "@/app/site-language";

type RegisterResponse = {
  error?: string;
  code?: string;
};

type SignUpFormProps = {
  copy: LandingCopy["auth"];
};

function getSignUpError(copy: LandingCopy["auth"], code?: string) {
  switch (code) {
    case "email_exists":
      return copy.accountExists;
    case "google_account":
      return copy.googleAccountExists;
    default:
      return copy.unexpectedError;
  }
}

export default function SignUpForm({ copy }: SignUpFormProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password.length < 8) {
      setError(copy.passwordHint);
      return;
    }

    if (password !== confirmPassword) {
      setError(copy.passwordMismatch);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        confirmPassword,
      }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as RegisterResponse;
      setError(getSignUpError(copy, payload.code));
      setIsSubmitting(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/dashboard",
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

    router.push(result?.url ?? "/dashboard");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200" htmlFor="sign-up-name">
            {copy.nameLabel}
          </label>
          <input
            id="sign-up-name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200" htmlFor="sign-up-email">
            {copy.emailLabel}
          </label>
          <input
            id="sign-up-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200" htmlFor="sign-up-password">
            {copy.passwordLabel}
          </label>
          <input
            id="sign-up-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-200"
            htmlFor="sign-up-confirm-password"
          >
            {copy.confirmPasswordLabel}
          </label>
          <input
            id="sign-up-confirm-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
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
          {isSubmitting ? `${copy.signUpButton}...` : copy.signUpButton}
        </button>
      </form>

      <p className="text-sm text-slate-300">
        {copy.haveAccountText}{" "}
        <Link href="/sign-in" className="font-semibold text-white underline underline-offset-4">
          {copy.haveAccountLink}
        </Link>
      </p>
    </div>
  );
}
