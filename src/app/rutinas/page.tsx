import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BottomNav } from "@/components/ui/BottomNav";

const CATEGORIAS = [
  { key: "hipertrofia", label: "Hipertrofia", icono: "💪", campo: "objetivo_id" },
  { key: "fuerza", label: "Fuerza", icono: "🏋️", campo: "objetivo_id" },
  { key: "definicion", label: "Definición", icono: "✂️", campo: "objetivo_id" },
  { key: "perdida_grasa", label: "Pérdida de peso", icono: "🔥", campo: "objetivo_id" },
  { key: "en_casa", label: "Casa", icono: "🏠", campo: "objetivo_id" },
  { key: "calistenia", label: "Calistenia", icono: "🤸", campo: "objetivo_id" },
  { key: "resistencia", label: "HIIT / Resistencia", icono: "⚡", campo: "objetivo_id" },
  { key: "principiante", label: "Principiantes", icono: "🌱", campo: "nivel" },
  { key: "intermedio", label: "Intermedios", icono: "📈", campo: "nivel" },
  { key: "avanzado", label: "Avanzados", icono: "🏆", campo: "nivel" },
] as const;

const GRUPOS = [
  { key: "pecho", label: "Pecho" },
  { key: "espalda", label: "Espalda" },
  { key: "piernas", label: "Piernas" },
  { key: "gluteos", label: "Glúteos" },
  { key: "hombro", label: "Hombro" },
  { key: "biceps", label: "Bíceps" },
  { key: "triceps", label: "Tríceps" },
  { key: "core", label: "Core" },
  { key: "cardio", label: "Cardio" },
];

const PAGINA = 12;

export default async function RutinasPage({
  searchParams,
}: {
  searchParams: { cat?: string; lugar?: string; grupo?: string; pagina?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const categoria = CATEGORIAS.find((c) => c.key === searchParams.cat);

  // Paso 1: sin categoría elegida, mostrar el selector (nunca la lista completa)
  if (!categoria) {
    return (
      <main className="min-h-dvh px-6 py-8 pb-24">
        <div className="mx-auto w-full max-w-lg">
          <h1 className="mb-1 text-2xl font-bold">Rutinas</h1>
          <p className="mb-6 text-sm text-white/50">Elige una categoría para empezar</p>

          <div className="grid grid-cols-2 gap-3">
            {CATEGORIAS.map((c) => (
              <Link
                key={c.key}
                href={`/rutinas?cat=${c.key}`}
                className="card fade-in flex flex-col items-center gap-2 py-6 text-center transition hover:border-brand-500"
              >
                <span className="text-3xl">{c.icono}</span>
                <span className="font-semibold">{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
        <BottomNav />
      </main>
    );
  }

  // Paso 2: dentro de la categoría, filtros + lista paginada
  const pagina = Math.max(1, Number(searchParams.pagina) || 1);
  const desde = (pagina - 1) * PAGINA;

  let query = supabase
    .from("rutinas")
    .select("*", { count: "exact" })
    .eq("activa", true)
    .eq(categoria.campo, categoria.key);

  if (searchParams.lugar) {
    query = query.in("lugar_entreno", [searchParams.lugar, "ambos"]);
  }
  if (searchParams.grupo) {
    query = query.contains("musculos", [searchParams.grupo]);
  }

  const { data: rutinas, count } = await query
    .order("nombre")
    .range(desde, desde + PAGINA - 1);

  const totalPaginas = Math.max(1, Math.ceil((count ?? 0) / PAGINA));

  function hrefCon(cambios: Record<string, string | undefined>) {
    const params = new URLSearchParams({ cat: categoria!.key });
    if (searchParams.lugar) params.set("lugar", searchParams.lugar);
    if (searchParams.grupo) params.set("grupo", searchParams.grupo);
    for (const [k, v] of Object.entries(cambios)) {
      if (v) params.set(k, v);
      else params.delete(k);
    }
    params.delete("pagina");
    return `/rutinas?${params.toString()}`;
  }

  return (
    <main className="min-h-dvh px-6 py-8 pb-24">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">
            {categoria.icono} {categoria.label}
          </h1>
          <Link href="/rutinas" className="text-sm text-white/60 hover:text-white">
            Cambiar categoría
          </Link>
        </div>

        {/* Filtros secundarios */}
        <div className="mb-4 space-y-2">
          <div className="flex flex-wrap gap-2">
            <Link
              href={hrefCon({ lugar: undefined })}
              className={`rounded-full px-3 py-1 text-xs ${!searchParams.lugar ? "bg-brand-500" : "bg-white/10"}`}
            >
              Todos los lugares
            </Link>
            {["casa", "gimnasio"].map((l) => (
              <Link
                key={l}
                href={hrefCon({ lugar: l })}
                className={`rounded-full px-3 py-1 text-xs capitalize ${searchParams.lugar === l ? "bg-brand-500" : "bg-white/10"}`}
              >
                {l}
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={hrefCon({ grupo: undefined })}
              className={`rounded-full px-3 py-1 text-xs ${!searchParams.grupo ? "bg-brand-500" : "bg-white/10"}`}
            >
              Todos los músculos
            </Link>
            {GRUPOS.map((g) => (
              <Link
                key={g.key}
                href={hrefCon({ grupo: g.key })}
                className={`rounded-full px-3 py-1 text-xs ${searchParams.grupo === g.key ? "bg-brand-500" : "bg-white/10"}`}
              >
                {g.label}
              </Link>
            ))}
          </div>
        </div>

        <p className="mb-3 text-xs text-white/40">{count ?? 0} rutinas encontradas</p>

        {/* Lista (paginada, máximo 12 a la vez) */}
        <div className="space-y-3">
          {(rutinas ?? []).map((r) => (
            <Link
              key={r.id}
              href={`/entrenamiento/${r.id}`}
              className="card fade-in block transition hover:border-brand-500"
            >
              <h2 className="mb-1 font-bold">{r.nombre}</h2>
              <div className="flex flex-wrap gap-3 text-xs text-white/50">
                <span>⏱ {r.duracion_min ?? "—"} min</span>
                <span className="capitalize">📍 {r.lugar_entreno}</span>
                {(r.musculos ?? []).length > 0 && <span>💪 {r.musculos!.join(", ")}</span>}
              </div>
            </Link>
          ))}

          {(rutinas ?? []).length === 0 && (
            <p className="text-white/50">No hay rutinas con esos filtros.</p>
          )}
        </div>

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="mt-5 flex items-center justify-center gap-3 text-sm">
            <Link
              href={`${hrefCon({})}&pagina=${pagina - 1}`}
              className={`btn-secondary px-4 py-2 ${pagina <= 1 ? "pointer-events-none opacity-30" : ""}`}
            >
              ← Anterior
            </Link>
            <span className="text-white/50">
              {pagina} / {totalPaginas}
            </span>
            <Link
              href={`${hrefCon({})}&pagina=${pagina + 1}`}
              className={`btn-secondary px-4 py-2 ${pagina >= totalPaginas ? "pointer-events-none opacity-30" : ""}`}
            >
              Siguiente →
            </Link>
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
