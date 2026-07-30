import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const NIVELES = ["principiante", "intermedio", "avanzado"];
const LUGARES = ["casa", "gimnasio"];

export default async function RutinasPage({
  searchParams,
}: {
  searchParams: { lugar?: string; nivel?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let query = supabase.from("rutinas").select("*").eq("activa", true);
  if (searchParams.lugar) {
    query = query.in("lugar_entreno", [searchParams.lugar, "ambos"]);
  }
  if (searchParams.nivel) {
    query = query.eq("nivel", searchParams.nivel);
  }
  const { data: rutinas } = await query.order("nombre");

  function hrefCon(cambios: Record<string, string | undefined>) {
    const params = new URLSearchParams({
      ...(searchParams.lugar ? { lugar: searchParams.lugar } : {}),
      ...(searchParams.nivel ? { nivel: searchParams.nivel } : {}),
      ...cambios,
    });
    for (const [k, v] of Object.entries(cambios)) {
      if (!v) params.delete(k);
    }
    const qs = params.toString();
    return qs ? `/rutinas?${qs}` : "/rutinas";
  }

  return (
    <main className="min-h-dvh px-6 py-8 pb-24">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Rutinas</h1>
          <Link href="/dashboard" className="text-sm text-white/60 hover:text-white">
            ← Dashboard
          </Link>
        </div>

        {/* Filtros */}
        <div className="mb-6 space-y-3">
          <div className="flex flex-wrap gap-2">
            <Link
              href={hrefCon({ lugar: undefined })}
              className={`rounded-full px-3 py-1.5 text-sm ${
                !searchParams.lugar ? "bg-brand-500" : "bg-white/10"
              }`}
            >
              Todos los lugares
            </Link>
            {LUGARES.map((l) => (
              <Link
                key={l}
                href={hrefCon({ lugar: l })}
                className={`rounded-full px-3 py-1.5 text-sm capitalize ${
                  searchParams.lugar === l ? "bg-brand-500" : "bg-white/10"
                }`}
              >
                {l}
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={hrefCon({ nivel: undefined })}
              className={`rounded-full px-3 py-1.5 text-sm ${
                !searchParams.nivel ? "bg-brand-500" : "bg-white/10"
              }`}
            >
              Todos los niveles
            </Link>
            {NIVELES.map((n) => (
              <Link
                key={n}
                href={hrefCon({ nivel: n })}
                className={`rounded-full px-3 py-1.5 text-sm capitalize ${
                  searchParams.nivel === n ? "bg-brand-500" : "bg-white/10"
                }`}
              >
                {n}
              </Link>
            ))}
          </div>
        </div>

        {/* Lista */}
        <div className="space-y-3">
          {(rutinas ?? []).map((r) => (
            <Link key={r.id} href={`/entrenamiento/${r.id}`} className="card fade-in block transition hover:border-brand-500">
              <h2 className="mb-1 font-bold">{r.nombre}</h2>
              <div className="flex gap-3 text-sm text-white/50">
                <span>⏱ {r.duracion_min ?? "—"} min</span>
                <span>💪 {r.grupo_muscular ?? "General"}</span>
                <span className="capitalize">📍 {r.lugar_entreno}</span>
              </div>
            </Link>
          ))}

          {(rutinas ?? []).length === 0 && (
            <p className="text-white/50">No hay rutinas con esos filtros.</p>
          )}
        </div>
      </div>
    </main>
  );
}
