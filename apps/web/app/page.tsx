import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import HomeExperience from "./home-experience";
import { LANGUAGE_COOKIE, isSiteLanguage } from "./site-language";

export default async function Home() {
  const cookieStore = await cookies();
  const language = cookieStore.get(LANGUAGE_COOKIE)?.value;

  if (!isSiteLanguage(language)) {
    redirect("/language");
  }

  return <HomeExperience />;
}
