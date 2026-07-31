import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BottomNav } from "@/components/ui/BottomNav";
import { OnboardingForm } from "@/components/profile/OnboardingForm";
import { setMusculosPorSesion } from "@/lib/profile/actions";
import { BottomNav } from "@/components/ui/BottomNav";

export default async function PerfilPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: perfil } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: objetivos } = await supabase
    .from("objetivos")
    .select("id, nombre")
    .eq("activo", true)
    .order("orden");

  return (
    <main className="min-h-dvh px-6 py-10">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Mi perfil</h1>
          <Link href="/dashboard" className="text-sm text-white/60 hover:text-white">
            ← Dashboard
          </Link>
        </div>
        <OnboardingForm
          objetivos={objetivos ?? []}
          perfil={perfil ?? undefined}
          textoBoton="Guardar cambios"
        />
      </div>
          <BottomNav />
    </main>
  );
}
