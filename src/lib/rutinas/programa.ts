import { createClient } from "@/lib/supabase/server";
import type { Rutina } from "@/types/database";

type SupabaseServer = ReturnType<typeof createClient>;

const ROTACION_1: string[] = ["pecho", "espalda", "piernas", "hombro", "biceps", "triceps", "core"];
const ROTACION_2: [string, string][] = [
  ["pecho", "triceps"],
  ["espalda", "biceps"],
  ["piernas", "gluteos"],
  ["hombro", "core"],
];

/**
 * Rutina del programa para "hoy", según el nivel del usuario, cuántos músculos
 * quiere entrenar por sesión, y en qué día de su rotación va (programa_dia_actual).
 * Si hay varias variantes numeradas para el músculo del día, rota entre ellas
 * también, así el programa no repite la misma rutina cada vuelta del ciclo.
 */
export async function getRutinaPrograma(
  supabase: SupabaseServer,
  nivel: string | null,
  musculosPorSesion: number | null,
  diaActual: number
): Promise<{ rutina: Rutina | null; musculosDeHoy: string[] }> {
  const nivelEfectivo = nivel ?? "intermedio";

  if (musculosPorSesion === 2) {
    const [m1, m2] = ROTACION_2[diaActual % ROTACION_2.length];
    const { data } = await supabase
      .from("rutinas")
      .select("*")
      .eq("nivel", nivelEfectivo)
      .eq("musculos", `{${m1},${m2}}`)
      .limit(1);
    return { rutina: (data?.[0] as Rutina) ?? null, musculosDeHoy: [m1, m2] };
  }

  const musculo = ROTACION_1[diaActual % ROTACION_1.length];
  const { data } = await supabase
    .from("rutinas")
    .select("*")
    .eq("nivel", nivelEfectivo)
    .eq("musculos", `{${musculo}}`);

  const variantes = data ?? [];
  if (variantes.length === 0) return { rutina: null, musculosDeHoy: [musculo] };

  const vuelta = Math.floor(diaActual / ROTACION_1.length);
  const elegida = variantes[vuelta % variantes.length] as Rutina;
  return { rutina: elegida, musculosDeHoy: [musculo] };
}
