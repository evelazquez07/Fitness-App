import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BottomNav } from "@/components/ui/BottomNav";
import { OnboardingForm } from "@/components/profile/OnboardingForm";
import { setMusculosPorSesion, reiniciarEstadisticas } from "@/lib/profile/actions";

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

        <div className="card fade-in mt-4">
          <p className="mb-3 text-sm font-semibold">Músculos por sesión en tu programa</p>
          <div className="flex gap-3">
            <form action={setMusculosPorSesion.bind(null, 1)} className="flex-1">
              <button
                type="submit"
                className={
                  perfil?.musculos_por_sesion === 1 ? "btn-primary w-full" : "btn-secondary w-full"
                }
              >
                1 músculo
              </button>
            </form>
            <form action={setMusculosPorSesion.bind(null, 2)} className="flex-1">
              <button
                type="submit"
                className={
                  perfil?.musculos_por_sesion === 2 ? "btn-primary w-full" : "btn-secondary w-full"
                }
              >
                2 músculos
              </button>
            </form>
          </div>
        </div>

        <div className="card fade-in-delay-1 mt-4">
          <p className="mb-2 text-sm font-semibold">Reiniciar progreso</p>
          <p className="mb-3 text-xs text-white/50">
            Pone la racha y los contadores de &quot;esta semana&quot; en cero. Tu historial de
            entrenamientos NO se borra.
          </p>
          <form action={reiniciarEstadisticas}>
            <button type="submit" className="btn-secondary w-full text-sm">
              Reiniciar racha y estadísticas
            </button>
          </form>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
