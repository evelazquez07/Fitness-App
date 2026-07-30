import { createClient } from "@/lib/supabase/server";
import type { Profile, Rutina, RutinaEjercicio } from "@/types/database";

type SupabaseServer = ReturnType<typeof createClient>;

/**
 * Elige una rutina activa que coincida con el objetivo, nivel y lugar de
 * entreno del perfil. Si no hay coincidencia exacta, relaja los filtros
 * en cascada para siempre devolver algo entrenable.
 */
export async function getRutinaDeHoy(
  supabase: SupabaseServer,
  profile: Pick<Profile, "objetivo_id" | "nivel" | "lugar_entreno">
): Promise<Rutina | null> {
  const desde = () => supabase.from("rutinas").select("*").eq("activa", true);

  const intentos = [
    () =>
      desde()
        .eq("objetivo_id", profile.objetivo_id ?? "")
        .eq("nivel", profile.nivel ?? "")
        .in("lugar_entreno", [profile.lugar_entreno ?? "", "ambos"]),
    () => desde().eq("objetivo_id", profile.objetivo_id ?? ""),
    () => desde().in("lugar_entreno", [profile.lugar_entreno ?? "", "ambos"]),
    () => desde(),
  ];

  for (const intento of intentos) {
    const { data } = await intento().limit(1);
    if (data && data.length > 0) return data[0] as Rutina;
  }

  return null;
}

export async function getEjerciciosDeRutina(
  supabase: SupabaseServer,
  rutinaId: string
): Promise<RutinaEjercicio[]> {
  const { data } = await supabase
    .from("rutina_ejercicios")
    .select("*, ejercicio:ejercicios(*)")
    .eq("rutina_id", rutinaId)
    .order("orden");

  return (data ?? []) as unknown as RutinaEjercicio[];
}

export async function getEstadisticasUsuario(
  supabase: SupabaseServer,
  userId: string
) {
  const desde = new Date();
  desde.setDate(desde.getDate() - 7);

  const { data: historial } = await supabase
    .from("entrenamientos_realizados")
    .select("duracion_min, realizado_en")
    .eq("user_id", userId)
    .gte("realizado_en", desde.toISOString());

  const entrenamientosSemana = historial?.length ?? 0;
  const minutosSemana = (historial ?? []).reduce(
    (acc: number, h: { duracion_min: number | null }) => acc + (h.duracion_min ?? 0),
    0
  );

  return { entrenamientosSemana, minutosSemana };
}
