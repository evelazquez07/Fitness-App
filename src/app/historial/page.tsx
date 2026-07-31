import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BottomNav } from "@/components/ui/BottomNav";
import { getHistorialUsuario, getMinutosPorDia } from "@/lib/rutinas/queries";

export default async function HistorialPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [historial, minutosPorDia] = await Promise.all([
    getHistorialUsuario(supabase, user.id),
    getMinutosPorDia(supabase, user.id),
  ]);

  const maxMinutos = Math.max(...minutosPorDia.map((d) => d.minutos), 1);
  const diasConEntreno = minutosPorDia.filter((d) => d.minutos > 0).length;
  const totalMinutos7d = minutosPorDia.reduce((acc, d) => acc + d.minutos, 0);
  const promedio7d = diasConEntreno > 0 ? Math.round(totalMinutos7d / diasConEntreno) : 0;

  return (
    <main className="min-h-dvh px-6 py-8 pb-24">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Historial</h1>
          <Link href="/dashboard" className="text-sm text-white/60 hover:text-white">
            ← Dashboard
          </Link>
        </div>

        {/* Gráfica de barras: minutos por día, últimos 7 días */}
        <div className="card mb-6">
          <p className="mb-4 text-sm text-white/60">Minutos entrenados (últimos 7 días)</p>
          <div className="flex h-32 items-end justify-between gap-2">
            {minutosPorDia.map((d) => (
              <div key={d.etiqueta + d.fecha.toISOString()} className="flex flex-1 flex-col items-center gap-1">
                {d.minutos > 0 && (
                  <span className="text-[10px] font-semibold text-brand-400">{d.minutos}</span>
                )}
                <div
                  className="w-full rounded-t bg-brand-500 transition-all"
                  style={{
                    height: `${Math.max((d.minutos / maxMinutos) * 100, d.minutos > 0 ? 6 : 2)}%`,
                  }}
                />
                <span className="text-xs capitalize text-white/40">{d.etiqueta}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-surface-border pt-3 text-center text-xs text-white/50">
            <span>
              <strong className="block text-sm text-white">{diasConEntreno}</strong>días activos
            </span>
            <span>
              <strong className="block text-sm text-white">{totalMinutos7d}</strong>min totales
            </span>
            <span>
              <strong className="block text-sm text-white">{promedio7d}</strong>min/día promedio
            </span>
          </div>
        </div>

        {/* Lista de entrenamientos */}
        <div className="space-y-3">
          {historial.map((h) => (
            <div key={h.id} className="card flex items-center justify-between">
              <div>
                <p className="font-semibold">{h.rutina?.nombre ?? "Entrenamiento"}</p>
                <p className="text-sm text-white/50">
                  {new Date(h.realizado_en).toLocaleDateString("es-MX", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span className="text-sm text-white/60">{h.duracion_min ?? "—"} min</span>
            </div>
          ))}

          {historial.length === 0 && (
            <p className="text-white/50">Aún no has completado ningún entrenamiento.</p>
          )}
        </div>
      </div>
          <BottomNav />
    </main>
  );
}
