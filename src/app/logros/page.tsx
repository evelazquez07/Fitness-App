import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLogrosUsuario } from "@/lib/logros/queries";
import { BottomNav } from "@/components/ui/BottomNav";

const HITOS_RACHA = [6, 7, 15, 20, 30, 60, 120, 365];

export default async function LogrosPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [logros, { data: profile }] = await Promise.all([
    getLogrosUsuario(supabase, user.id),
    supabase.from("profiles").select("racha_dias").eq("id", user.id).single(),
  ]);

  const rachaActual = profile?.racha_dias ?? 0;
  const siguienteHito = HITOS_RACHA.find((h) => h > rachaActual);
  const desbloqueados = logros.filter((l) => l.desbloqueado).length;

  return (
    <main className="min-h-dvh px-6 py-8 pb-24">
      <div className="mx-auto w-full max-w-lg">
        <h1 className="mb-1 text-2xl font-bold">Logros</h1>
        <p className="mb-4 text-sm text-white/50">
          {desbloqueados} de {logros.length} desbloqueados
        </p>

        {siguienteHito && (
          <div className="card fade-in mb-5">
            <p className="mb-2 text-xs text-white/50">
              Racha actual: {rachaActual} días · próximo hito: {siguienteHito} días
            </p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-brand-500 transition-all"
                style={{ width: `${Math.min(100, (rachaActual / siguienteHito) * 100)}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {logros.map((l) => (
            <div
              key={l.id}
              className={`card fade-in text-center ${
                l.desbloqueado ? "logro-desbloqueado border-brand-500/50" : "opacity-40"
              }`}
            >
              <p className="mb-2 text-3xl">{l.icono}</p>
              <p className="font-semibold">{l.nombre}</p>
              <p className="mt-1 text-xs text-white/50">{l.descripcion}</p>
              {l.desbloqueado && (
                <p className="mt-2 text-[11px] font-semibold text-brand-400">✓ Desbloqueado</p>
              )}
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
