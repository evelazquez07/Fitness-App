import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingForm } from "@/components/profile/OnboardingForm";

export default async function OnboardingPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: objetivos } = await supabase
    .from("objetivos")
    .select("id, nombre")
    .eq("activo", true)
    .order("orden");

  return (
    <main className="min-h-dvh px-6 py-10">
      <div className="mx-auto w-full max-w-lg">
        <h1 className="mb-1 text-2xl font-bold">Cuéntanos sobre ti</h1>
        <p className="mb-8 text-white/60">
          Con esto armamos tu plan de entrenamiento ideal.
        </p>
        <OnboardingForm objetivos={objetivos ?? []} />
      </div>
    </main>
  );
}
