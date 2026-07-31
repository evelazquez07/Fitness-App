import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";
import { setMusculosPorSesion } from "@/lib/profile/actions";
import { getRutinaPrograma } from "@/lib/rutinas/programa";
import { getEstadisticasUsuario } from "@/lib/rutinas/queries";
import { BottomNav } from "@/components/ui/BottomNav";

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "nombre, onboarding_completado, nivel, racha_dias, experiencia, nivel_gamificacion, musculos_por_sesion, programa_dia_actual, stats_reset_en"
    )
    .eq("id", user.id)
    .single();

  if (!profile?.onboarding_completado) redirect("/onboarding");

  const { entrenamientosSemana, minutosSemana } = await getEstadisticasUsuario(
    supabase,
    user.id,
    profile.stats_reset_en
  );

  return (
    <main className="min-h-dvh px-6 py-8 pb-24">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/icon.png" alt="FuarKing App" className="h-10 w-10 rounded-xl" />
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
          </div>
          <form action={signOut}>
            <button className="text-sm text-white/60 hover:text-white" type="submit">
              Salir
            </button>
          </form>
        </div>

        {profile.musculos_por_sesion == null ? (
          <SelectorMusculosPorSesion />
        ) : (
          <TarjetasEntrenamiento
            supabase={supabase}
            nivel={profile.nivel}
            musculosPorSesion={profile.musculos_por_sesion}
            diaActual={profile.programa_dia_actual}
          />
        )}

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
      <BottomNav />
    </main>
  );
}

function SelectorMusculosPorSesion() {
  return (
    <div className="card fade-in mb-4">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-400">
        Antes de empezar
      </p>
      <h2 className="mb-3 text-lg font-bold">¿Cuántos músculos quieres entrenar por día?</h2>
      <p className="mb-4 text-sm text-white/60">
        Con esto armamos tu programa diario. Lo puedes cambiar después desde tu perfil.
      </p>
      <div className="flex gap-3">
        <form action={setMusculosPorSesion.bind(null, 1)} className="flex-1">
          <button type="submit" className="btn-secondary w-full">
            1 músculo
          </button>
        </form>
        <form action={setMusculosPorSesion.bind(null, 2)} className="flex-1">
          <button type="submit" className="btn-primary w-full">
            2 músculos
          </button>
        </form>
      </div>
    </div>
  );
}

async function TarjetasEntrenamiento({
  supabase,
  nivel,
  musculosPorSesion,
  diaActual,
}: {
  supabase: ReturnType<typeof createClient>;
  nivel: string | null;
  musculosPorSesion: 1 | 2;
  diaActual: number;
}) {
  const { rutina, musculosDeHoy } = await getRutinaPrograma(
    supabase,
    nivel,
    musculosPorSesion,
    diaActual
  );

  return (
    <div className="mb-4 grid grid-cols-2 gap-3">
      {/* Programa: entrenamiento de hoy */}
      <div className="card fade-in flex flex-col">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-brand-400">
          Tu programa · Hoy
        </p>
        {rutina ? (
          <>
            <p className="mb-1 text-sm font-bold capitalize">{musculosDeHoy.join(" + ")}</p>
            <p className="mb-3 text-xs text-white/50">
              Día {diaActual + 1} · {rutina.duracion_min ?? "—"} min
            </p>
            <Link
              href={`/entrenamiento/${rutina.id}?programa=1`}
              className="btn-primary mt-auto text-sm"
            >
              Comenzar
            </Link>
          </>
        ) : (
          <p className="text-xs text-white/50">Aún no hay rutina para tu nivel.</p>
        )}
      </div>

      {/* Entrenamiento libre */}
      <Link
        href="/rutinas"
        className="card fade-in-delay-1 flex flex-col justify-between transition hover:border-brand-500"
      >
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-white/50">
            Explorar
          </p>
          <p className="text-sm font-bold">Entrenamiento libre</p>
          <p className="mt-1 text-xs text-white/50">Elige tú qué entrenar hoy</p>
        </div>
        <span className="mt-3 text-sm text-brand-400">Ver rutinas →</span>
      </Link>
    </div>
  );
}
