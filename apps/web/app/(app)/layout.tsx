import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl">
        <aside className="w-64 border-r border-slate-900 px-6 py-8">
          <div className="text-lg font-semibold">ReelGen</div>
          <nav className="mt-8 space-y-2 text-sm">
            <Link className="block rounded-lg px-3 py-2 hover:bg-slate-900" href="/dashboard">
              Dashboard
            </Link>
            <Link className="block rounded-lg px-3 py-2 hover:bg-slate-900" href="/series">
              Series
            </Link>
            <Link className="block rounded-lg px-3 py-2 hover:bg-slate-900" href="/videos">
              Videos
            </Link>
            <Link className="block rounded-lg px-3 py-2 hover:bg-slate-900" href="/billing">
              Billing
            </Link>
            <Link className="block rounded-lg px-3 py-2 hover:bg-slate-900" href="/integrations">
              Integrations
            </Link>
            <Link className="block rounded-lg px-3 py-2 hover:bg-slate-900" href="/publishing">
              Publishing
            </Link>
            <Link className="block rounded-lg px-3 py-2 hover:bg-slate-900" href="/settings">
              Settings
            </Link>
          </nav>
        </aside>
        <main className="flex-1 px-10 py-10">{children}</main>
      </div>
    </div>
  );
}
