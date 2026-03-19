import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import {
  LANDING_COPY,
  LANGUAGE_COOKIE,
  resolveSiteLanguage,
} from "@/app/site-language";
import SignInForm from "./sign-in-form";

export default async function SignInPage() {
  const googleAuthEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  );
  const cookieStore = await cookies();
  const language = resolveSiteLanguage(cookieStore.get(LANGUAGE_COOKIE)?.value);
  const authCopy = LANDING_COPY[language].auth;

  let session = null;

  try {
    session = await getSession();
  } catch (error) {
    console.error("Unable to resolve session for /sign-in", error);
  }

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6">
        <Link
          href="/"
          className="mb-8 text-sm font-medium text-slate-400 transition hover:text-white"
        >
          ← ReelGen
        </Link>
        <h1 className="text-3xl font-semibold">{authCopy.title}</h1>
        <p className="mt-2 text-sm text-slate-300">
          {googleAuthEnabled
            ? authCopy.subtitleEnabled
            : authCopy.subtitleDisabled}
        </p>
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <SignInForm googleAuthEnabled={googleAuthEnabled} copy={authCopy} />
        </div>
      </div>
    </main>
  );
}
