import { createClient } from "@/lib/supabase/server";

type SupabaseServer = ReturnType<typeof createClient>;

export async function getLogrosUsuario(supabase: SupabaseServer, userId: string) {
  const [{ data: logros }, { data: desbloqueados }] = await Promise.all([
    supabase.from("logros").select("*"),
    supabase.from("usuario_logros").select("logro_id").eq("user_id", userId),
  ]);

  const idsDesbloqueados = new Set((desbloqueados ?? []).map((d) => d.logro_id));

  return (logros ?? []).map((l) => ({
    ...l,
    desbloqueado: idsDesbloqueados.has(l.id),
  }));
}

/** Revisa condiciones simples y desbloquea logros nuevos. Se llama al terminar un entrenamiento. */
export async function revisarLogros(
  supabase: SupabaseServer,
  userId: string,
  totalEntrenamientos: number,
  rachaDias: number
) {
  const candidatos: string[] = [];
  if (totalEntrenamientos >= 1) candidatos.push("primer_entrenamiento");
  if (rachaDias >= 7) candidatos.push("racha_7_dias");
  if (totalEntrenamientos >= 30) candidatos.push("treinta_entrenamientos");

  if (candidatos.length === 0) return;

  const filas = candidatos.map((logro_id) => ({ user_id: userId, logro_id }));
  await supabase.from("usuario_logros").upsert(filas, { onConflict: "user_id,logro_id" });
}
