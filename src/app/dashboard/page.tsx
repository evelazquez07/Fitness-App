import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";
import {
  getRutinaDeHoy,
  getEjerciciosDeRutina,
  getEstadisticasUsuario,
} from "@/lib/rutinas/queries";

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "nombre, onboarding_completado, objetivo_id, nivel, lugar_entreno, racha_dias, experiencia, nivel_gamificacion"
    )
    .eq("id", user.id)
    .single();

  if (!profile?.onboarding_completado) redirect("/onboarding");

  const rutina = await getRutinaDeHoy(supabase, profile);
  const ejercicios = rutina ? await getEjerciciosDeRutina(supabase, rutina.id) : [];
  const { entrenamientosSemana, minutosSemana } = await getEstadisticasUsuario(
    supabase,
    user.id
  );

  return (
    <main className="min-h-dvh px-6 py-8 pb-24">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Hola, {profile.nombre} 👋</h1>
            <p className="text-sm text-white/50">
              Nivel {profile.nivel_gamificacion} · {profile.experiencia} XP
            </p>
            <div className="mt-1 h-1.5 w-32 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-brand-500 transition-all"
                style={{ width: `${profile.experiencia % 100}%` }}
              />
            </div>
          </div>
          <form action={signOut}>
            <button className="text-sm text-white/60 hover:text-white" type="submit">
              Salir
            </button>
          </form>
        </div>

        <div className="mb-4 flex gap-4 text-sm">
          <Link href="/perfil" className="text-white/60 hover:text-white">
            Mi perfil
          </Link>
          <Link href="/historial" className="text-white/60 hover:text-white">
            Historial
          </Link>
          <Link href="/logros" className="text-white/60 hover:text-white">
            Logros
          </Link>
        </div>

        {rutina ? (
          <div className="card fade-in mb-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-400">
              Entrenamiento de hoy
            </p>
            <h2 className="mb-3 text-xl font-bold">{rutina.nombre}</h2>

            <div className="mb-4 flex gap-4 text-sm text-white/60">
              <span>⏱ {rutina.duracion_min ?? "—"} min</span>
              <span>💪 {rutina.grupo_muscular ?? "General"}</span>
              <span>📋 {ejercicios.length} ejercicios</span>
            </div>

            <Link href={`/entrenamiento/${rutina.id}`} className="btn-primary w-full">
              Comenzar
            </Link>
          </div>
        ) : (
          <div className="card fade-in mb-4">
            <p className="text-white/70">
              Aún no hay una rutina configurada para tu perfil. Vuelve pronto.
            </p>
          </div>
        )}

        <Link
          href="/rutinas"
          className="mb-4 block text-center text-sm text-white/60 hover:text-white"
        >
          Ver todas las rutinas →
        </Link>

        <div className="fade-in-delay-1 grid grid-cols-3 gap-3">
          <div className="card text-center">
            <p className="text-2xl font-bold text-brand-400">{profile.racha_dias}</p>
            <p className="text-xs text-white/50">Racha (días)</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-brand-400">{entrenamientosSemana}</p>
            <p className="text-xs text-white/50">Esta semana</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-brand-400">{minutosSemana}</p>
            <p className="text-xs text-white/50">Minutos</p>
          </div>
        </div>
      </div>
    </main>
  );
}
