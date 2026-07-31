import { createClient } from "@/lib/supabase/server";

type SupabaseServer = ReturnType<typeof createClient>;

export async function getLogrosUsuario(supabase: SupabaseServer, userId: string) {
  const [{ data: logros }, { data: desbloqueados }] = await Promise.all([
    supabase.from("logros").select("*"),
    supabase.from("usuario_logros").select("logro_id, desbloqueado_en").eq("user_id", userId),
  ]);

  const mapaDesbloqueo = new Map((desbloqueados ?? []).map((d) => [d.logro_id, d.desbloqueado_en]));

  return (logros ?? [])
    .map((l) => ({
      ...l,
      desbloqueado: mapaDesbloqueo.has(l.id),
      desbloqueado_en: mapaDesbloqueo.get(l.id) ?? null,
    }))
    .sort((a, b) => Number(b.desbloqueado) - Number(a.desbloqueado));
}

const CONDICIONES: { id: string; cumple: (t: number, r: number) => boolean }[] = [
  { id: "primer_entrenamiento", cumple: (t) => t >= 1 },
  { id: "racha_6_dias", cumple: (_t, r) => r >= 6 },
  { id: "racha_7_dias", cumple: (_t, r) => r >= 7 },
  { id: "racha_15_dias", cumple: (_t, r) => r >= 15 },
  { id: "racha_20_dias", cumple: (_t, r) => r >= 20 },
  { id: "racha_30_dias", cumple: (_t, r) => r >= 30 },
  { id: "racha_60_dias", cumple: (_t, r) => r >= 60 },
  { id: "racha_120_dias", cumple: (_t, r) => r >= 120 },
  { id: "racha_365_dias", cumple: (_t, r) => r >= 365 },
  { id: "treinta_entrenamientos", cumple: (t) => t >= 30 },
];

/**
 * Revisa condiciones y desbloquea logros nuevos. Usa SELECT + INSERT (en vez de
 * upsert) para no depender de permisos de UPDATE por RLS. Devuelve los ids
 * recién desbloqueados en esta llamada, útil para animaciones/notificaciones.
 */
export async function revisarLogros(
  supabase: SupabaseServer,
  userId: string,
  totalEntrenamientos: number,
  rachaDias: number
): Promise<string[]> {
  const candidatos = CONDICIONES.filter((c) => c.cumple(totalEntrenamientos, rachaDias)).map(
    (c) => c.id
  );
  if (candidatos.length === 0) return [];

  const { data: yaTiene } = await supabase
    .from("usuario_logros")
    .select("logro_id")
    .eq("user_id", userId)
    .in("logro_id", candidatos);

  const idsExistentes = new Set((yaTiene ?? []).map((d) => d.logro_id));
  const nuevos = candidatos.filter((id) => !idsExistentes.has(id));
  if (nuevos.length === 0) return [];

  const { error } = await supabase
    .from("usuario_logros")
    .insert(nuevos.map((logro_id) => ({ user_id: userId, logro_id })));

  return error ? [] : nuevos;
}
